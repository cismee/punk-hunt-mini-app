import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { io } from 'socket.io-client';
import { useCachedGameData } from './hooks/useCachedData';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 350, height: 400 });
  const [isResizing, setIsResizing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [showUserMessagesOnly, setShowUserMessagesOnly] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);
  
  // Get wallet connection info
  const { address, isConnected: walletConnected } = useAccount();

  // Get game data from cache
  const cachedGameData = useCachedGameData();

  // Check if game has ended (winner is not null and not zero address)
  const gameEnded = cachedGameData.winner && 
                   cachedGameData.winner !== null && 
                   cachedGameData.winner !== '0x0000000000000000000000000000000000000000';

  // Format address for display - matches server.js format
  const formatAddress = (addr) => {
    if (!addr || addr === '0x0000000000000000000000000000000000000000') return 'TBD';
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const username = address ? formatAddress(address) : null;

  // Filter messages based on toggle state
  const filteredMessages = showUserMessagesOnly 
    ? messages.filter(msg => !msg.isSystem && msg.user !== 'SYSTEM')
    : messages;

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  // Handle mouse events for resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !chatRef.current) return;
      
      const rect = chatRef.current.getBoundingClientRect();
      const newWidth = Math.max(250, Math.min(600, rect.right - e.clientX));
      const newHeight = Math.max(200, Math.min(800, rect.bottom - e.clientY));
      
      setDimensions({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    if (isResizing) {
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'nw-resize';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // Socket.IO connection - matches server.js configuration
  useEffect(() => {
    console.log('Initializing WebSocket connection to punkhunt.gg...');
    
    // Connect to server with matching CORS origins
    const socket = io('https://punkhunt.gg', {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true
    });

    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus('Connected');
      console.log('Connected to backend chat server');
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      setConnectionStatus(`Disconnected: ${reason}`);
      console.log('Disconnected from backend chat server:', reason);
    });

    socket.on('connect_error', (error) => {
      setIsConnected(false);
      setConnectionStatus(`Connection Error: ${error.message}`);
      console.error('Connection error:', error);
    });

    // Load chat history when connected - server sends last 50 messages
    socket.on('chatHistory', (history) => {
      console.log('Received chat history:', history);
      setMessages(history || []);
    });

    // Listen for new chat messages from server
    socket.on('newChatMessage', (messageData) => {
      console.log('Received new message:', messageData);
      
      // Use a more robust duplicate check
      setMessages(prev => {
        const isDuplicate = prev.some(msg => {
          // Check for exact match on multiple fields
          const sameTimestamp = Math.abs(msg.timestamp - messageData.timestamp) < 1000; // Within 1 second
          const sameUser = msg.user === messageData.user;
          const sameMessage = msg.message === messageData.message;
          
          return sameTimestamp && sameUser && sameMessage;
        });
        
        if (isDuplicate) {
          console.log('Duplicate message detected, skipping:', messageData);
          return prev;
        }
        
        return [...prev, messageData];
      });
    });

    // Listen for contract events that affect game state
    socket.on('contractEvent', (eventData) => {
      console.log('Contract event received:', eventData);
    });

    // Listen for game state updates from server
    socket.on('gameStateUpdate', (gameState) => {
      console.log('Game state update:', gameState);
      // Could use this to update UI elements
    });

    socket.on('leaderboardUpdate', (leaderboard) => {
      console.log('Leaderboard update:', leaderboard);
      // Could use this to update leaderboard display
    });

    socketRef.current = socket;

    return () => {
      console.log('Cleaning up WebSocket connection...');
      socket.disconnect();
    };
  }, []); // Empty dependency array - only connect once

  const sendMessage = (e) => {
    e.preventDefault();
    
    // Server-side validation requires wallet connection, valid message, and connection
    if (!message.trim() || !walletConnected || !address || !isConnected || gameEnded) {
      console.warn('Cannot send message:', { 
        hasMessage: !!message.trim(), 
        walletConnected, 
        hasAddress: !!address, 
        isConnected, 
        gameEnded 
      });
      return;
    }

    const messageData = {
      user: username,
      message: message.trim().substring(0, 200) // Match server's 200 char limit
    };

    try {
      console.log('Sending message:', messageData);
      
      // DON'T add message to local state - let server broadcast it back
      // This prevents duplicates
      
      // Send to backend via Socket.IO - server handles spam prevention (2s cooldown)
      if (socketRef.current) {
        socketRef.current.emit('chatMessage', messageData);
      }
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div 
      ref={chatRef}
      style={{
        position: 'fixed',
        bottom: '0px',
        right: '20px',
        width: `${dimensions.width}px`,
        height: isMinimized ? '50px' : `${dimensions.height}px`,
        backgroundColor: '#fff',
        border: '3px solid #000',
        borderRadius: '0',
        zIndex: 1000,
        fontFamily: 'monospace',
        fontSize: '12px',
        overflow: 'hidden',
        transition: isResizing ? 'none' : 'height 0.3s ease',
        resize: 'none'
      }}
    >
      {/* Resize handle */}
      {!isMinimized && (
        <div
          onMouseDown={handleResizeStart}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '20px',
            height: '20px',
            cursor: 'nw-resize',
            backgroundColor: 'transparent',
            zIndex: 1001
          }}
          title="Drag to resize"
        />
      )}

      {/* Header with connection status */}
      <div style={{
        backgroundColor: isConnected ? '#f42a2a' : '#666',
        color: '#fff',
        padding: '8px 12px',
        fontWeight: 'bold',
        borderBottom: '2px solid #000',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer'
      }} onClick={() => setIsMinimized(!isMinimized)}>
        <span>TROLLBOX {isConnected ? '🟢' : '🔴'}</span>
        <span>{isMinimized ? '▲' : '▼'}</span>
      </div>

      {!isMinimized && (
        <>
          {/* Filter Toggle */}
          <div style={{
            padding: '6px 12px',
            backgroundColor: gameEnded ? '#f5f5f5' : '#f0f0f0',
            borderBottom: '1px solid #ddd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            opacity: gameEnded ? 0.6 : 1
          }}>
            <span style={{ color: gameEnded ? '#999' : '#000' }}>
              Show only user messages:
            </span>
            <label style={{ 
              cursor: gameEnded ? 'not-allowed' : 'pointer', 
              display: 'flex', 
              alignItems: 'center' 
            }}>
              <input
                type="checkbox"
                checked={showUserMessagesOnly}
                onChange={(e) => !gameEnded && setShowUserMessagesOnly(e.target.checked)}
                style={{ 
                  marginRight: '4px',
                  cursor: gameEnded ? 'not-allowed' : 'pointer'
                }}
                disabled={gameEnded}
              />
              <span style={{ 
                fontSize: '10px',
                color: gameEnded ? '#999' : (showUserMessagesOnly ? '#aa32d2' : '#666')
              }}>
                {showUserMessagesOnly ? 'ON' : 'OFF'}
              </span>
            </label>
          </div>

          {/* Final Results Display */}
          {gameEnded && (
            <div style={{
              padding: '15px',
              backgroundColor: '#ffef99',
              border: '2px solid #d4af37',
              margin: '5px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', marginBottom: '10px', color: '#d4af37' }}>
                FINAL RESULTS
              </div>
              <div style={{ marginBottom: '8px' }}>
                🏆 1st: <a 
                  href={`https://opensea.io/${cachedGameData.winner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ size: '1em', color: '#000', textDecoration: 'underline' }}
                >
                  {formatAddress(cachedGameData.winner)}
                </a>
              </div>
              <div style={{ marginBottom: '8px' }}>
                🥈 2nd: <a 
                  href={`https://opensea.io/${cachedGameData.secondPlace}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ size: '1em', color: '#000', textDecoration: 'underline' }}
                >
                  {formatAddress(cachedGameData.secondPlace)}
                </a>
              </div>
              <div style={{ marginBottom: '8px' }}>
                🥉 3rd: <a 
                  href={`https://opensea.io/${cachedGameData.thirdPlace}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ size: '1em', color: '#000', textDecoration: 'underline' }}
                >
                  {formatAddress(cachedGameData.thirdPlace)}
                </a>
              </div>
              <div style={{ color: '#ff4444', fontSize: '11px' }}>
                🎯 Top Shooter: <a 
                  href={`https://opensea.io/${cachedGameData.topShooter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ size: '1em', color: '#000', textDecoration: 'underline' }}
                >
                  {formatAddress(cachedGameData.topShooter)}
                </a>
              </div>
            </div>
          )}

          {/* Messages area - shows filtered messages */}
          <div style={{
            height: gameEnded 
              ? `${dimensions.height - 255}px` 
              : `${dimensions.height - 155}px`,
            overflowY: 'auto',
            padding: '10px',
            backgroundColor: '#f8f8f8'
          }}>
            {filteredMessages.length === 0 && (
              <div style={{ color: '#666', fontSize: '11px', textAlign: 'center', padding: '20px' }}>
                {!isConnected ? 'Connecting to chat...' :
                 gameEnded ? 'Game Over!' :
                 showUserMessagesOnly ? 'No user messages yet...' : 
                 'No messages yet...'}
              </div>
            )}
            
            {filteredMessages.map((msg, index) => (
              <div key={`${msg.timestamp}-${index}-${msg.user}`} style={{
                marginBottom: '5px',
                wordWrap: 'break-word'
              }}>
                <span style={{
                  color: msg.isSystem || msg.user === 'SYSTEM' ? '#aa32d2' : '#3a3afc',
                  fontWeight: 'bold'
                }}>
                  {msg.user === 'SYSTEM' ? '🤖' : `${msg.user}: `}
                </span>
                <span style={{ 
                  color: msg.isSystem || msg.user === 'SYSTEM' ? '#aa32d2' : '#000'
                }}>
                  {msg.message}
                </span>
                {msg.timestamp && (
                  <span style={{ 
                    color: '#999', 
                    fontSize: '10px', 
                    marginLeft: '5px' 
                  }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input - conditional based on wallet connection */}
          {walletConnected ? (
            <form onSubmit={sendMessage} style={{
              display: 'flex',
              padding: '8px',
              borderTop: '2px solid #000'
            }}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  gameEnded ? "Trollbox Closed" : 
                  !isConnected ? "Connecting..." :
                  "Type message..."
                }
                style={{
                  flex: 1,
                  padding: '5px',
                  border: '2px solid #000',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  marginRight: '5px',
                  backgroundColor: (gameEnded || !isConnected) ? '#f0f0f0' : '#fff',
                  color: (gameEnded || !isConnected) ? '#999' : '#000'
                }}
                maxLength={200}
                disabled={!isConnected || gameEnded}
              />
              <button
                type="submit"
                style={{
                  padding: '5px 10px',
                  backgroundColor: (isConnected && !gameEnded) ? '#97E500' : '#ccc',
                  border: '2px solid #000',
                  color: '#000',
                  fontWeight: 'bold',
                  cursor: (isConnected && !gameEnded) ? 'pointer' : 'not-allowed',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
                disabled={!isConnected || !message.trim() || gameEnded}
              >
                {gameEnded ? 'GAME OVER!' : 
                 !isConnected ? 'OFFLINE' : 'SEND'}
              </button>
            </form>
          ) : (
            <div style={{
              padding: '12px 8px',
              borderTop: '2px solid #000',
              textAlign: 'center',
              backgroundColor: '#fff',
              color: '#666',
              fontSize: '11px'
            }}>
              Connect wallet to send messages
            </div>
          )}

          {/* Status info */}
          <div style={{
            padding: '2px 8px',
            fontSize: '10px',
            color: '#666',
            textAlign: 'center'
          }}>
            {walletConnected ? username : 'Read-only'} | {filteredMessages.length}/{messages.length} messages
            {isConnected && (
              <span style={{ color: '#00aa00', marginLeft: '5px' }}>â— Live</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
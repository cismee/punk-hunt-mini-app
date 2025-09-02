import React, { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { io } from 'socket.io-client';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 350, height: 400 });
  const [isResizing, setIsResizing] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [finalResults, setFinalResults] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);
  
  // Get wallet connection info
  const { address, isConnected: walletConnected } = useAccount();

  // Format address for display - matches server.js format
  const formatAddress = (addr) => {
    if (!addr) return 'Anonymous';
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const username = address ? formatAddress(address) : null;

  // Read final placements from contract when game ends
  useEffect(() => {
    if (!gameEnded) return;
    
    const fetchFinalResults = async () => {
      try {
        // This would typically fetch from your leaderboard API
        const response = await fetch('https://punkhunt.gg/api/leaderboard');
        const data = await response.json();
        
        setFinalResults({
          winner: data.topHolders?.[0]?.address || "0x0000...0000",
          secondPlace: data.topHolders?.[1]?.address || "0x0000...0000", 
          thirdPlace: data.topHolders?.[2]?.address || "0x0000...0000",
          topShooter: { 
            address: data.topHunters?.[0]?.address || "0x0000...0000", 
            zaps: data.topHunters?.[0]?.zapCount || 0 
          }
        });
      } catch (error) {
        console.error('Error fetching final results:', error);
        setFinalResults({
          winner: "0x0000...0000",
          secondPlace: "0x0000...0000", 
          thirdPlace: "0x0000...0000",
          topShooter: { address: "0x0000...0000", zaps: 0 }
        });
      }
    };

    fetchFinalResults();
  }, [gameEnded]);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    console.log('🔌 Initializing WebSocket connection to punkhunt.gg...');
    
    // Connect to server with matching CORS origins
    const socket = io('https://punkhunt.gg', {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true
    });

    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionStatus('Connected');
      console.log('✅ Connected to backend chat server');
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      setConnectionStatus(`Disconnected: ${reason}`);
      console.log('❌ Disconnected from backend chat server:', reason);
    });

    socket.on('connect_error', (error) => {
      setIsConnected(false);
      setConnectionStatus(`Connection Error: ${error.message}`);
      console.error('🚫 Connection error:', error);
    });

    // Load chat history when connected - server sends last 50 messages
    socket.on('chatHistory', (history) => {
      console.log('📜 Received chat history:', history);
      setMessages(history || []);
    });

    // Listen for new chat messages from server
    socket.on('newChatMessage', (messageData) => {
      console.log('💬 Received new message:', messageData);
      
      // Only add if not duplicate (in case of wallet connected users)
      setMessages(prev => {
        const isDuplicate = prev.some(msg => 
          msg.timestamp === messageData.timestamp && 
          msg.user === messageData.user && 
          msg.message === messageData.message
        );
        
        if (isDuplicate) {
          return prev;
        }
        
        return [...prev, messageData];
      });
    });

    // Listen for contract events that affect game state
    socket.on('contractEvent', (eventData) => {
      console.log('📊 Contract event received:', eventData);
      
      // Check if game ended (only 1 duck remaining)
      if (eventData.type === 'PlayerEliminated' && eventData.remainingSupply === 1) {
        setGameEnded(true);
      }
    });

    // Listen for game state updates from server
    socket.on('gameStateUpdate', (gameState) => {
      console.log('🎮 Game state update:', gameState);
      // Could use this to update UI elements
    });

    socket.on('leaderboardUpdate', (leaderboard) => {
      console.log('🏆 Leaderboard update:', leaderboard);
      // Could use this to update leaderboard display
    });

    socketRef.current = socket;

    return () => {
      console.log('🔌 Cleaning up WebSocket connection...');
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
      console.log('📤 Sending message:', messageData);
      
      // Add message to local state immediately for instant feedback
      const localMessage = {
        ...messageData,
        timestamp: Date.now(),
        isSystem: false
      };
      setMessages(prev => [...prev, localMessage]);
      
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
        <span>
          TROLLBOX {isConnected ? '🟢' : '🔴'} 
          {!isMinimized && (
            <span style={{ fontSize: '10px', marginLeft: '5px' }}>
              {connectionStatus}
            </span>
          )}
        </span>
        <span>{isMinimized ? '▲' : '▼'}</span>
      </div>

      {!isMinimized && (
        <>
          {/* Final Results Display */}
          {gameEnded && finalResults && (
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
                1st: {formatAddress(finalResults.winner)}
              </div>
              <div style={{ marginBottom: '8px' }}>
                2nd: {formatAddress(finalResults.secondPlace)}
              </div>
              <div style={{ marginBottom: '8px' }}>
                3rd: {formatAddress(finalResults.thirdPlace)}
              </div>
              <div style={{ color: '#ff4444', fontSize: '11px' }}>
                Top Shooter: {formatAddress(finalResults.topShooter.address)} ({finalResults.topShooter.zaps} zaps)
              </div>
            </div>
          )}

          {/* Messages area - always visible, shows server messages */}
          <div style={{
            height: gameEnded && finalResults ? `${dimensions.height - 220}px` : `${dimensions.height - 120}px`,
            overflowY: 'auto',
            padding: '10px',
            backgroundColor: '#f8f8f8'
          }}>
            {messages.length === 0 && isConnected && (
              <div style={{ color: '#666', fontSize: '11px', textAlign: 'center', padding: '20px' }}>
                Chat is loading...
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div key={`${msg.timestamp}-${index}`} style={{
                marginBottom: '5px',
                wordWrap: 'break-word'
              }}>
                <span style={{
                  color: msg.isSystem || msg.user === 'SYSTEM' ? '#aa32d2' : '#3a3afc',
                  fontWeight: 'bold'
                }}>
                  {msg.user === 'SYSTEM' ? '🤖 ' : `${msg.user}: `}
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
                  gameEnded ? "Game ended - chat disabled" : 
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
                {gameEnded ? 'GAME OVER' : 
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
            {walletConnected ? username : 'Read-only'} | {messages.length} messages
            {isConnected && (
              <span style={{ color: '#00aa00', marginLeft: '5px' }}>● Live</span>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
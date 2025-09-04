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
  const [showOnlyUserMessages, setShowOnlyUserMessages] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);
  
  // Get wallet connection info
  const { address, isConnected: walletConnected } = useAccount();

  // Format address for display
  const formatAddress = (addr) => {
    if (!addr) return 'Anonymous';
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const username = address ? formatAddress(address) : null;

  // Filter messages based on toggle
  const filteredMessages = showOnlyUserMessages 
    ? messages.filter(msg => !msg.isSystem && msg.user !== 'SYSTEM')
    : messages;

  // Read final placements from contract
  useEffect(() => {
    if (!gameEnded) return;
    
    const fetchFinalResults = async () => {
      try {
        setFinalResults({
          winner: "0x0000...0000",
          secondPlace: "0x0000...0000", 
          thirdPlace: "0x0000...0000",
          topShooter: { address: "0x0000...0000", zaps: 0 }
        });
      } catch (error) {
        console.error('Error fetching final results:', error);
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

  // Socket.IO connection - NOW CONNECTS REGARDLESS OF WALLET STATE
  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    const socket = io(API_URL);

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to backend chat server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from backend chat server');
    });

    // Load chat history when connected - ALWAYS RECEIVE MESSAGES
    socket.on('chatHistory', (history) => {
      console.log('Received chat history:', history);
      setMessages(history || []);
    });

    // Listen for new chat messages - ALWAYS RECEIVE MESSAGES
    socket.on('newChatMessage', (messageData) => {
      console.log('Received new message:', messageData);
      // Don't duplicate your own messages (only applies if wallet connected)
      if (!walletConnected || messageData.user !== username) {
        setMessages(prev => [...prev, messageData]);
      }
    });

    // Listen for contract events (for non-chat purposes only)
    socket.on('contractEvent', (eventData) => {
      console.log('Contract event received:', eventData);
      
      // Only handle game state changes, not chat messages
      if (eventData.type === 'PlayerEliminated' && eventData.remainingSupply === 1) {
        setGameEnded(true);
      }
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [username, walletConnected]); // Removed walletConnected from main dependency - only affects duplicate filtering

  const sendMessage = (e) => {
    e.preventDefault();
    
    // ONLY CHECK WALLET CONNECTION FOR SENDING MESSAGES
    if (!message.trim() || !walletConnected || !address || !isConnected || gameEnded) return;

    const messageData = {
      user: username,
      message: message.trim()
    };

    try {
      // Add message to local state immediately
      setMessages(prev => [...prev, messageData]);
      
      // Send to backend via Socket.IO
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

      {/* Header */}
      <div style={{
        backgroundColor: '#f42a2a',
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
            padding: '6px 8px',
            backgroundColor: '#f0f0f0',
            borderBottom: '1px solid #ccc',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px'
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              color: '#333'
            }}>
              Show Only User Messages:
              <input
                type="checkbox"
                checked={showOnlyUserMessages}
                onChange={(e) => setShowOnlyUserMessages(e.target.checked)}
                style={{ 
                  margin: '0 5px',
                  cursor: 'pointer'
                }}
              />
              <span style={{ 
                color: showOnlyUserMessages ? '#aa32d2' : '#333',
                fontWeight: 'bold'
              }}>
                {showOnlyUserMessages ? 'ON' : 'OFF'}
              </span>
            </label>
          </div>

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

          {/* Messages area - NOW ALWAYS VISIBLE */}
          <div style={{
            height: gameEnded && finalResults 
              ? `${dimensions.height - 250}px` 
              : `${dimensions.height - 150}px`,
            overflowY: 'auto',
            padding: '10px',
            backgroundColor: '#f8f8f8'
          }}>
            {/* Show empty state message when filter is on but no user messages */}
            {showOnlyUserMessages && filteredMessages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: '#999',
                fontStyle: 'italic',
                marginTop: '20px'
              }}>
                No User Messages Yet...
              </div>
            ) : (
              filteredMessages.map((msg, index) => (
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
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input - CONDITIONAL RENDERING BASED ON WALLET */}
          {walletConnected ? (
            // Connected user - show input form
            <form onSubmit={sendMessage} style={{
              display: 'flex',
              padding: '8px',
              borderTop: '2px solid #000'
            }}>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={gameEnded ? "Game ended - chat disabled" : "Type message..."}
                style={{
                  flex: 1,
                  padding: '5px',
                  border: '2px solid #000',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  marginRight: '5px',
                  backgroundColor: gameEnded ? '#f0f0f0' : '#fff',
                  color: gameEnded ? '#999' : '#000'
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
                {gameEnded ? 'GAME OVER' : 'SEND'}
              </button>
            </form>
          ) : (
            // Not connected - show connect prompt instead of input
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
            {walletConnected ? username : 'Read-only'} | {filteredMessages.length} messages | <span style={{ color: isConnected ? '#125000' : '#f42a2a', fontWeight: 'bold' }}>LIVE</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
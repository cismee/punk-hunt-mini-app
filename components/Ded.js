// components/Ded.js - Enhanced with better state management
import { useAccount } from 'wagmi';
import { useState, useEffect, useRef } from 'react';
import { useGameContract } from './hooks/useGameContract';
import { useCachedGameData, useCachedUserData } from './hooks/useCachedData';
import { usePublicClient } from 'wagmi';
import { CONTRACTS } from './contracts';
import { decodeEventLog } from 'viem';

const pepe = '/img/rekt_animation_002.gif';

// Simple solid-frame progress bar with checker pattern
function PixelProgress({
  value,
  max = 100,
  height = 16,
  frame = '#000',
  track = '#fff',
  fill  = '#f42a2a',
  padding = 4
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const checkerSize = 1;
  
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      style={{
        border: `3px solid ${frame}`,
        padding,
        background: 'transparent',
        width: '100%',
      }}
    >
      <div style={{ height, background: track, position: 'relative', overflow: 'hidden' }}>
        <div 
          style={{ 
            height: '100%', 
            width: `${pct}%`, 
            background: `
              repeating-conic-gradient(
                ${fill} 0% 25%, 
                ${track} 25% 50%, 
                ${fill} 50% 75%, 
                ${track} 75% 100%
              )
            `,
            backgroundSize: `${checkerSize}px ${checkerSize}px`
          }} 
        />
      </div>
    </div>
  );
}

// SentZapper event ABI for decoding
const SENT_ZAPPER_EVENT_ABI = {
  type: 'event',
  name: 'SentZapper',
  inputs: [
    { name: 'from', type: 'address', indexed: true },
    { name: 'tokenId', type: 'uint256', indexed: true },
    { name: 'hit', type: 'bool', indexed: false },
    { name: 'owned', type: 'bool', indexed: false },
    { name: 'ducksRemaining', type: 'uint256', indexed: false },
    { name: 'zappersRemaining', type: 'uint256', indexed: false }
  ]
};

export default function Ded() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('5');
  const [huntingStartSupply, setHuntingStartSupply] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [processedHashes, setProcessedHashes] = useState(new Set());
  const [eventProcessingComplete, setEventProcessingComplete] = useState(false);
  const publicClient = usePublicClient();
  const lastNotificationRef = useRef(null);
  
  const cachedGameData = useCachedGameData();
  const cachedUserData = useCachedUserData(address);
  
  const {
    sendZappers,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    transactionStage,
    isTransacting,
    resetTransactionState
  } = useGameContract();

  // Enhanced event fetching when transaction is confirmed
  useEffect(() => {
    const fetchTransactionEvents = async () => {
      if (isConfirmed && hash && address && amount && !processedHashes.has(hash)) {
        console.log('Transaction confirmed, fetching events for hash:', hash);
        
        setProcessedHashes(prev => new Set([...prev, hash]));
        setEventProcessingComplete(false);
        
        try {
          const receipt = await publicClient.getTransactionReceipt({ hash });
          console.log('Transaction receipt:', receipt);
          
          const mainContractLogs = receipt.logs.filter(log => 
            log.address.toLowerCase() === CONTRACTS.MAIN.toLowerCase()
          );
          
          console.log('Main contract logs:', mainContractLogs);
          
          if (mainContractLogs.length === 0) {
            // No events found, create a generic notification
            const notification = {
              id: `shot-${hash}-${Date.now()}`,
              message: `${amount} Shots fired!`,
              txHash: hash,
              backgroundColor: '#97E500',
              timestamp: Date.now()
            };
            
            setNotifications(prev => [...prev, notification]);
            setTimeout(() => {
              setNotifications(prev => prev.filter(n => n.id !== notification.id));
            }, 6000);
          } else {
            // Process each event log
            mainContractLogs.forEach((log, index) => {
              let notification;
              
              try {
                const decodedLog = decodeEventLog({
                  abi: [SENT_ZAPPER_EVENT_ABI],
                  data: log.data,
                  topics: log.topics
                });
                
                const { tokenId, hit, owned } = decodedLog.args;
                
                if (!hit) {
                  notification = {
                    id: `miss-${hash}-${index}-${Date.now()}`,
                    message: "You Missed!",
                    txHash: hash,
                    backgroundColor: '#fbb304',
                    timestamp: Date.now()
                  };
                } else if (owned) {
                  notification = {
                    id: `friendly-fire-${hash}-${index}-${Date.now()}`,
                    message: `You Shot your Own Duck #${tokenId}!`,
                    txHash: hash,
                    backgroundColor: '#f42a2a',
                    timestamp: Date.now()
                  };
                } else {
                  notification = {
                    id: `hit-${hash}-${index}-${Date.now()}`,
                    message: `You hit Duck #${tokenId}!`,
                    txHash: hash,
                    backgroundColor: '#339c1d',
                    timestamp: Date.now()
                  };
                }
                
              } catch (decodeError) {
                console.error('Failed to decode log:', decodeError);
                notification = {
                  id: `generic-shot-${hash}-${index}-${Date.now()}`,
                  message: `Shot fired!`,
                  txHash: hash,
                  backgroundColor: '#97E500',
                  timestamp: Date.now()
                };
              }
              
              // Stagger notifications with delay
              setTimeout(() => {
                setNotifications(prev => {
                  // Prevent duplicates
                  const isDuplicate = prev.some(existing => 
                    existing.txHash === hash && existing.message === notification.message
                  );
                  
                  if (isDuplicate) {
                    console.log('Preventing duplicate shooting notification');
                    return prev;
                  }
                  
                  return [...prev, notification];
                });
                
                // Auto-remove notification after 6 seconds
                setTimeout(() => {
                  setNotifications(prev => prev.filter(n => n.id !== notification.id));
                }, 6000);
              }, index * 200);
            });
          }
          
          setEventProcessingComplete(true);
          
        } catch (error) {
          console.error('Error fetching transaction events:', error);
          
          // Fallback notification on error
          const fallbackNotification = {
            id: `fallback-${hash}-${Date.now()}`,
            message: `${amount} Shots fired!`,
            txHash: hash,
            backgroundColor: '#97E500',
            timestamp: Date.now()
          };
          
          setNotifications(prev => [...prev, fallbackNotification]);
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== fallbackNotification.id));
          }, 6000);
          
          setEventProcessingComplete(true);
        }
      }
    };
    
    fetchTransactionEvents();
  }, [isConfirmed, hash, address, publicClient, amount, processedHashes]);

  // Reset transaction state when amount changes
  useEffect(() => {
    if (transactionStage === 'idle' && amount !== lastNotificationRef.current?.amount) {
      lastNotificationRef.current = null;
      setEventProcessingComplete(false);
    }
  }, [amount, transactionStage]);

  const closeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Track when hunting season first opens and capture duck supply
  useEffect(() => {
    if (cachedGameData.huntingSeason && huntingStartSupply === 0 && cachedGameData.ducksMinted > 0) {
      const currentSupply = cachedGameData.ducksMinted - cachedGameData.ducksRekt;
      setHuntingStartSupply(currentSupply);
      console.log('Hunting season opened with supply:', currentSupply);
    }
  }, [cachedGameData.huntingSeason, cachedGameData.ducksMinted, cachedGameData.ducksRekt, huntingStartSupply]);

  // Update user's zapper balance periodically
  useEffect(() => {
    if (isConnected && address) {
      const interval = setInterval(() => {
        cachedUserData.refetch();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isConnected, address, cachedUserData]);

  const handleShoot = async () => {
    console.log('Shoot button clicked', { 
      isConnected, 
      amount, 
      address, 
      huntingSeason: cachedGameData.huntingSeason,
      transactionStage,
      zapperBalance: cachedUserData.zapperBalance
    });
    
    if (window.playButtonSound) {
      window.playButtonSound('burn');
    }
    
    if (!isConnected) {
      console.log('Wallet not connected');
      return;
    }
    
    if (!cachedGameData.huntingSeason) {
      console.log('Hunting season not active');
      return;
    }
    
    if (!amount || amount <= 0) {
      console.log('Invalid amount:', amount);
      return;
    }

    if (parseInt(amount) > cachedUserData.zapperBalance) {
      console.log('Not enough zappers:', { 
        requested: amount, 
        available: cachedUserData.zapperBalance 
      });
      return;
    }

    // Prevent multiple transactions
    if (isTransacting) {
      console.log('Shooting transaction already in progress');
      return;
    }
    
    try {
      console.log('Attempting to shoot zappers...', { 
        amount: parseInt(amount), 
        address,
        stage: transactionStage 
      });
      
      await sendZappers(parseInt(amount));
      
      // Refresh user data after initiating transaction
      setTimeout(() => cachedUserData.refetch(), 2000);
      
    } catch (err) {
      console.error('Shooting failed:', err);
      // Error is handled by the hook
    }
  };

  const getButtonText = () => {
    if (!isConnected) return 'CONNECT WALLET';
    
    const liveDucks = cachedGameData.ducksMinted - cachedGameData.ducksRekt;
    if (liveDucks <= 1) return 'HUNTING SZN CLOSED';
    
    if (!cachedGameData.huntingSeason) return 'HUNTING SZN SOON';
    if (parseInt(amount) > cachedUserData.zapperBalance) {
      return `NEED ${amount - cachedUserData.zapperBalance} MORE ZAPPERS`;
    }
    
    // Use enhanced transaction state
    switch (transactionStage) {
      case 'preparing':
        return 'PREPARING...';
      case 'pending':
        return 'CONFIRM IN WALLET...';
      case 'confirming':
        return 'FIRING...';
      case 'confirmed':
        return 'SHOTS FIRED!';
      case 'error':
        return 'TRY AGAIN';
      default:
        return `SHOOT ${amount} DUCKS!`;
    }
  };

  const isButtonDisabled = () => {
    const liveDucks = cachedGameData.ducksMinted - cachedGameData.ducksRekt;
    return !isConnected || 
           liveDucks <= 1 ||
           !cachedGameData.huntingSeason || 
           isTransacting || 
           !amount || 
           parseInt(amount) <= 0 ||
           parseInt(amount) > cachedUserData.zapperBalance;
  };

  const getButtonClass = () => {
    let baseClass = "btn-nes is-warning p-2 min-h-[44px] touch-manipulation";
    
    if (isButtonDisabled()) {
      baseClass += " opacity-60 cursor-not-allowed";
    }
    
    if (transactionStage === 'error') {
      baseClass += " !bg-red-100 !border-red-400 !text-red-700";
    } else if (transactionStage === 'confirmed') {
      baseClass += " !bg-green-100 !border-green-400";
    }
    
    return baseClass;
  };

  const getProgressValue = () => {
    if (cachedGameData.ducksMinted === 0) return 0;
    const progress = (cachedGameData.ducksRekt / cachedGameData.ducksMinted) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  return (
    <>
      {/* Enhanced Notifications with different colors based on result */}
      <div className="fixed top-20 right-2 z-50 flex flex-col gap-2 max-w-[320px]">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="text-white p-3 rounded-lg shadow-lg animate-slide-down border-l-4"
            style={{
              backgroundColor: notification.backgroundColor,
              borderLeftColor: notification.backgroundColor === '#339c1d' ? '#22c55e' : 
                              notification.backgroundColor === '#f42a2a' ? '#ef4444' :
                              notification.backgroundColor === '#fbb304' ? '#f59e0b' : '#84cc16',
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both'
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="mb-2 font-bold text-sm">
                  {notification.message.includes('hit Duck') ? '🎯 ' : 
                   notification.message.includes('Missed') ? '❌ ' : 
                   notification.message.includes('Own Duck') ? '⚠️ ' : '🔫 '}
                  {notification.message}
                </div>
                <a 
                  href={`https://basescan.org/tx/${notification.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 underline text-xs hover:text-white transition-colors"
                >
                  VIEW TRANSACTION →
                </a>
              </div>
              <button
                onClick={() => closeNotification(notification.id)}
                className="bg-transparent border-none text-white text-xl cursor-pointer p-0 leading-none hover:opacity-70 transition-opacity"
                title="Close notification"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <section
        id="burn"
        className="relative overflow-hidden bg-[#ba92bb]"
      >
        <div className="py-2"></div>

        <div className="w-full px-2 sm:px-4 pt-4">
          <div className="flex flex-wrap">
            <div className="w-full text-center">
              <h1 className="p-2 text-black text-lg sm:text-xl lg:text-2xl font-bold">
                Shoot
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  max={cachedUserData.zapperBalance || 0}
                  className="nes-input mx-2 mb-2 p-2 w-12 sm:w-16 text-center"
                  style={{ fontSize: '16px' }}
                  id="shoot_field"
                  disabled={isTransacting}
                />
                Ducks!
              </h1>

              <button 
                className={getButtonClass()}
                onClick={handleShoot}
                disabled={isButtonDisabled()}
                title={isButtonDisabled() ? 'Cannot shoot right now' : 'Shoot ducks'}
              >
                {getButtonText()}
              </button>
              
              <div className="p-2 space-y-1">
                <div className="text-sm text-white">
                  <span className="text-black font-bold">TX FEE</span><br />
                  Zappers: {cachedUserData.zapperBalance || 0}
                </div>
                <h2 className="mt-2 text-base sm:text-lg font-bold"
                    style={{ 
                      color: cachedGameData.huntingSeason ? '#125000' : '#f42a2a'
                    }}>
                  {cachedGameData.huntingSeason ? "IT'S HUNTING SZN!" : "Hunting SZN Coming Soon"}
                </h2>
              </div>

              {/* Enhanced Error Display */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mt-2 text-xs max-w-md mx-auto">
                  <div className="font-bold">Transaction Error:</div>
                  <div>{error.shortMessage || error.message || error}</div>
                  <button 
                    onClick={resetTransactionState}
                    className="mt-1 text-red-600 underline text-xs"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Progress bar showing elimination progress */}
              <div className="mt-3 mx-auto w-3/4">
                <PixelProgress value={getProgressValue()} max={100} height={32} />
              </div>

              <h2 className="mt-2 text-black text-base sm:text-lg font-bold">
                {cachedGameData.ducksRekt}/{cachedGameData.ducksMinted} Ded Ducks!
              </h2>
              <h3 className="p-2 mx-2 text-black text-sm sm:text-base">
                The game ends when one duck remains.
              </h3>
              <a 
                href="#faq"
                onClick={(e) => {
                  e.preventDefault();
                  if (window.playButtonSound) {
                    window.playButtonSound('faq');
                  }
                  const element = document.getElementById('faq');
                  if (element) {
                    element.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                      inline: 'nearest'
                    });
                  }
                }}
                className="underline text-[#97e500] hover:text-[#97e500] block mt-2"
              >
                <h3 className="mb-4 mx-2 text-[#97e500] hover:text-[#97e500] underline text-sm sm:text-base font-bold">
                  Top Hunter Wins bluechip NFT! 
                </h3>
              </a>
            </div>
          </div>
        </div>
        
        {/* Pepe image in separate container - no gutters */}
        <div className="w-full">
          <img src={pepe} alt="Ded ducks illustration" className="w-full h-auto block" />
        </div>
      </section>

      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .touch-manipulation {
          touch-action: manipulation;
        }

        /* Enhanced button states */
        .btn-nes:disabled {
          cursor: not-allowed !important;
          opacity: 0.6;
        }
        
        .btn-nes:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
}
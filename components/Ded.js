// components/Ded.js
import { useAccount, useConnect } from 'wagmi';
import { useState, useEffect } from 'react';
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
  const { connect, connectors } = useConnect();
  const [amount, setAmount] = useState('5');
  const [huntingStartSupply, setHuntingStartSupply] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showShotsFired, setShowShotsFired] = useState(false);
  const [zappersSent, setZappersSent] = useState(null);
  const [processedHashes, setProcessedHashes] = useState(new Set());
  const [notificationCounter, setNotificationCounter] = useState(0);
  const publicClient = usePublicClient();
  
  const cachedGameData = useCachedGameData();
  const cachedUserData = useCachedUserData(address);
  
  const {
    sendZappers,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash
  } = useGameContract();

  // Check if game is over (winner is not zero address)
  const isGameOver = cachedGameData.winner && cachedGameData.winner !== '0x0000000000000000000000000000000000000000';

  // Fixed notification creation with better ID generation and batching
  useEffect(() => {
    const fetchTransactionEvents = async () => {
      if (isConfirmed && hash && address && zappersSent && !processedHashes.has(hash)) {
        console.log('Transaction confirmed, fetching events for hash:', hash);
        
        setProcessedHashes(prev => new Set([...prev, hash]));
        
        try {
          const receipt = await publicClient.getTransactionReceipt({ hash });
          console.log('Transaction receipt:', receipt);
          
          const mainContractLogs = receipt.logs.filter(log => 
            log.address.toLowerCase() === CONTRACTS.MAIN.toLowerCase()
          );
          
          console.log('Main contract logs:', mainContractLogs);
          
          // Batch process all notifications to avoid timing issues
          const newNotifications = [];
          
          mainContractLogs.forEach((log, index) => {
            let notification;
            
            try {
              const decodedLog = decodeEventLog({
                abi: [SENT_ZAPPER_EVENT_ABI],
                data: log.data,
                topics: log.topics
              });
              
              const { tokenId, hit, owned } = decodedLog.args;
              
              // Generate unique ID using counter + timestamp + index
              const uniqueId = `${Date.now()}_${notificationCounter + index}_${Math.random().toString(36).substr(2, 9)}`;
              
              if (!hit) {
                notification = {
                  id: uniqueId,
                  message: "You Missed!",
                  txHash: hash,
                  backgroundColor: '#fbb304'
                };
              } else if (owned) {
                notification = {
                  id: uniqueId,
                  message: `You Shot your Own Duck #${tokenId}!`,
                  txHash: hash,
                  backgroundColor: '#f42a2a'
                };
              } else {
                notification = {
                  id: uniqueId,
                  message: `You hit Duck #${tokenId}!`,
                  txHash: hash,
                  backgroundColor: '#339c1d'
                };
              }
              
            } catch (decodeError) {
              console.error('Failed to decode log:', decodeError);
              const uniqueId = `${Date.now()}_${notificationCounter + index}_${Math.random().toString(36).substr(2, 9)}`;
              notification = {
                id: uniqueId,
                message: `Shot fired!`,
                txHash: hash,
                backgroundColor: '#aa32d2'
              };
            }
            
            newNotifications.push(notification);
          });
          
          // Update counter for next batch
          setNotificationCounter(prev => prev + mainContractLogs.length);
          
          // Add notifications with staggered timing
          newNotifications.forEach((notification, index) => {
            setTimeout(() => {
              setNotifications(prev => [...prev, notification]);
              
              // Auto-remove after 5 seconds
              setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== notification.id));
              }, 5000);
            }, index * 150); // Reduced from 200ms to 150ms for faster display
          });
          
          setZappersSent(null);
          
        } catch (error) {
          console.error('Error fetching transaction events:', error);
          setZappersSent(null);
        }
      }
    };
    
    fetchTransactionEvents();
  }, [isConfirmed, hash, address, publicClient, zappersSent, processedHashes, notificationCounter]);

  // Enhanced close notification function
  const closeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Optional cleanup for excessive notifications
  useEffect(() => {
    if (notifications.length > 10) {
      const oldestIds = notifications.slice(0, notifications.length - 10).map(n => n.id);
      setNotifications(prev => prev.filter(n => !oldestIds.includes(n.id)));
    }
  }, [notifications.length]);

  // Reset button text after transaction confirms
  useEffect(() => {
    if (isConfirmed) {
      setShowShotsFired(true);
      const timer = setTimeout(() => {
        setShowShotsFired(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isConfirmed]);

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
      huntingSeason: cachedGameData.huntingSeason 
    });
    
    if (window.playButtonSound) {
      window.playButtonSound('burn');
    }
    
    if (!isConnected) {
      console.log('Wallet not connected, attempting to connect...');
      
      // Use the same connection logic as nav.js
      const injectedConnector = connectors.find(connector => 
        connector.id === 'injected' || connector.name.toLowerCase().includes('injected')
      );
      
      try {
        if (injectedConnector) {
          await connect({ connector: injectedConnector });
        } else if (connectors[0]) {
          await connect({ connector: connectors[0] });
        }
      } catch (err) {
        console.error('Wallet connection failed:', err);
      }
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
    
    console.log('Attempting to shoot zappers...', { amount: parseInt(amount), address });
    
    setZappersSent(parseInt(amount));
    
    try {
      await sendZappers(parseInt(amount));
      setTimeout(() => cachedUserData.refetch(), 2000);
    } catch (err) {
      console.error('Shooting failed:', err);
      setZappersSent(null);
    }
  };

  const getButtonText = () => {
    // HIGHEST PRIORITY: Check if game hasn't started yet
    if (!cachedGameData.gameStarted) {
      return 'LOADING ROM...';
    }
    
    if (isGameOver) return 'GAME OVER!';
    if (!isConnected) return 'CONNECT WALLET';
    
    const liveDucks = cachedGameData.ducksMinted - cachedGameData.ducksRekt;
    if (liveDucks <= 1) return 'HUNTING SZN CLOSED';
    
    if (!cachedGameData.huntingSeason) return 'HUNTING SZN SOON';
    if (parseInt(amount) > cachedUserData.zapperBalance) {
      return `NEED ${amount - cachedUserData.zapperBalance} MORE ZAPPERS`;
    }
    if (isPending) return 'CONFIRM IN WALLET...';
    if (isConfirming) return 'FIRING...';
    if (showShotsFired) return 'SHOTS FIRED!';
    return `SHOOT ${amount} DUCKS!`;
  };

  const isButtonDisabled = () => {
    // HIGHEST PRIORITY: Disable if game hasn't started
    if (!cachedGameData.gameStarted) {
      return true;
    }
    
    const liveDucks = cachedGameData.ducksMinted - cachedGameData.ducksRekt;
    return isGameOver ||
           liveDucks <= 1 ||
           (!isConnected && cachedGameData.huntingSeason) || 
           (!cachedGameData.huntingSeason && isConnected) ||
           isPending || 
           isConfirming || 
           !amount || 
           parseInt(amount) <= 0 ||
           (isConnected && parseInt(amount) > cachedUserData.zapperBalance);
  };

  const getProgressValue = () => {
    // If game is over, show 100%
    if (isGameOver) return 100;
    
    if (cachedGameData.ducksMinted === 0) return 0;
    const progress = (cachedGameData.ducksRekt / cachedGameData.ducksMinted) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const getDuckStatusText = () => {
    if (isGameOver) {
      return (
        <>
          GAME OVER!
        </>
      );
    }
    
    return `${cachedGameData.ducksRekt}/${cachedGameData.ducksMinted} Ded Ducks!`;
  };

  return (
    <>
      {/* Multiple Notifications - Fixed version with Tailwind */}
      <div className="fixed top-20 right-2 z-50 flex flex-col gap-2 w-80">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="text-white p-3 w-full shadow-lg animate-slide-down overflow-hidden break-words"
            style={{
              backgroundColor: notification.backgroundColor,
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both',
              boxShadow: '4px 4px 0 black'
            }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-2">
                <div className="mb-2 text-sm">
                  {notification.message}
                </div>
                <a 
                  href={`https://basescan.org/tx/${notification.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline text-xs"
                >
                  VIEW TX
                </a>
              </div>
              <button
                onClick={() => closeNotification(notification.id)}
                className="bg-transparent border-none text-white text-lg cursor-pointer p-0 leading-none flex-shrink-0"
              >
                ×
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
              <h1 className="p-2 text-black text-lg sm:text-xl lg:text-2xl">
                Shoot
<input
  type="number"
  value={amount}
  onChange={(e) => {
    const value = e.target.value;
    // If the value is greater than 50, set it to 50
    if (parseInt(value) > 50) {
      setAmount('50');
    } else {
      setAmount(value);
    }
  }}
  min="1"
  max="50"  // Changed from {cachedUserData.zapperBalance || 0} to "50"
  className="nes-input mx-2 mb-2 p-2 w-12 sm:w-16 text-center"
  style={{ fontSize: '16px' }}
  id="shoot_field"
  disabled={isGameOver}
/>
                Ducks!
              </h1>

              <button 
                className="btn-nes is-warning p-2 min-h-[44px] touch-manipulation"
                onClick={handleShoot}
                disabled={isButtonDisabled()}
              >
                {getButtonText()}
              </button>
              
              <div className="p-2 space-y-1">
                <div className="text-sm text-white">
                  <span className="text-black">TX FEE (50 MAX PER)</span><br />
                  Zappers: {cachedUserData.zapperBalance}
                </div>
                {/* Updated hunting season text - shows "GAME OVER!" in red when game ends */}
                {!isGameOver && (
                  <p className="mt-2 text-base sm:text-lg"
                      style={{ 
                        color: cachedGameData.huntingSeason ? '#97e500' : '#f42a2a'
                      }}>
                    {cachedGameData.huntingSeason ? "IT'S HUNTING SZN!" : "Hunting SZN Soon..."}
                  </p>
                )}
                {isGameOver && (
                  <p className="mt-2 text-sm sm:text-base" style={{ color: '#f42a2a' }}>
                    GAME OVER!
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mt-2 text-xs">
                  Error: {error.shortMessage || error.message}
                </div>
              )}

              {/* Progress bar showing elimination progress */}
              <div className="mt-3 mx-auto w-3/4">
                <PixelProgress value={getProgressValue()} max={100} height={32} />
              </div>

              <h2 className="mt-2 text-black text-base sm:text-lg">
                {getDuckStatusText()}
              </h2>
              <h3 className="p-2 mx-2 text-black text-sm sm:text-base">
                The game ends when one duck holder remains.
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
                <h3 className="mb-4 mx-2 text-[#97e500] hover:text-[#97e500] underline text-sm sm:text-base">
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
            transform: translateY(-20px);
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
      `}</style>
    </>
  );
}
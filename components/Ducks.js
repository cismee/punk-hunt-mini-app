// components/Ducks.js - Enhanced notification system
import { useAccount } from 'wagmi';
import { useState, useEffect, useRef } from 'react';
import { useGameContract } from './hooks/useGameContract';
import { useCachedGameData } from './hooks/useCachedData';

const duck = '/img/duck_animation_002.gif';
const fence = '/img/fence_alt.png';

function Ducks() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('5');
  const [timeLeft, setTimeLeft] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [processedHashes, setProcessedHashes] = useState(new Set());
  const lastMintAmount = useRef(null);
  
  // Use cached data instead of direct contract calls
  const cachedGameData = useCachedGameData();
  
  const {
    mintDucks,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    resetTransactionState
  } = useGameContract();

  // Store amount when starting transaction
  useEffect(() => {
    if (isPending && amount) {
      lastMintAmount.current = parseInt(amount);
      console.log('Stored mint amount for notification:', lastMintAmount.current);
    }
  }, [isPending, amount]);

  // Primary notification trigger - transaction confirmed
  useEffect(() => {
    if (isConfirmed && hash && lastMintAmount.current && !processedHashes.has(hash)) {
      console.log('Primary notification trigger - transaction confirmed:', { hash, amount: lastMintAmount.current });
      
      setProcessedHashes(prev => new Set([...prev, hash]));
      
      const notification = {
        id: `duck-${hash}-${Date.now()}`,
        amount: lastMintAmount.current,
        hash: hash,
        timestamp: Date.now(),
        source: 'confirmed'
      };
      
      setNotifications(prev => [...prev, notification]);
      
      // Remove notification after 6 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 6000);
      
      // Clear the stored amount
      lastMintAmount.current = null;
    }
  }, [isConfirmed, hash, processedHashes]);

  // Secondary notification trigger - listen for custom events
  useEffect(() => {
    const handleTransactionConfirmed = (event) => {
      const { hash: eventHash } = event.detail;
      
      if (eventHash && lastMintAmount.current && !processedHashes.has(eventHash)) {
        console.log('Secondary notification trigger - custom event:', { hash: eventHash, amount: lastMintAmount.current });
        
        setProcessedHashes(prev => new Set([...prev, eventHash]));
        
        const notification = {
          id: `duck-event-${eventHash}-${Date.now()}`,
          amount: lastMintAmount.current,
          hash: eventHash,
          timestamp: Date.now(),
          source: 'event'
        };
        
        setNotifications(prev => [...prev, notification]);
        
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 6000);
        
        lastMintAmount.current = null;
      }
    };

    window.addEventListener('transactionConfirmed', handleTransactionConfirmed);
    return () => window.removeEventListener('transactionConfirmed', handleTransactionConfirmed);
  }, [processedHashes]);

  // Fallback notification trigger - detect balance changes
  const previousDuckBalance = useRef(null);
  const { duckBalance } = cachedGameData;
  
  useEffect(() => {
    // If we have a stored mint amount and duck balance increased
    if (lastMintAmount.current && 
        previousDuckBalance.current !== null && 
        duckBalance > previousDuckBalance.current) {
      
      const balanceIncrease = duckBalance - previousDuckBalance.current;
      
      console.log('Fallback notification trigger - balance increase detected:', { 
        expected: lastMintAmount.current, 
        actual: balanceIncrease,
        newBalance: duckBalance 
      });
      
      // Create fallback notification if we haven't already notified for this amount
      const notification = {
        id: `duck-fallback-${Date.now()}`,
        amount: balanceIncrease,
        hash: hash || 'unknown',
        timestamp: Date.now(),
        source: 'fallback'
      };
      
      setNotifications(prev => [...prev, notification]);
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 6000);
      
      lastMintAmount.current = null;
    }
    
    previousDuckBalance.current = duckBalance;
  }, [duckBalance, hash]);

  const closeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Update countdown timer
  useEffect(() => {
    const mintEndTimestamp = cachedGameData.ducksMintEndTimestamp || 
                            (Math.floor(Date.now() / 1000) + (14 * 24 * 60 * 60));

    const updateTimer = () => {
      const now = Date.now();
      const endTime = mintEndTimestamp * 1000;
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft('HAPPY HUNTING!');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const formattedDays = days.toString().padStart(2, '0');
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');

      setTimeLeft(`${formattedDays}:${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [cachedGameData.ducksMintEndTimestamp]);

  const handleMint = async () => {
    console.log('Mint button clicked', { isConnected, amount, address });
    
    if (window.playButtonSound) {
      window.playButtonSound('ducks');
    }
    
    if (!isConnected || !amount || amount <= 0) {
      console.log('Cannot mint:', { isConnected, amount });
      return;
    }

    if (isPending || isConfirming) {
      console.log('Transaction already in progress');
      return;
    }
    
    try {
      await mintDucks(parseInt(amount));
    } catch (err) {
      console.error('Duck minting failed:', err);
    }
  };

  // Simplified button text logic
  const getButtonText = () => {
    if (!isConnected) return 'CONNECT WALLET';
    if (timeLeft === 'HAPPY HUNTING!') return 'MINT CLOSED';
    if (isPending) return 'CONFIRM IN WALLET...';
    if (isConfirming) return 'MINTING...';
    if (isConfirmed) return 'SUCCESS!';
    return `MINT ${amount} DUCKS`;
  };

  const calculateDuckPrizePool = () => {
    if (!cachedGameData.ducksMinted || !cachedGameData.duckPrice) return '0.000';
    const totalDuckRevenue = parseFloat(cachedGameData.duckPrice) * cachedGameData.ducksMinted;
    const prizePool = totalDuckRevenue * 0.5;
    return prizePool.toFixed(3);
  };

  const isButtonDisabled = () => {
    return !isConnected || 
           timeLeft === 'HAPPY HUNTING!' ||
           isPending || 
           isConfirming || 
           !amount || 
           parseInt(amount) <= 0;
  };

  return (
    <>
      {/* Notifications */}
      <div className="fixed top-20 right-2 z-50 flex flex-col gap-2 max-w-[320px]">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="bg-blue-600 text-white p-3 rounded-lg shadow-lg animate-slide-down border-l-4 border-blue-400"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both'
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="mb-2 font-bold text-sm">
                  🦆 You minted {notification.amount} ducks!
                </div>
                <a 
                  href={`https://basescan.org/tx/${notification.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 underline text-xs hover:text-white transition-colors"
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
        id="duckmint"
        className="relative overflow-hidden bg-[#3BC3FD]"
      >
        <div className="pt-3 mt-3"></div>
        <div className="w-full px-2 sm:px-4">
          <div className="flex flex-wrap">
            <div className="w-full text-center">
              <div className="hidden lg:block w-1/2 ml-auto p-2">
                <img src={duck} style={{ height: '6em' }} className="w-auto mx-auto" alt="Duck animation" />
              </div>
              <div className="block lg:hidden w-1/2 ml-auto">
                <img src={duck} style={{ height: '4em' }} className="w-auto mx-auto" alt="Duck animation" />
              </div>
              
              <h1 className="text-lg sm:text-xl lg:text-2xl text-black font-bold">
                Mint
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  className="nes-input p-2 mb-2 sm:w-16 text-center mx-2"
                  style={{ fontSize: '16px' }}
                  id="inline_field"
                  disabled={isPending || isConfirming}
                />
                Ducks!
              </h1>
              
              <button 
                className="btn-nes bg-white text-black font-bold text-lg uppercase p-2 cursor-pointer touch-manipulation"
                onClick={handleMint}
                disabled={isButtonDisabled()}
                style={{
                  opacity: isButtonDisabled() ? 0.6 : 1,
                  cursor: isButtonDisabled() ? 'not-allowed' : 'pointer'
                }}
              >
                {getButtonText()}
              </button>
              
              <div className="p-2 space-y-1">
                <p style={{ color: '#000', margin: 0 }} className="font-bold">
                  {cachedGameData.duckPrice ? `${cachedGameData.duckPrice}E each` : 'Loading price...'}
                </p>
                {timeLeft && (
                  <p className="mt-2 text-sm sm:text-base font-bold"
                     style={{ 
                       color: timeLeft === 'HAPPY HUNTING!' ? '#ea6126' : '#f42a2a'
                     }}>
                    {timeLeft === 'HAPPY HUNTING!' ? timeLeft : `Mint Ends in: ${timeLeft}`}
                  </p>
                )}
              </div>

              {/* Error Display */}
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

              <h2 className="pb-2 text-black text-base sm:text-lg font-bold">
                {cachedGameData.ducksMinted ?? '…'} Minted!
              </h2>
              
              <p className="text-black m-n4">Duck Prize Pool: <span className="text-white text-sm sm:text-base">{calculateDuckPrizePool()}E</span></p>

              <h3 className="mx-4 text-black text-sm sm:text-base">
                Mint a Duck, Get a Free Zapper.
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
                style={{ 
                  textDecoration: 'underline',
                  color: '#ff650b'
                }}
                className="block mt-2 mb-6"
              >
                <h3 style={{ color: '#ff650b' }} className="text-sm sm:text-base font-bold">
                  Last 3 ducks win bluechip NFTs!
                </h3>
              </a>
            </div>
          </div>
        </div>
        
        <div className="w-full">
          <img src={fence} className="w-full h-auto block" alt="Fence decoration" />
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
      `}</style>
    </>
  );
}

export default Ducks;
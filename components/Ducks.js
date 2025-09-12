// components/Ducks.js
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { useGameContract } from './hooks/useGameContract';
import { useCachedGameData } from './hooks/useCachedData';

const duck = '/img/duck_animation_002.gif';
const fence = '/img/fence_alt.png';

function Ducks() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('5');
  const [timeLeft, setTimeLeft] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mintedAmount, setMintedAmount] = useState(null);
  const [processedHashes, setProcessedHashes] = useState(new Set());
  
  // Use cached data instead of direct contract calls
  const cachedGameData = useCachedGameData();

  // Add the debug code here:
  console.log('Winner debug:', {
  winner: cachedGameData.winner,
  isGameOver: cachedGameData.winner && cachedGameData.winner !== '0x0000000000000000000000000000000000000000',
  comparison: cachedGameData.winner !== '0x0000000000000000000000000000000000000000'
  });
  
  const {
    mintDucks,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash
  } = useGameContract();

  // Check if game is over (winner is not zero address)
  const isGameOver = cachedGameData.winner && cachedGameData.winner !== '0x0000000000000000000000000000000000000000';

  // Show notifications when mint is confirmed and hash is available
  useEffect(() => {
    if (isConfirmed && hash && mintedAmount && !processedHashes.has(hash)) {
      setProcessedHashes(prev => new Set([...prev, hash]));
      
      // Duck notification
      const duckNotification = {
        id: Date.now() + Math.random(),
        type: 'duck',
        amount: mintedAmount,
        hash: hash
      };
      
      // Zapper notification (1 zapper per duck minted)
      const zapperNotification = {
        id: Date.now() + Math.random() + 1,
        type: 'zapper',
        amount: mintedAmount,
        hash: hash
      };
      
      // Add duck notification first
      setNotifications(prev => [...prev, duckNotification]);
      
      // Add zapper notification after a short delay
      setTimeout(() => {
        setNotifications(prev => [...prev, zapperNotification]);
      }, 300);
      
      setMintedAmount(null);
      
      // Remove notifications after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== duckNotification.id));
      }, 5000);
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== zapperNotification.id));
      }, 5300);
    }
  }, [isConfirmed, hash, mintedAmount, processedHashes]);

  // Reset button text after transaction confirms
  useEffect(() => {
    if (isConfirmed) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isConfirmed]);

  const closeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Update countdown timer using cached mint end timestamp with fallback
  useEffect(() => {
    // Use cached timestamp or fallback to 14 days from now
    const mintEndTimestamp = cachedGameData.ducksMintEndTimestamp || 
                            (Math.floor(Date.now() / 1000) + (14 * 24 * 60 * 60));

    const updateTimer = () => {
      const now = Date.now();
      const endTime = mintEndTimestamp * 1000; // Convert to milliseconds
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
  }, [cachedGameData.ducksMintEndTimestamp]); // Will work even if undefined

  const handleMint = async () => {
    console.log('Mint button clicked', { isConnected, amount, address });
    
    // Play duck sound when button is clicked
    if (window.playButtonSound) {
      window.playButtonSound('ducks');
    }
    
    if (!isConnected) {
      console.log('Wallet not connected');
      return;
    }
    
    if (!amount || amount <= 0) {
      console.log('Invalid amount:', amount);
      return;
    }
    
    console.log('Attempting to mint...', { amount: parseInt(amount), address });
    setMintedAmount(parseInt(amount));
    
    try {
      await mintDucks(parseInt(amount), address);
    } catch (err) {
      console.error('Minting failed:', err);
      setMintedAmount(null);
    }
  };

  const getButtonText = () => {
    if (isGameOver) return 'GAME OVER!';
    if (!isConnected) return 'CONNECT WALLET';
    if (timeLeft === 'HAPPY HUNTING!') return 'MINT CLOSED';
    if (isPending) return 'CONFIRM IN WALLET...';
    if (isConfirming) return 'MINTING...';
    if (showSuccess) return 'SUCCESS!';
    return `MINT ${amount} DUCKS!`;
  };

  // Helper functions for prize pool calculations using server data
  const calculateDuckPrizePool = () => {
    if (!cachedGameData.ducksMinted || !cachedGameData.duckPrice) return '0.000';
    const totalDuckRevenue = parseFloat(cachedGameData.duckPrice) * cachedGameData.ducksMinted;
    const prizePool = totalDuckRevenue * 0.5;
    return prizePool.toFixed(3);
  };

  // Calculate total price based on amount input (convert from Wei to ETH)
  const calculateTotalPrice = () => {
    if (!cachedGameData.duckPrice || !amount || parseInt(amount) <= 0) {
      return 'Loading price...';
    }
    // Convert from Wei (string) to ETH and multiply by quantity
    const priceInWei = cachedGameData.duckPrice;
    const priceInEth = parseFloat(priceInWei) / 1e18; // Convert Wei to ETH
    const totalPrice = priceInEth * parseInt(amount);
    
    // Format based on the size of the number
    if (totalPrice >= 0.001) {
      return `${totalPrice.toFixed(3)}E`;
    } else if (totalPrice >= 0.000001) {
      return `${(totalPrice * 1000).toFixed(3)}mE`; // Show in milliETH
    } else {
      return `${(totalPrice * 1000000).toFixed(3)}μE`; // Show in microETH
    }
  };

  const isButtonDisabled = () => {
    return isGameOver ||
           !isConnected || 
           timeLeft === 'HAPPY HUNTING!' ||
           isPending || 
           isConfirming || 
           !amount || 
           parseInt(amount) <= 0;
  };

  return (
    <>
      {/* Multiple Notifications */}
      <div className="fixed top-20 right-2 z-50 flex flex-col gap-2 max-w-[280px]">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`text-white p-3 min-w-[250px] shadow-lg animate-slide-down ${
              notification.type === 'duck' ? 'bg-blue-600' : 'bg-[#ff650b]'
            }`}
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both'
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="mb-2 font-bold text-sm">
                  {notification.type === 'duck' 
                    ? `You minted ${notification.amount} ducks!`
                    : `You received ${notification.amount} free zappers!`
                  }
                </div>
                <a 
                  href={`https://basescan.org/tx/${notification.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline text-xs"
                >
                  VIEW TX
                </a>
              </div>
              <button
                onClick={() => closeNotification(notification.id)}
                className="bg-transparent border-none text-white text-lg cursor-pointer p-0 leading-none"
              >
                ×
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
                  className="nes-input p-2 mb-2 sm:w-16 text-center"
                  style={{ fontSize: '16px' }}
                  id="inline_field"
                  disabled={isGameOver}
                />
                Ducks!
              </h1>
              
              <button 
                className="btn-nes bg-white text-black font-bold text-lg uppercase p-2 cursor-pointer touch-manipulation"
                onClick={handleMint}
                disabled={isButtonDisabled()}
              >
                {getButtonText()}
              </button>
              
              <div className="p-2 space-y-1">
                <p style={{ color: '#000', margin: 0 }} className="font-bold">
                  {calculateTotalPrice()}
                </p>
                {timeLeft && !isGameOver && (
                  <p className="mt-2 text-sm sm:text-base font-bold"
                     style={{ 
                       color: timeLeft === 'HAPPY HUNTING!' ? '#ff650b' : '#f42a2a'
                     }}>
                    {timeLeft === 'HAPPY HUNTING!' ? timeLeft : `Mint Ends in: ${timeLeft}`}
                  </p>
                )}
                {isGameOver && (
                  <p className="mt-2 text-sm sm:text-base font-bold" style={{ color: '#ff650b' }}>
                    GAME OVER!
                  </p>
                )}
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mt-2 text-xs">
                  Error: {error.shortMessage || error.message}
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
                  // Play FAQ sound when this link is clicked
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
        
        {/* Fence image in separate container */}
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
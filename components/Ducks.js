// components/Ducks.js
import { useAccount } from 'wagmi';
import { useState, useEffect, useCallback } from 'react';
import { useGameContract } from './hooks/useGameContract';
import { useCachedGameData } from './hooks/useCachedData';
import { 
  Transaction, 
  TransactionButton, 
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction 
} from '@coinbase/onchainkit/transaction';

const duck = '/img/duck_animation_002.gif';
const fence = '/img/fence_alt.png';

function Ducks() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('5');
  const [timeLeft, setTimeLeft] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [processedHashes, setProcessedHashes] = useState(new Set());
  
  // Use cached data and transaction calls
  const cachedGameData = useCachedGameData();
  const { createMintDucksCall } = useGameContract();

  // Handle transaction status from OnchainKit
  const handleOnStatus = useCallback((status) => {
    console.log('Duck mint status:', status.statusName, status.statusData);
    
    if (status.statusName === 'success' && status.statusData?.transactionReceipts?.[0]?.transactionHash) {
      const hash = status.statusData.transactionReceipts[0].transactionHash;
      
      // Prevent duplicate notifications
      if (processedHashes.has(hash)) return;
      setProcessedHashes(prev => new Set([...prev, hash]));
      
      console.log('Duck mint confirmed! Hash:', hash, 'Amount:', amount);
      
      const notification = {
        id: Date.now() + Math.random(),
        amount: parseInt(amount),
        hash: hash
      };
      
      setNotifications(prev => [...prev, notification]);
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
      
      // Refresh cached data after successful transaction
      setTimeout(() => {
        cachedGameData.refetch();
      }, 2000);
    }
  }, [amount, processedHashes, cachedGameData]);

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
  }, [cachedGameData.ducksMintEndTimestamp]);

  // Helper functions for prize pool calculations using server data
  const calculateDuckPrizePool = () => {
    if (!cachedGameData.ducksMinted || !cachedGameData.duckPrice) return '0.000';
    const totalDuckRevenue = parseFloat(cachedGameData.duckPrice) * cachedGameData.ducksMinted;
    const prizePool = totalDuckRevenue * 0.5;
    return prizePool.toFixed(3);
  };

  const canMint = () => {
    return isConnected && 
           timeLeft !== 'HAPPY HUNTING!' &&
           amount && 
           parseInt(amount) > 0;
  };

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    if (timeLeft === 'HAPPY HUNTING!') return 'Mint Closed';
    return `Mint ${amount} Ducks`;
  };

  return (
    <>
      {/* Multiple Notifications */}
      <div className="fixed top-20 right-2 z-50 flex flex-col gap-2 max-w-[280px]">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="bg-blue-600 text-white p-3 min-w-[250px] shadow-lg animate-slide-down"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both'
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="mb-2 font-bold text-sm">
                  You minted {notification.amount} ducks!
                </div>
                <a 
                  href={`https://basescan.org/tx/${notification.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline text-xs"
                >
                  View TX
                </a>
              </div>
              <button
                onClick={() => closeNotification(notification.id)}
                className="bg-transparent border-none text-white text-lg cursor-pointer p-0 leading-none ml-2"
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
                  className="nes-input p-2 mb-2 sm:w-16 text-center"
                  style={{ fontSize: '16px' }}
                  id="inline_field"
                />
                Ducks!
              </h1>
              
              {/* OnchainKit Transaction Component */}
              <Transaction
                calls={canMint() ? [createMintDucksCall(parseInt(amount), address)] : []}
                onStatus={handleOnStatus}
                disabled={!canMint()}
              >
                <TransactionButton 
                  className="btn-nes bg-white text-black font-bold text-lg uppercase p-2 cursor-pointer touch-manipulation"
                  disabled={!canMint()}
                  onClick={() => {
                    if (window.playButtonSound) {
                      window.playButtonSound('ducks');
                    }
                  }}
                  style={{
                    opacity: !canMint() ? 0.6 : 1
                  }}
                >
                  {getButtonText()}
                </TransactionButton>
                <TransactionStatus>
                  <TransactionStatusLabel />
                  <TransactionStatusAction />
                </TransactionStatus>
              </Transaction>
              
              <div className="p-2 space-y-1">
                <p style={{ color: '#000', margin: 0 }} className="font-bold">
                  {cachedGameData.duckPrice ? `${cachedGameData.duckPrice}Ξ` : 'Loading price...'}
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

              <h2 className="pb-2 text-black text-base sm:text-lg font-bold">
                {cachedGameData.ducksMinted ?? '…'} Minted!
              </h2>
              
              <p className="text-black m-n4">Duck Prize Pool: <span className="text-[#1a1a89] text-sm sm:text-base">{calculateDuckPrizePool()}Ξ</span></p>

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
                  color: '#1a1a89'
                }}
                className="block mt-2 mb-6"
              >
                <h3 style={{ color: '#1a1a89' }} className="text-sm sm:text-base font-bold">
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
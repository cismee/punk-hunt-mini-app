// components/Ducks.js - Bulletproof simple version
import { useAccount } from 'wagmi';
import { useState, useEffect, useRef } from 'react';
import { useGameContract } from './hooks/useGameContract';
import { useCachedGameData } from './hooks/useCachedData';

const duck = '/img/duck_animation_002.gif';
const fence = '/img/fence_alt.png';

function Ducks() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('5');
  const [notifications, setNotifications] = useState([]);
  const notificationId = useRef(0);
  
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

  // Simple notification system that listens for the custom event
  useEffect(() => {
    const handleTransactionConfirmed = (event) => {
      const { hash: confirmedHash } = event.detail;
      
      if (confirmedHash && amount) {
        console.log('Duck mint confirmed via custom event:', confirmedHash);
        
        const notification = {
          id: `duck-${++notificationId.current}`,
          amount: parseInt(amount),
          hash: confirmedHash,
          timestamp: Date.now()
        };
        
        setNotifications(prev => [...prev, notification]);
        
        // Remove after 6 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 6000);
      }
    };

    window.addEventListener('transactionConfirmed', handleTransactionConfirmed);
    return () => window.removeEventListener('transactionConfirmed', handleTransactionConfirmed);
  }, [amount]);

  // Backup notification system - if wagmi state changes work
  useEffect(() => {
    if (isConfirmed && hash && amount) {
      console.log('Duck mint confirmed via wagmi state:', hash);
      
      // Small delay to avoid duplicate with custom event
      setTimeout(() => {
        // Check if we already have a notification for this hash
        const hasNotification = notifications.some(n => n.hash === hash);
        
        if (!hasNotification) {
          const notification = {
            id: `duck-backup-${++notificationId.current}`,
            amount: parseInt(amount),
            hash: hash,
            timestamp: Date.now()
          };
          
          setNotifications(prev => [...prev, notification]);
          
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
          }, 6000);
        }
      }, 100);
    }
  }, [isConfirmed, hash, amount, notifications]);

  const closeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleMint = async () => {
    console.log('Duck mint button clicked:', { isConnected, amount, address, isPending, isConfirming });
    
    if (window.playButtonSound) {
      window.playButtonSound('ducks');
    }
    
    // Check if we can mint
    if (!isConnected) {
      console.log('Wallet not connected');
      return;
    }
    
    if (!amount || amount <= 0) {
      console.log('Invalid amount');
      return;
    }

    // Prevent double-clicks during transaction
    if (isPending || isConfirming) {
      console.log('Transaction already in progress');
      return;
    }
    
    try {
      await mintDucks(parseInt(amount));
      console.log('Duck mint function called successfully');
    } catch (err) {
      console.error('Duck minting error:', err);
    }
  };

  // Simple button text logic
  const getButtonText = () => {
    if (!isConnected) return 'CONNECT WALLET';
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
           isPending || 
           isConfirming || 
           !amount || 
           parseInt(amount) <= 0;
  };

  return (
    <>
      {/* Simple Notifications */}
      <div className="fixed top-20 right-2 z-50 flex flex-col gap-2 max-w-[320px]">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="bg-blue-600 text-white p-3 rounded-lg shadow-lg"
            style={{
              animation: `slideDown 0.3s ease-out ${index * 0.1}s both`
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
                  className="text-blue-200 underline text-xs hover:text-white"
                >
                  VIEW TRANSACTION
                </a>
              </div>
              <button
                onClick={() => closeNotification(notification.id)}
                className="bg-transparent border-none text-white text-xl cursor-pointer p-0 hover:opacity-70"
                title="Close"
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
                  disabled={isPending || isConfirming}
                />
                Ducks!
              </h1>
              
              <button 
                className="btn-nes bg-white text-black font-bold text-lg uppercase p-2 cursor-pointer"
                onClick={handleMint}
                disabled={isButtonDisabled()}
                style={{
                  opacity: isButtonDisabled() ? 0.6 : 1,
                  cursor: isButtonDisabled() ? 'not-allowed' : 'pointer',
                  minHeight: '44px'
                }}
              >
                {getButtonText()}
              </button>
              
              <div className="p-2 space-y-1">
                <p style={{ color: '#000', margin: 0 }} className="font-bold">
                  {cachedGameData.duckPrice ? `${cachedGameData.duckPrice}E each` : 'Loading...'}
                </p>
              </div>

              {/* Simple Error Display */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mt-2 text-xs">
                  <div className="font-bold">Error:</div>
                  <div>{error.shortMessage || error.message}</div>
                  <button 
                    onClick={resetTransactionState}
                    className="mt-1 text-red-600 underline"
                  >
                    Try Again
                  </button>
                </div>
              )}

              <h2 className="pb-2 text-black text-base sm:text-lg font-bold">
                {cachedGameData.ducksMinted || 0} Minted!
              </h2>
              
              <p className="text-black">Prize Pool: <span className="text-white">{calculateDuckPrizePool()}E</span></p>

              <h3 className="mx-4 text-black text-sm sm:text-base">
                Mint a Duck, Get a Free Zapper.
              </h3>
            </div>
          </div>
        </div>
        
        <div className="w-full">
          <img src={fence} className="w-full h-auto block" alt="Fence decoration" />
        </div>
      </section>

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

export default Ducks;
// components/Zapp.js - Enhanced with better state management
import { useAccount } from 'wagmi';
import { useState, useEffect, useRef } from 'react';
import { useGameContract } from './hooks/useGameContract';
import { useCachedGameData } from './hooks/useCachedData';

const zapp = '/img/zapp_animation.gif';

export default function Zapp() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('5');
  const [notifications, setNotifications] = useState([]);
  const [processedHashes, setProcessedHashes] = useState(new Set());
  const lastNotificationRef = useRef(null);
  
  const cachedGameData = useCachedGameData();
  
  const {
    mintZappers,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    transactionStage,
    isTransacting,
    resetTransactionState
  } = useGameContract();

  // Enhanced notification handling with better duplicate prevention
  useEffect(() => {
    if (isConfirmed && hash && amount && !processedHashes.has(hash)) {
      console.log('Processing confirmed zapper transaction:', { hash, amount });
      
      setProcessedHashes(prev => new Set([...prev, hash]));
      
      const notification = {
        id: `zapper-${hash}-${Date.now()}`, // More unique ID
        amount: parseInt(amount),
        hash: hash,
        timestamp: Date.now()
      };
      
      // Prevent duplicate notifications by checking recent notifications
      setNotifications(prev => {
        const isDuplicateRecent = prev.some(existing => 
          existing.hash === hash || 
          (Date.now() - existing.timestamp < 5000 && existing.amount === notification.amount)
        );
        
        if (isDuplicateRecent) {
          console.log('Preventing duplicate zapper notification for hash:', hash);
          return prev;
        }
        
        return [...prev, notification];
      });
      
      // Auto-remove notification after 6 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 6000);
      
      lastNotificationRef.current = notification;
    }
  }, [isConfirmed, hash, amount, processedHashes]);

  // Reset transaction state when amount changes (new transaction)
  useEffect(() => {
    if (transactionStage === 'idle' && amount !== lastNotificationRef.current?.amount) {
      lastNotificationRef.current = null;
    }
  }, [amount, transactionStage]);

  const closeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleMint = async () => {
    console.log('Mint zappers button clicked', { isConnected, amount, address, transactionStage });
    
    if (window.playButtonSound) {
      window.playButtonSound('zappmint');
    }
    
    if (!isConnected) {
      console.log('Wallet not connected');
      return;
    }
    
    if (!amount || amount <= 0) {
      console.log('Invalid amount:', amount);
      return;
    }

    // Prevent multiple transactions
    if (isTransacting) {
      console.log('Zapper transaction already in progress');
      return;
    }
    
    try {
      console.log('Attempting to mint zappers...', { 
        amount: parseInt(amount), 
        address,
        stage: transactionStage 
      });
      
      await mintZappers(parseInt(amount));
    } catch (err) {
      console.error('Zapper minting failed:', err);
      // Error is handled by the hook
    }
  };

  const getButtonText = () => {
    if (!isConnected) return 'CONNECT WALLET';
    
    // Use enhanced transaction state
    switch (transactionStage) {
      case 'preparing':
        return 'PREPARING...';
      case 'pending':
        return 'CONFIRM IN WALLET...';
      case 'confirming':
        return 'MINTING...';
      case 'confirmed':
        return 'SUCCESS!';
      case 'error':
        return 'TRY AGAIN';
      default:
        return `MINT ${amount} ZAPPERS`;
    }
  };

  const calculateZapperPrizePool = () => {
    if (!cachedGameData.zappersMinted || !cachedGameData.zapperPrice || !cachedGameData.ducksMinted) return '0.000';
    // Subtract free zappers (1 per duck minted) to get paid zapper mints
    const paidZapperMints = Math.max(0, cachedGameData.zappersMinted - cachedGameData.ducksMinted);
    const totalZapperRevenue = parseFloat(cachedGameData.zapperPrice) * paidZapperMints;
    const prizePool = totalZapperRevenue * 0.5;
    return prizePool.toFixed(3);
  };

  const isButtonDisabled = () => {
    return !isConnected || 
           isTransacting || 
           !amount || 
           parseInt(amount) <= 0;
  };

  const getButtonClass = () => {
    let baseClass = "btn-nes is-success p-2 min-h-[44px] touch-manipulation";
    
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

  return (
    <>
      {/* Enhanced Notifications */}
      <div className="fixed top-20 right-2 z-50 flex flex-col gap-2 max-w-[320px]">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="bg-[#ff650b] text-white p-3 rounded-lg shadow-lg animate-slide-down border-l-4 border-orange-400"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both'
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="mb-2 font-bold text-sm">
                  ⚡ You minted {notification.amount} zappers!
                </div>
                <a 
                  href={`https://basescan.org/tx/${notification.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-200 underline text-xs hover:text-white transition-colors"
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
        id="zappmint"
        className="relative overflow-hidden bg-[#a7df10]"
      >
        <div className="py-4"></div>
        
        <div className="w-full px-2 sm:px-4 pb-4">
          <div className="flex flex-wrap">
            <div className="w-full text-center">
              <h1 className="p-2 text-black text-lg sm:text-xl lg:text-2xl font-bold">
                Mint{' '}
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  className="nes-input p-2 mx-2 mb-2 w-12 sm:w-16 text-center"
                  style={{ fontSize: '16px' }}
                  id="inline_field"
                  disabled={isTransacting}
                />{' '}
                Zappers!
              </h1>

              <button 
                className={getButtonClass()}
                onClick={handleMint}
                disabled={isButtonDisabled()}
                title={isButtonDisabled() ? 'Cannot mint right now' : 'Mint zappers'}
              >
                {getButtonText()}
              </button>
              
              <div className="p-2 space-y-1">
                <p className="text-black text-base font-bold m-0">
                  {cachedGameData.zapperPrice ? `${cachedGameData.zapperPrice}E each` : 'Loading price...'}
                </p>
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

              <h2 className="pb-2 text-black text-base sm:text-lg font-bold">
                {cachedGameData.zappersMinted ?? '…'} Minted!
              </h2>

              <p className="text-white m-n4">Hunter Prize Pool: <span className="text-black text-sm sm:text-base">{calculateZapperPrizePool()}E</span></p>

              <h3 className="mx-2 text-white text-sm sm:text-base">
                Burn Zappers below to shoot ducks!
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
                className="underline text-[#aa32d2] block mt-2  hover:text-[#97E500]"
              >
                <h3 className="mx-2 text-[#aa32d2] hover:text-[#aa32d2] underline text-sm sm:text-base font-bold">
                  Aim carefully, you might miss!
                </h3>
              </a>
            </div>
          </div>
        </div>

        {/* Hero art stays inside same green section */}
        <div className="flex justify-center items-center">
          <img src={zapp} alt="NES Zapper" className="w-full px-4 h-auto max-w-md" />
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
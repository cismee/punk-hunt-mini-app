// components/Zapp.js
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import { useGameContract } from './hooks/useGameContract';
import { useCachedGameData } from './hooks/useCachedData';

const zapp = '/img/zapp_animation.gif';

export default function Zapp() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('5');
  const [notifications, setNotifications] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mintedAmount, setMintedAmount] = useState(null);
  const [processedHashes, setProcessedHashes] = useState(new Set());
  
  const cachedGameData = useCachedGameData();
  
  const {
    mintZappers,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash
  } = useGameContract();

  // Show notification when mint is confirmed and hash is available
  useEffect(() => {
    if (isConfirmed && hash && mintedAmount && !processedHashes.has(hash)) {
      setProcessedHashes(prev => new Set([...prev, hash]));
      
      const notification = {
        id: Date.now() + Math.random(),
        amount: mintedAmount,
        hash: hash
      };
      
      setNotifications(prev => [...prev, notification]);
      setMintedAmount(null);
      
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
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

  const handleMint = async () => {
    console.log('Mint zappers button clicked', { isConnected, amount, address });
    
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
    
    console.log('Attempting to mint zappers...', { amount: parseInt(amount), address });
    setMintedAmount(parseInt(amount));
    
    try {
      await mintZappers(parseInt(amount));
    } catch (err) {
      console.error('Zapper minting failed:', err);
      setMintedAmount(null);
    }
  };

  const getButtonText = () => {
    if (!isConnected) return 'CONNECT WALLET';
    if (isPending) return 'CONFIRM IN WALLET...';
    if (isConfirming) return 'MINTING...';
    if (showSuccess) return 'SUCCESS!';
    return `MINT ${amount} ZAPPERS`;
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
    return !isConnected || isPending || isConfirming || !amount || parseInt(amount) <= 0;
  };

  return (
    <>
      {/* Multiple Notifications */}
      <div className="fixed top-20 right-2 z-50 flex flex-col gap-2 max-w-[280px]">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="bg-[#ff650b] text-white p-3 min-w-[250px] shadow-lg animate-slide-down"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both'
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="mb-2 font-bold text-sm">
                  You minted {notification.amount} zappers!
                </div>
                <a 
                  href={`https://basescan.org/tx/${notification.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline text-xs"
                >
                  TX
                </a>
              </div>
              <button
                onClick={() => closeNotification(notification.id)}
                className="bg-transparent border-none text-white text-lg cursor-pointer p-0 leading-none"
              >
                âœ•
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
                />{' '}
                Zappers!
              </h1>

              <button 
                className="btn-nes is-success p-2 min-h-[44px] touch-manipulation"
                onClick={handleMint}
                disabled={isButtonDisabled()}
              >
                {getButtonText()}
              </button>
              
              <div className="p-2 space-y-1">
                <p className="text-black text-base font-bold m-0">
                  {cachedGameData.zapperPrice ? `${cachedGameData.zapperPrice}Îž` : 'Loading price...'}
                </p>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mt-2 text-xs">
                  Error: {error.shortMessage || error.message}
                </div>
              )}

              <h2 className="pb-2 text-black text-base sm:text-lg font-bold">
                {cachedGameData.zappersMinted ?? 'â€¦'} Minted!
              </h2>

              <p className="text-black m-n4">Hunter Prize Pool: <span className="text-[#aa32d2] text-sm sm:text-base">{calculateZapperPrizePool()}Îž</span></p>

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
                  Aim carefully, you might missâ€¦
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
      `}</style>
    </>
  );
}
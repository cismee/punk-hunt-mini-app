// components/Ded.js - Using OnchainKit Transaction components
import { useAccount } from 'wagmi';
import { useState, useEffect, useCallback } from 'react';
import { useGameContract } from './hooks/useGameContract';
import { useCachedGameData, useCachedUserData } from './hooks/useCachedData';
import { usePublicClient } from 'wagmi';
import { CONTRACTS } from './contracts';
import { decodeEventLog } from 'viem';
import { 
  Transaction, 
  TransactionButton, 
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction 
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';

const pepe = '/img/rekt_animation_002.gif';

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
  const [notifications, setNotifications] = useState([]);
  const [processedHashes, setProcessedHashes] = useState(new Set());
  const publicClient = usePublicClient();
  
  const cachedGameData = useCachedGameData();
  const cachedUserData = useCachedUserData(address);
  const { createSendZappersCall } = useGameContract();

  // Handle transaction status changes from OnchainKit
  const handleOnStatus = useCallback(async (status: LifecycleStatus) => {
    console.log('Transaction status:', status.statusName, status.statusData);
    
    if (status.statusName === 'success' && status.statusData?.transactionReceipts?.[0]?.transactionHash) {
      const hash = status.statusData.transactionReceipts[0].transactionHash;
      
      // Prevent duplicate processing
      if (processedHashes.has(hash)) return;
      setProcessedHashes(prev => new Set([...prev, hash]));
      
      console.log('Transaction confirmed, parsing events for hash:', hash);
      
      try {
        const receipt = await publicClient.getTransactionReceipt({ hash });
        console.log('Transaction receipt:', receipt);
        
        const mainContractLogs = receipt.logs.filter(log => 
          log.address.toLowerCase() === CONTRACTS.MAIN.toLowerCase()
        );
        
        console.log('Main contract logs:', mainContractLogs);
        
        if (mainContractLogs.length === 0) {
          // No events found, create generic notification
          const notification = {
            id: Date.now() + Math.random(),
            message: `${amount} shots fired!`,
            txHash: hash,
            backgroundColor: '#97E500'
          };
          
          setNotifications(prev => [...prev, notification]);
          setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
          }, 5000);
        } else {
          // Process each event
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
                  id: Date.now() + Math.random() + index,
                  message: "You Missed!",
                  txHash: hash,
                  backgroundColor: '#fbb304'
                };
              } else if (owned) {
                notification = {
                  id: Date.now() + Math.random() + index,
                  message: `You Shot your Own Duck #${tokenId}!`,
                  txHash: hash,
                  backgroundColor: '#f42a2a'
                };
              } else {
                notification = {
                  id: Date.now() + Math.random() + index,
                  message: `You hit Duck #${tokenId}!`,
                  txHash: hash,
                  backgroundColor: '#339c1d'
                };
              }
              
            } catch (decodeError) {
              console.error('Failed to decode log:', decodeError);
              notification = {
                id: Date.now() + Math.random() + index,
                message: `Shot fired!`,
                txHash: hash,
                backgroundColor: '#97E500'
              };
            }
            
            setTimeout(() => {
              setNotifications(prev => [...prev, notification]);
              
              setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== notification.id));
              }, 5000);
            }, index * 200);
          });
        }
        
        // Refresh user data after transaction
        setTimeout(() => {
          cachedUserData.refetch();
        }, 2000);
        
      } catch (error) {
        console.error('Error fetching transaction events:', error);
        
        // Show generic notification on error
        const notification = {
          id: Date.now() + Math.random(),
          message: `Transaction completed`,
          txHash: hash,
          backgroundColor: '#97E500'
        };
        
        setNotifications(prev => [...prev, notification]);
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
      }
    }
  }, [amount, processedHashes, publicClient, cachedUserData]);

  const closeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const canShoot = () => {
    const liveDucks = cachedGameData.ducksMinted - cachedGameData.ducksRekt;
    return isConnected && 
           liveDucks > 1 &&
           cachedGameData.huntingSeason && 
           amount && 
           parseInt(amount) > 0 &&
           parseInt(amount) <= cachedUserData.zapperBalance;
  };

  const getButtonText = () => {
    if (!isConnected) return 'Connect Wallet';
    
    const liveDucks = cachedGameData.ducksMinted - cachedGameData.ducksRekt;
    if (liveDucks <= 1) return 'Hunting Season Closed';
    
    if (!cachedGameData.huntingSeason) return 'Hunting Season Soon';
    if (parseInt(amount) > cachedUserData.zapperBalance) {
      return `Need ${amount - cachedUserData.zapperBalance} More Zappers`;
    }
    return `Shoot ${amount} Ducks!`;
  };

  return (
    <>
      {/* Notifications */}
      <div className="fixed top-20 right-2 z-50 flex flex-col gap-2 max-w-[280px]">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className="text-white p-3 min-w-[250px] shadow-lg animate-slide-down"
            style={{
              backgroundColor: notification.backgroundColor,
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both'
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="mb-2 font-bold text-sm">
                  {notification.message}
                </div>
                <a 
                  href={`https://basescan.org/tx/${notification.txHash}`}
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

      <section id="burn" className="relative overflow-hidden bg-[#ba92bb]">
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
                />
                Ducks!
              </h1>

              {/* OnchainKit Transaction Component */}
              <Transaction
                calls={[createSendZappersCall(parseInt(amount), address)]}
                onStatus={handleOnStatus}
                disabled={!canShoot()}
              >
                <TransactionButton 
                  className="btn-nes is-warning p-2 min-h-[44px] touch-manipulation"
                  disabled={!canShoot()}
                  onClick={() => {
                    if (window.playButtonSound) {
                      window.playButtonSound('burn');
                    }
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
                <div className="text-sm text-white">
                  <span className="text-black font-bold">TX FEE</span><br />
                  Zappers: {cachedUserData.zapperBalance}
                </div>
                <h2 className="mt-2 text-base sm:text-lg font-bold"
                    style={{ 
                      color: cachedGameData.huntingSeason ? '#125000' : '#f42a2a'
                    }}>
                  {cachedGameData.huntingSeason ? "IT'S HUNTING SZN!" : "Hunting SZN Coming Soon"}
                </h2>
              </div>

              <h2 className="mt-2 text-black text-base sm:text-lg font-bold">
                {cachedGameData.ducksRekt}/{cachedGameData.ducksMinted} Ded Ducks!
              </h2>
            </div>
          </div>
        </div>
        
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
      `}</style>
    </>
  );
}
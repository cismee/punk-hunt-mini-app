/* global BigInt */
// src/hooks/useGameContract.js - Enhanced with better state management
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { useEffect, useState, useCallback } from 'react';
import { CONTRACTS, MAIN_ABI } from '../contracts';
import { useCachedGameData, useCachedUserData } from './useCachedData';

export function useGameContract() {
  const { writeContract, data: hash, error, isPending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ 
    hash,
    confirmations: 1, // Wait for 1 confirmation
  });
  const { address } = useAccount();

  // Local state to track transaction lifecycle
  const [transactionState, setTransactionState] = useState({
    stage: 'idle', // 'idle' | 'preparing' | 'pending' | 'confirming' | 'confirmed' | 'error'
    lastHash: null,
    error: null,
  });

  // Replace all useReadContract calls with cached data
  const cachedGameData = useCachedGameData();
  const cachedUserData = useCachedUserData(address);

  // Enhanced state management
  useEffect(() => {
    if (isPending) {
      setTransactionState(prev => ({ ...prev, stage: 'pending', error: null }));
    } else if (isConfirming) {
      setTransactionState(prev => ({ ...prev, stage: 'confirming', lastHash: hash }));
    } else if (isConfirmed && hash) {
      setTransactionState(prev => ({ ...prev, stage: 'confirmed', lastHash: hash }));
      
      // Auto-reset after successful transaction
      setTimeout(() => {
        setTransactionState(prev => ({ ...prev, stage: 'idle', lastHash: null }));
        reset(); // Reset wagmi state
      }, 2000);
      
    } else if (error) {
      setTransactionState(prev => ({ 
        ...prev, 
        stage: 'error', 
        error: error.message || 'Transaction failed'
      }));
      
      // Auto-reset after error
      setTimeout(() => {
        setTransactionState(prev => ({ ...prev, stage: 'idle', error: null }));
        reset();
      }, 5000);
    }
  }, [isPending, isConfirming, isConfirmed, hash, error, reset]);

  // Invalidate user cache after successful transactions with retries
  useEffect(() => {
    if (isConfirmed && address && hash !== transactionState.lastProcessedHash) {
      console.log('Transaction confirmed, invalidating cache for:', address);
      
      // Mark this hash as processed
      setTransactionState(prev => ({ ...prev, lastProcessedHash: hash }));
      
      // Invalidate cache with retries
      const invalidateWithRetry = async (attempts = 3) => {
        for (let i = 0; i < attempts; i++) {
          try {
            await cachedUserData.invalidateCache();
            console.log(`Cache invalidation successful on attempt ${i + 1}`);
            break;
          } catch (error) {
            console.warn(`Cache invalidation attempt ${i + 1} failed:`, error);
            if (i === attempts - 1) {
              // Final attempt failed, just refetch
              setTimeout(() => cachedUserData.refetch(), 3000);
            } else {
              // Wait before retry
              await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
          }
        }
      };

      // Start invalidation after a delay to allow blockchain to update
      setTimeout(invalidateWithRetry, 2000);
    }
  }, [isConfirmed, address, hash, cachedUserData, transactionState.lastProcessedHash]);

  // Enhanced transaction functions with better error handling
  const mintDucks = useCallback(async (amount) => {
    try {
      setTransactionState(prev => ({ ...prev, stage: 'preparing', error: null }));

      if (!cachedGameData.duckPrice || !amount) {
        throw new Error('Duck price not loaded or invalid amount');
      }

      if (!address) {
        throw new Error('Wallet not connected');
      }

      const totalCost = parseEther(cachedGameData.duckPrice) * BigInt(amount);
      console.log('Minting ducks:', { 
        amount, 
        price: cachedGameData.duckPrice, 
        totalCost: totalCost.toString(),
        address 
      });
      
      await writeContract({
        address: CONTRACTS.MAIN,
        abi: MAIN_ABI,
        functionName: 'mintDucks',
        args: [amount],
        value: totalCost,
      });

    } catch (err) {
      console.error('Mint ducks failed:', err);
      setTransactionState(prev => ({ 
        ...prev, 
        stage: 'error', 
        error: err.message || 'Failed to mint ducks'
      }));
      throw err;
    }
  }, [cachedGameData.duckPrice, address, writeContract]);

  const mintZappers = useCallback(async (amount) => {
    try {
      setTransactionState(prev => ({ ...prev, stage: 'preparing', error: null }));

      if (!cachedGameData.zapperPrice || !amount) {
        throw new Error('Zapper price not loaded or invalid amount');
      }

      if (!address) {
        throw new Error('Wallet not connected');
      }

      const totalCost = parseEther(cachedGameData.zapperPrice) * BigInt(amount);
      console.log('Minting zappers:', { 
        amount, 
        price: cachedGameData.zapperPrice, 
        totalCost: totalCost.toString(),
        address 
      });
      
      await writeContract({
        address: CONTRACTS.MAIN,
        abi: MAIN_ABI,
        functionName: 'mintZappers',
        args: [amount],
        value: totalCost,
      });

    } catch (err) {
      console.error('Mint zappers failed:', err);
      setTransactionState(prev => ({ 
        ...prev, 
        stage: 'error', 
        error: err.message || 'Failed to mint zappers'
      }));
      throw err;
    }
  }, [cachedGameData.zapperPrice, address, writeContract]);

  const sendZappers = useCallback(async (amount) => {
    try {
      setTransactionState(prev => ({ ...prev, stage: 'preparing', error: null }));

      if (!amount) {
        throw new Error('Invalid amount');
      }

      if (!address) {
        throw new Error('Wallet not connected');
      }

      if (amount > cachedUserData.zapperBalance) {
        throw new Error(`Insufficient zappers. You have ${cachedUserData.zapperBalance}, need ${amount}`);
      }

      console.log('Sending zappers:', { amount, address, balance: cachedUserData.zapperBalance });
      
      await writeContract({
        address: CONTRACTS.MAIN,
        abi: MAIN_ABI,
        functionName: 'sendZappers',
        args: [amount],
      });

    } catch (err) {
      console.error('Send zappers failed:', err);
      setTransactionState(prev => ({ 
        ...prev, 
        stage: 'error', 
        error: err.message || 'Failed to send zappers'
      }));
      throw err;
    }
  }, [address, cachedUserData.zapperBalance, writeContract]);

  // Manual reset function for components
  const resetTransactionState = useCallback(() => {
    setTransactionState({ stage: 'idle', lastHash: null, error: null });
    reset();
  }, [reset]);

  return {
    // Cached data instead of contract reads
    duckPrice: cachedGameData.duckPrice,
    zapperPrice: cachedGameData.zapperPrice,
    huntingSeason: cachedGameData.huntingSeason,
    ducksMinted: cachedGameData.ducksMinted,
    ducksRekt: cachedGameData.ducksRekt,
    zappersMinted: cachedGameData.zappersMinted,
    userDuckBalance: cachedUserData.duckBalance,
    userZapperBalance: cachedUserData.zapperBalance,
    
    // Enhanced transaction functions
    mintDucks,
    mintZappers,
    sendZappers,
    
    // Enhanced transaction state
    isPending,
    isConfirming,
    isConfirmed,
    error: transactionState.error || error,
    hash,
    
    // Enhanced state information
    transactionStage: transactionState.stage,
    isTransacting: ['preparing', 'pending', 'confirming'].includes(transactionState.stage),
    
    // Utility functions
    resetTransactionState,
    refetchZapperBalance: cachedUserData.refetch,
    refetchDuckBalance: cachedUserData.refetch,
    
    // Expose cache loading/error states
    cacheLoading: cachedGameData.loading || cachedUserData.loading,
    cacheError: cachedGameData.error || cachedUserData.error,
  };
}
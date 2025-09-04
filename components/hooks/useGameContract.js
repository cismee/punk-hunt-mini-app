/* global BigInt */
// src/hooks/useGameContract.js - Fixed to prevent button freezing
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { useEffect, useState, useCallback } from 'react';
import { CONTRACTS, MAIN_ABI } from '../contracts';
import { useCachedGameData, useCachedUserData } from './useCachedData';

export function useGameContract() {
  const { writeContract, data: hash, error, isPending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } = useWaitForTransactionReceipt({ 
    hash,
    confirmations: 1,
  });
  const { address } = useAccount();

  // Simple local state for UI feedback only
  const [showSuccess, setShowSuccess] = useState(false);
  const [processedHashes, setProcessedHashes] = useState(new Set());

  // Replace all useReadContract calls with cached data
  const cachedGameData = useCachedGameData();
  const cachedUserData = useCachedUserData(address);

  // Handle successful transactions - show success briefly then reset
  useEffect(() => {
    if (isConfirmed && hash && !processedHashes.has(hash)) {
      console.log('Transaction confirmed, showing success state:', hash);
      setProcessedHashes(prev => new Set([...prev, hash]));
      
      setShowSuccess(true);
      
      // Emit custom event for notifications
      window.dispatchEvent(new CustomEvent('transactionConfirmed', { 
        detail: { hash, address, timestamp: Date.now() } 
      }));
      
      // Reset everything after showing success
      const resetTimer = setTimeout(() => {
        setShowSuccess(false);
        reset(); // Reset wagmi state
        
        // Invalidate cache after a delay to allow blockchain to update
        setTimeout(() => {
          if (address) {
            console.log('Invalidating cache for:', address);
            cachedUserData.invalidateCache();
          }
        }, 2000);
      }, 2000); // Show success for 2 seconds
      
      return () => clearTimeout(resetTimer);
    }
  }, [isConfirmed, hash, processedHashes, reset, address, cachedUserData]);

  // Reset on error after a delay
  useEffect(() => {
    if (error || receiptError) {
      const errorTimer = setTimeout(() => {
        reset();
      }, 3000); // Show error for 3 seconds then reset
      
      return () => clearTimeout(errorTimer);
    }
  }, [error, receiptError, reset]);

  // Clean up processed hashes periodically to prevent memory issues
  useEffect(() => {
    const cleanup = setInterval(() => {
      setProcessedHashes(prev => {
        if (prev.size > 50) { // Keep only last 50 hashes
          const array = Array.from(prev);
          return new Set(array.slice(-25)); // Keep last 25
        }
        return prev;
      });
    }, 300000); // Clean up every 5 minutes

    return () => clearInterval(cleanup);
  }, []);

  // Transaction functions with minimal state management
  const mintDucks = useCallback(async (amount) => {
    if (!cachedGameData.duckPrice || !amount || !address) {
      throw new Error('Invalid parameters for minting ducks');
    }

    const totalCost = parseEther(cachedGameData.duckPrice) * BigInt(amount);
    console.log('Minting ducks:', { amount, price: cachedGameData.duckPrice, totalCost: totalCost.toString() });
    
    await writeContract({
      address: CONTRACTS.MAIN,
      abi: MAIN_ABI,
      functionName: 'mintDucks',
      args: [amount],
      value: totalCost,
    });
  }, [cachedGameData.duckPrice, address, writeContract]);

  const mintZappers = useCallback(async (amount) => {
    if (!cachedGameData.zapperPrice || !amount || !address) {
      throw new Error('Invalid parameters for minting zappers');
    }

    const totalCost = parseEther(cachedGameData.zapperPrice) * BigInt(amount);
    console.log('Minting zappers:', { amount, price: cachedGameData.zapperPrice, totalCost: totalCost.toString() });
    
    await writeContract({
      address: CONTRACTS.MAIN,
      abi: MAIN_ABI,
      functionName: 'mintZappers',
      args: [amount],
      value: totalCost,
    });
  }, [cachedGameData.zapperPrice, address, writeContract]);

  const sendZappers = useCallback(async (amount) => {
    if (!amount || !address) {
      throw new Error('Invalid parameters for sending zappers');
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
  }, [address, cachedUserData.zapperBalance, writeContract]);

  // Manual reset function
  const resetTransactionState = useCallback(() => {
    setShowSuccess(false);
    reset();
  }, [reset]);

  return {
    // Cached data
    duckPrice: cachedGameData.duckPrice,
    zapperPrice: cachedGameData.zapperPrice,
    huntingSeason: cachedGameData.huntingSeason,
    ducksMinted: cachedGameData.ducksMinted,
    ducksRekt: cachedGameData.ducksRekt,
    zappersMinted: cachedGameData.zappersMinted,
    userDuckBalance: cachedUserData.duckBalance,
    userZapperBalance: cachedUserData.zapperBalance,
    
    // Transaction functions
    mintDucks,
    mintZappers,
    sendZappers,
    
    // Basic transaction state (directly from wagmi)
    isPending,
    isConfirming,
    isConfirmed: showSuccess, // Use local success state for UI
    error: error || receiptError,
    hash,
    
    // Utility functions
    resetTransactionState,
    refetchZapperBalance: cachedUserData.refetch,
    refetchDuckBalance: cachedUserData.refetch,
    
    // Cache state
    cacheLoading: cachedGameData.loading || cachedUserData.loading,
    cacheError: cachedGameData.error || cachedUserData.error,
  };
}
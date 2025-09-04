/* global BigInt */
// src/hooks/useGameContract.js - Bulletproof approach with forced resets
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { useEffect, useState, useCallback, useRef } from 'react';
import { CONTRACTS, MAIN_ABI } from '../contracts';
import { useCachedGameData, useCachedUserData } from './useCachedData';

export function useGameContract() {
  const { writeContract, data: hash, error, isPending, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ 
    hash,
    confirmations: 1,
  });
  const { address } = useAccount();

  // Local state to override wagmi when needed
  const [localState, setLocalState] = useState('idle'); // 'idle', 'pending', 'confirming', 'success', 'error'
  const [forceReset, setForceReset] = useState(false);
  const resetTimeoutRef = useRef(null);
  const processedHashes = useRef(new Set());

  const cachedGameData = useCachedGameData();
  const cachedUserData = useCachedUserData(address);

  // Force reset function that clears everything
  const forceCompleteReset = useCallback(() => {
    console.log('🔄 FORCING COMPLETE RESET');
    
    // Clear all timeouts
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    
    // Reset all states
    setLocalState('idle');
    setForceReset(true);
    
    // Reset wagmi
    reset();
    
    // Clear force reset after a tick
    setTimeout(() => setForceReset(false), 10);
    
    console.log('✅ Complete reset finished');
  }, [reset]);

  // Auto-reset on any transaction completion or error
  useEffect(() => {
    if (isConfirmed && hash) {
      console.log('✅ Transaction confirmed, starting reset process:', hash);
      
      // Only process once per hash
      if (!processedHashes.current.has(hash)) {
        processedHashes.current.add(hash);
        
        // Emit notification event
        window.dispatchEvent(new CustomEvent('transactionConfirmed', { 
          detail: { hash, address, timestamp: Date.now() } 
        }));
        
        // Show success briefly
        setLocalState('success');
        
        // Force reset after 1.5 seconds
        resetTimeoutRef.current = setTimeout(() => {
          forceCompleteReset();
          
          // Invalidate cache
          if (address) {
            setTimeout(() => cachedUserData.invalidateCache(), 1000);
          }
        }, 1500);
      }
    }
  }, [isConfirmed, hash, address, cachedUserData, forceCompleteReset]);

  // Handle errors with forced reset
  useEffect(() => {
    if (error) {
      console.log('❌ Transaction error, setting error state:', error.message);
      setLocalState('error');
      
      // Force reset after 2 seconds
      resetTimeoutRef.current = setTimeout(() => {
        forceCompleteReset();
      }, 2000);
    }
  }, [error, forceCompleteReset]);

  // Sync wagmi states to local state (but local can override)
  useEffect(() => {
    if (forceReset) return; // Don't sync during forced reset
    
    if (isPending) {
      setLocalState('pending');
    } else if (isConfirming) {
      setLocalState('confirming');
    }
  }, [isPending, isConfirming, forceReset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  // Transaction functions with complete error handling
  const mintDucks = useCallback(async (amount) => {
    console.log('🦆 Starting duck mint:', { amount, address, state: localState });
    
    if (localState !== 'idle') {
      console.log('⚠️ Transaction already in progress, ignoring');
      return;
    }

    if (!cachedGameData.duckPrice || !amount || !address) {
      throw new Error('Invalid parameters for minting ducks');
    }

    try {
      const totalCost = parseEther(cachedGameData.duckPrice) * BigInt(amount);
      
      await writeContract({
        address: CONTRACTS.MAIN,
        abi: MAIN_ABI,
        functionName: 'mintDucks',
        args: [amount],
        value: totalCost,
      });
      
      console.log('📤 Duck mint transaction submitted');
      
    } catch (err) {
      console.error('❌ Duck mint failed:', err);
      setLocalState('error');
      throw err;
    }
  }, [cachedGameData.duckPrice, address, writeContract, localState]);

  const mintZappers = useCallback(async (amount) => {
    console.log('⚡ Starting zapper mint:', { amount, address, state: localState });
    
    if (localState !== 'idle') {
      console.log('⚠️ Transaction already in progress, ignoring');
      return;
    }

    if (!cachedGameData.zapperPrice || !amount || !address) {
      throw new Error('Invalid parameters for minting zappers');
    }

    try {
      const totalCost = parseEther(cachedGameData.zapperPrice) * BigInt(amount);
      
      await writeContract({
        address: CONTRACTS.MAIN,
        abi: MAIN_ABI,
        functionName: 'mintZappers',
        args: [amount],
        value: totalCost,
      });
      
      console.log('📤 Zapper mint transaction submitted');
      
    } catch (err) {
      console.error('❌ Zapper mint failed:', err);
      setLocalState('error');
      throw err;
    }
  }, [cachedGameData.zapperPrice, address, writeContract, localState]);

  const sendZappers = useCallback(async (amount) => {
    console.log('🔫 Starting zapper send:', { amount, address, state: localState });
    
    if (localState !== 'idle') {
      console.log('⚠️ Transaction already in progress, ignoring');
      return;
    }

    if (!amount || !address) {
      throw new Error('Invalid parameters for sending zappers');
    }

    if (amount > cachedUserData.zapperBalance) {
      throw new Error(`Insufficient zappers. You have ${cachedUserData.zapperBalance}, need ${amount}`);
    }

    try {
      await writeContract({
        address: CONTRACTS.MAIN,
        abi: MAIN_ABI,
        functionName: 'sendZappers',
        args: [amount],
      });
      
      console.log('📤 Zapper send transaction submitted');
      
    } catch (err) {
      console.error('❌ Zapper send failed:', err);
      setLocalState('error');
      throw err;
    }
  }, [address, cachedUserData.zapperBalance, writeContract, localState]);

  // Return states - use local state as source of truth
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
    
    // State management - use local state as source of truth
    isPending: localState === 'pending',
    isConfirming: localState === 'confirming', 
    isConfirmed: localState === 'success',
    error: localState === 'error' ? (error || new Error('Transaction failed')) : null,
    hash,
    
    // Manual reset
    resetTransactionState: forceCompleteReset,
    
    // Utility functions
    refetchZapperBalance: cachedUserData.refetch,
    refetchDuckBalance: cachedUserData.refetch,
    
    // Cache state
    cacheLoading: cachedGameData.loading || cachedUserData.loading,
    cacheError: cachedGameData.error || cachedUserData.error,
  };
}
/* global BigInt */
// src/hooks/useGameContract.js - Updated for MiniKit integration
import { useState, useEffect } from 'react';
import { parseEther, encodeFunctionData } from 'viem';
import { useMiniKit } from './useMiniKit';
import { publicClient, currentChain } from '../minikit-config';
import { CONTRACTS, MAIN_ABI } from '../contracts';
import { useCachedGameData, useCachedUserData } from './useCachedData';

export function useGameContract() {
  const { address, isConnected, sendTransaction } = useMiniKit();
  const [transactionState, setTransactionState] = useState({
    hash: null,
    isPending: false,
    isConfirming: false,
    isConfirmed: false,
    error: null
  });

  // Replace all useReadContract calls with cached data
  const cachedGameData = useCachedGameData();
  const cachedUserData = useCachedUserData(address);

  // Wait for transaction confirmation
  useEffect(() => {
    let interval;
    
    if (transactionState.hash && transactionState.isConfirming) {
      interval = setInterval(async () => {
        try {
          const receipt = await publicClient.getTransactionReceipt({ 
            hash: transactionState.hash 
          });
          
          if (receipt) {
            setTransactionState(prev => ({
              ...prev,
              isConfirming: false,
              isConfirmed: true
            }));
            
            // Invalidate cache after successful transaction
            if (address) {
              setTimeout(() => {
                cachedUserData.invalidateCache();
              }, 2000);
            }
          }
        } catch (error) {
          // Transaction might still be pending
          console.log('Checking transaction confirmation...', error.message);
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [transactionState.hash, transactionState.isConfirming, address, cachedUserData]);

  const resetTransactionState = () => {
    setTransactionState({
      hash: null,
      isPending: false,
      isConfirming: false,
      isConfirmed: false,
      error: null
    });
  };

  const mintDucks = async (amount) => {
    if (!cachedGameData.duckPrice || !amount) {
      throw new Error('Duck price not loaded or invalid amount');
    }

    const totalCost = parseEther(cachedGameData.duckPrice) * BigInt(amount);
    console.log('Minting ducks:', { amount, price: cachedGameData.duckPrice, totalCost: totalCost.toString() });
    
    resetTransactionState();
    
    try {
      setTransactionState(prev => ({ ...prev, isPending: true }));

      const data = encodeFunctionData({
        abi: MAIN_ABI,
        functionName: 'mintDucks',
        args: [amount]
      });

      const transactionRequest = {
        to: CONTRACTS.MAIN,
        data,
        value: totalCost.toString(),
        chainId: currentChain.id
      };

      const hash = await sendTransaction(transactionRequest);
      
      setTransactionState({
        hash,
        isPending: false,
        isConfirming: true,
        isConfirmed: false,
        error: null
      });

    } catch (err) {
      console.error('Mint ducks failed:', err);
      setTransactionState({
        hash: null,
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        error: err
      });
      throw err;
    }
  };

  const mintZappers = async (amount) => {
    if (!cachedGameData.zapperPrice || !amount) {
      throw new Error('Zapper price not loaded or invalid amount');
    }

    const totalCost = parseEther(cachedGameData.zapperPrice) * BigInt(amount);
    console.log('Minting zappers:', { amount, price: cachedGameData.zapperPrice, totalCost: totalCost.toString() });
    
    resetTransactionState();
    
    try {
      setTransactionState(prev => ({ ...prev, isPending: true }));

      const data = encodeFunctionData({
        abi: MAIN_ABI,
        functionName: 'mintZappers',
        args: [amount]
      });

      const transactionRequest = {
        to: CONTRACTS.MAIN,
        data,
        value: totalCost.toString(),
        chainId: currentChain.id
      };

      const hash = await sendTransaction(transactionRequest);
      
      setTransactionState({
        hash,
        isPending: false,
        isConfirming: true,
        isConfirmed: false,
        error: null
      });

    } catch (err) {
      console.error('Mint zappers failed:', err);
      setTransactionState({
        hash: null,
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        error: err
      });
      throw err;
    }
  };

  const sendZappers = async (amount) => {
    if (!amount) {
      throw new Error('Invalid amount');
    }

    console.log('Sending zappers:', { amount });
    
    resetTransactionState();
    
    try {
      setTransactionState(prev => ({ ...prev, isPending: true }));

      const data = encodeFunctionData({
        abi: MAIN_ABI,
        functionName: 'sendZappers',
        args: [amount]
      });

      const transactionRequest = {
        to: CONTRACTS.MAIN,
        data,
        chainId: currentChain.id
      };

      const hash = await sendTransaction(transactionRequest);
      
      setTransactionState({
        hash,
        isPending: false,
        isConfirming: true,
        isConfirmed: false,
        error: null
      });

    } catch (err) {
      console.error('Send zappers failed:', err);
      setTransactionState({
        hash: null,
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        error: err
      });
      throw err;
    }
  };

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
    
    // Transaction functions
    mintDucks,
    mintZappers,
    sendZappers,
    refetchZapperBalance: cachedUserData.refetch,
    refetchDuckBalance: cachedUserData.refetch,
    
    // Transaction state
    isPending: transactionState.isPending,
    isConfirming: transactionState.isConfirming,
    isConfirmed: transactionState.isConfirmed,
    error: transactionState.error,
    hash: transactionState.hash,
    
    // Cache loading/error states
    cacheLoading: cachedGameData.loading || cachedUserData.loading,
    cacheError: cachedGameData.error || cachedUserData.error,
  };
}
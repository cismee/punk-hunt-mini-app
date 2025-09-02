/* global BigInt */
// src/hooks/useGameContract.js - Keep existing transaction logic, replace reads
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { useEffect } from 'react';
import { CONTRACTS, MAIN_ABI } from '../contracts';
import { useCachedGameData, useCachedUserData } from './useCachedData';

export function useGameContract() {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const { address } = useAccount();

  // Replace all useReadContract calls with cached data
  const cachedGameData = useCachedGameData();
  const cachedUserData = useCachedUserData(address);

  // Invalidate user cache after successful transactions
  useEffect(() => {
    if (isConfirmed && address) {
      console.log('Transaction confirmed, invalidating cache for:', address);
      // Add delay to allow blockchain to update
      setTimeout(() => {
        cachedUserData.invalidateCache();
      }, 2000);
    }
  }, [isConfirmed, address, cachedUserData]);

  // Keep existing transaction functions unchanged
  const mintDucks = async (amount) => {
    if (!cachedGameData.duckPrice || !amount) {
      throw new Error('Duck price not loaded or invalid amount');
    }

    const totalCost = parseEther(cachedGameData.duckPrice) * BigInt(amount);
    console.log('Minting ducks:', { amount, price: cachedGameData.duckPrice, totalCost: totalCost.toString() });
    
    try {
      await writeContract({
        address: CONTRACTS.MAIN,
        abi: MAIN_ABI,
        functionName: 'mintDucks',
        args: [amount],
        value: totalCost,
      });
    } catch (err) {
      console.error('Mint ducks failed:', err);
      throw err;
    }
  };

  const mintZappers = async (amount) => {
    if (!cachedGameData.zapperPrice || !amount) {
      throw new Error('Zapper price not loaded or invalid amount');
    }

    const totalCost = parseEther(cachedGameData.zapperPrice) * BigInt(amount);
    console.log('Minting zappers:', { amount, price: cachedGameData.zapperPrice, totalCost: totalCost.toString() });
    
    try {
      await writeContract({
        address: CONTRACTS.MAIN,
        abi: MAIN_ABI,
        functionName: 'mintZappers',
        args: [amount],
        value: totalCost,
      });
    } catch (err) {
      console.error('Mint zappers failed:', err);
      throw err;
    }
  };

  const sendZappers = async (amount) => {
    if (!amount) {
      throw new Error('Invalid amount');
    }

    console.log('Sending zappers:', { amount });
    
    try {
      await writeContract({
        address: CONTRACTS.MAIN,
        abi: MAIN_ABI,
        functionName: 'sendZappers',
        args: [amount],
      });
    } catch (err) {
      console.error('Send zappers failed:', err);
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
    
    // Keep existing transaction functions
    mintDucks,
    mintZappers,
    sendZappers,
    refetchZapperBalance: cachedUserData.refetch,
    refetchDuckBalance: cachedUserData.refetch,
    
    // Keep existing transaction state
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
    
    // Expose cache loading/error states
    cacheLoading: cachedGameData.loading || cachedUserData.loading,
    cacheError: cachedGameData.error || cachedUserData.error,
  };
}
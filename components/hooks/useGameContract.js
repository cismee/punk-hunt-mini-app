/* global BigInt */
// src/hooks/useGameContract.js - Simplified hook for MiniKit + OnchainKit
import { useCallback } from 'react';
import { parseEther } from 'viem';
import { CONTRACTS, MAIN_ABI } from '../contracts';
import { useCachedGameData, useCachedUserData } from './useCachedData';

export function useGameContract() {
  // Get cached data
  const cachedGameData = useCachedGameData();
  const cachedUserData = useCachedUserData();

  // Create transaction calls for OnchainKit Transaction components
  const createMintDucksCall = useCallback((amount, address) => {
    if (!cachedGameData.duckPrice || !amount) {
      throw new Error('Duck price not loaded or invalid amount');
    }

    const totalCost = parseEther(cachedGameData.duckPrice) * BigInt(amount);
    console.log('Mint ducks call:', { amount, totalCost: totalCost.toString() });
    
    return {
      to: CONTRACTS.MAIN,
      abi: MAIN_ABI,
      functionName: 'mintDucks',
      args: [amount],
      value: totalCost,
    };
  }, [cachedGameData.duckPrice]);

  const createMintZappersCall = useCallback((amount, address) => {
    if (!cachedGameData.zapperPrice || !amount) {
      throw new Error('Zapper price not loaded or invalid amount');
    }

    const totalCost = parseEther(cachedGameData.zapperPrice) * BigInt(amount);
    console.log('Mint zappers call:', { amount, totalCost: totalCost.toString() });
    
    return {
      to: CONTRACTS.MAIN,
      abi: MAIN_ABI,
      functionName: 'mintZappers',
      args: [amount],
      value: totalCost,
    };
  }, [cachedGameData.zapperPrice]);

  const createSendZappersCall = useCallback((amount, address) => {
    if (!amount) {
      throw new Error('Invalid amount');
    }

    console.log('Send zappers call:', { amount });
    
    return {
      to: CONTRACTS.MAIN,
      abi: MAIN_ABI,
      functionName: 'sendZappers',
      args: [amount],
    };
  }, []);

  // Legacy wrapper functions (for backward compatibility with existing components)
  const mintDucks = useCallback(async (amount, address) => {
    return createMintDucksCall(amount, address);
  }, [createMintDucksCall]);

  const mintZappers = useCallback(async (amount, address) => {
    return createMintZappersCall(amount, address);
  }, [createMintZappersCall]);

  const sendZappers = useCallback(async (amount, address) => {
    return createSendZappersCall(amount, address);
  }, [createSendZappersCall]);

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
    
    // Transaction call creators (recommended for OnchainKit Transaction components)
    createMintDucksCall,
    createMintZappersCall,
    createSendZappersCall,
    
    // Legacy functions (for existing component compatibility)
    mintDucks,
    mintZappers,
    sendZappers,
    
    // Cache functions
    refetchZapperBalance: cachedUserData.refetch,
    refetchDuckBalance: cachedUserData.refetch,
    
    // Expose cache loading/error states
    cacheLoading: cachedGameData.loading || cachedUserData.loading,
    cacheError: cachedGameData.error || cachedUserData.error,
    
    // Note: Transaction state should be managed by OnchainKit Transaction components
    // Remove isPending, isConfirming, isConfirmed, error, hash from here
  };
}
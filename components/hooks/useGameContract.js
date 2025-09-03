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
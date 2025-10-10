import { useState, useEffect } from 'react';

// Hardcoded API base to match server.js CORS configuration
const API_BASE = 'https://punkhunt.gg';

export function useCachedGameData() {
  const [data, setData] = useState({
    duckPrice: null,
    zapperPrice: null,
    huntingSeason: false,
    gameStarted: false, // ADDED THIS
    ducksMinted: 0,
    ducksRekt: 0,
    zappersMinted: 0,
    ducksBurned: 0,
    zappersBurned: 0,
    ducksMintEndTimestamp: null,
    lastUpdate: 0,
    winner: '0x0000000000000000000000000000000000000000',
    secondPlace: '0x0000000000000000000000000000000000000000',
    thirdPlace: '0x0000000000000000000000000000000000000000',
    topShooter: '0x0000000000000000000000000000000000000000',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log('🔄 Fetching game data from:', `${API_BASE}/api/game-data`);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_BASE}/api/game-data`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit', // Don't send cookies
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('📡 Game data response status:', response.status);
        console.log('📡 Response headers:', Object.fromEntries(response.headers));
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const gameData = await response.json();
        console.log('✅ Game data received:', gameData);
        
        // Map server response to expected format
        setData({
          duckPrice: gameData.duckPrice,
          zapperPrice: gameData.zapperPrice,
          huntingSeason: gameData.huntingSeason,
          gameStarted: gameData.gameStarted, // 🆕 ADDED THIS
          ducksMinted: gameData.ducksMinted,
          ducksRekt: gameData.ducksRekt,
          zappersMinted: gameData.zappersMinted,
          ducksBurned: gameData.ducksBurned || gameData.ducksRekt, // Server uses ducksRekt for both
          zappersBurned: gameData.zappersBurned,
          ducksMintEndTimestamp: gameData.ducksMintEndTimestamp,
          lastUpdate: gameData.lastUpdate,
          winner: gameData.winner || '0x0000000000000000000000000000000000000000',
          secondPlace: gameData.secondPlace || '0x0000000000000000000000000000000000000000',
          thirdPlace: gameData.thirdPlace || '0x0000000000000000000000000000000000000000',
          topShooter: gameData.topShooter || '0x0000000000000000000000000000000000000000'
        });
        setError(null);
        
      } catch (error) {
        console.error('❌ Failed to fetch cached game data:', error);
        setError(error.message);
        
        // Keep previous data on error, only set defaults if no previous data
        if (data.ducksMinted === 0 && !data.duckPrice) {
          setData(prev => ({
            ...prev,
            duckPrice: '0.00222', // Match server defaults
            zapperPrice: '0.0001984',
            huntingSeason: false,
            gameStarted: false // ADDED THIS
          }));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Match server's 15-second update interval
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  return { ...data, loading, error };
}

export function useCachedUserData(address) {
  // Initialize with localStorage cache
  const getInitialUserData = () => {
    if (!address) return { duckBalance: 0, zapperBalance: 0, zapCount: 0 };
    
    try {
      const cached = localStorage.getItem(`userData_${address}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Server caches for 30 seconds, so use 30 second client cache too
        if (Date.now() - parsed.timestamp < 30000) {
          return {
            duckBalance: parsed.duckBalance || 0,
            zapperBalance: parsed.zapperBalance || 0,
            zapCount: parsed.zapCount || 0
          };
        }
      }
    } catch (error) {
      console.warn('Failed to load cached user data:', error);
    }
    
    return { duckBalance: 0, zapperBalance: 0, zapCount: 0 };
  };

  const initialData = getInitialUserData();
  const [userData, setUserData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      setUserData({ duckBalance: 0, zapperBalance: 0, zapCount: 0 });
      return;
    }

    const fetchUserData = async () => {
      console.log(`🔄 Fetching user data for: ${address}`);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(`${API_BASE}/api/user/${address}/balances`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit',
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        
        console.log('📡 User data response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ User data received:', data);
        
        // Server returns { address, duckBalance, zapperBalance, zapCount, lastUpdate }
        setUserData({
          duckBalance: data.duckBalance || 0,
          zapperBalance: data.zapperBalance || 0,
          zapCount: data.zapCount || 0
        });
        setError(null);
        
        // Cache the data
        try {
          localStorage.setItem(`userData_${address}`, JSON.stringify({
            duckBalance: data.duckBalance || 0,
            zapperBalance: data.zapperBalance || 0,
            zapCount: data.zapCount || 0,
            timestamp: Date.now()
          }));
        } catch (error) {
          console.warn('Failed to cache user data:', error);
        }
        
      } catch (error) {
        console.error('❌ Failed to fetch user data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    // Fetch user data every 45 seconds (less frequent than game data)
    const interval = setInterval(fetchUserData, 45000);
    return () => clearInterval(interval);
  }, [address]);

  const refetch = async () => {
    if (!address) return;
    
    setLoading(true);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${API_BASE}/api/user/${address}/balances`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUserData({
        duckBalance: data.duckBalance || 0,
        zapperBalance: data.zapperBalance || 0,
        zapCount: data.zapCount || 0
      });
      setError(null);
      
      // Update cache
      try {
        localStorage.setItem(`userData_${address}`, JSON.stringify({
          duckBalance: data.duckBalance || 0,
          zapperBalance: data.zapperBalance || 0,
          zapCount: data.zapCount || 0,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.warn('Failed to cache user data:', error);
      }
    } catch (error) {
      console.error('Failed to refetch user data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const invalidateCache = async () => {
    if (!address) return;
    
    // Clear localStorage cache
    try {
      localStorage.removeItem(`userData_${address}`);
    } catch (error) {
      console.warn('Failed to clear user data cache:', error);
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Call server invalidation endpoint that matches server.js
      await fetch(`${API_BASE}/api/user/${address}/invalidate-cache`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      console.log('✅ Server cache invalidated for:', address);
      
      // Wait a moment then refetch to get fresh data
      setTimeout(() => refetch(), 1000);
      
    } catch (error) {
      console.error('Failed to invalidate server cache:', error);
      // Still attempt to refetch even if invalidation fails
      setTimeout(() => refetch(), 1000);
    }
  };

  return { 
    duckBalance: userData.duckBalance,
    zapperBalance: userData.zapperBalance, 
    zapCount: userData.zapCount,
    loading, 
    error, 
    refetch, 
    invalidateCache 
  };
}
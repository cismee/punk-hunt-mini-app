import { useState, useEffect } from 'react';

// Hardcoded API base to match server.js CORS configuration
const API_BASE = 'https://punkhunt.gg';

export function useCachedGameData() {
  const [data, setData] = useState({
    duckPrice: null,
    zapperPrice: null,
    huntingSeason: false,
    gameStarted: false, // 🆕 ADD THIS
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
          credentials: 'omit',
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
          gameStarted: gameData.gameStarted, // 🆕 ADD THIS
          ducksMinted: gameData.ducksMinted,
          ducksRekt: gameData.ducksRekt,
          zappersMinted: gameData.zappersMinted,
          ducksBurned: gameData.ducksBurned || gameData.ducksRekt,
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
            duckPrice: '0.00222',
            zapperPrice: '0.0001984',
            huntingSeason: false,
            gameStarted: false // 🆕 ADD THIS
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

// ... rest of the file stays the same
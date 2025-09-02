// src/hooks/useDuckHolders.js
import { useState, useEffect } from 'react';

const API_BASE = 'https://punkhunt.gg';

export function useDuckHolders() {
  const [holders, setHolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHolders = async () => {
      console.log('🔄 Fetching holders from:', `${API_BASE}/api/holders`);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_BASE}/api/holders`, {
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
        
        console.log('📡 Holders response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Holders data received:', data);
        
        // Server returns { holders: topHolders } where topHolders is array of { address, balance }
        setHolders(data.holders || []);
        setError(null);
        
      } catch (err) {
        console.error('❌ Failed to fetch holders from backend:', err);
        setError(err.message);
        setHolders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHolders();
    // Match server's 15-second cache update interval
    const interval = setInterval(fetchHolders, 15000);
    return () => clearInterval(interval);
  }, []);

  return { holders, loading, error };
}
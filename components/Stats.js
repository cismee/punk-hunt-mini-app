// components/Stats.js
import React from 'react';
import { useCachedGameData } from './hooks/useCachedData';
import { useDuckHolders } from './hooks/useDuckHolders';
import { useState, useEffect } from 'react';
import { CONTRACTS } from './contracts';

function formatAddress(address) {
  if (!address) {
    return '0x00...DEAD';
  }
  return `${address.slice(0, 4)}...${address.slice(-4).toUpperCase()}`;
}

// Component for rendering address with OpenSea link
function AddressLink({ address, children, style }) {
  if (!address) {
    return <span style={{ ...style, fontSize: '1em' }}>{children}</span>;
  }
  
  return (
    <a
      href={`https://opensea.io/${address}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ ...style, fontSize: '1em' }}
      className="underline hover:opacity-100"
    >
      {children}
    </a>
  );
}

function Stats() {
  const cachedGameData = useCachedGameData();
  const { holders, loading, error } = useDuckHolders();
  const [leaderboardData, setLeaderboardData] = useState({ topHunters: [], loading: true });
  
  // Fetch leaderboard data from backend that matches server.js leaderboard endpoint
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`https://punkhunt.gg/api/leaderboard`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          credentials: 'omit'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Leaderboard data received:', data);
        
        // Server returns { topHunters: [], topHolders: [], lastUpdate }
        setLeaderboardData({ 
          topHunters: data.topHunters || [], 
          loading: false 
        });
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setLeaderboardData({ topHunters: [], loading: false });
      }
    };

    fetchLeaderboard();
    // Match server's 15-second update interval
    const interval = setInterval(fetchLeaderboard, 15000);
    return () => clearInterval(interval);
  }, []);
  
  // Helper functions for prize pool calculations using server data
  const calculateDuckPrizePool = () => {
    if (!cachedGameData.ducksMinted || !cachedGameData.duckPrice) return '0.000';
    const totalDuckRevenue = parseFloat(cachedGameData.duckPrice) * cachedGameData.ducksMinted;
    const prizePool = totalDuckRevenue * 0.5;
    return prizePool.toFixed(3);
  };

  const calculateZapperPrizePool = () => {
    if (!cachedGameData.zappersMinted || !cachedGameData.zapperPrice || !cachedGameData.ducksMinted) return '0.000';
    // Subtract free zappers (1 per duck minted) to get paid zapper mints
    const paidZapperMints = Math.max(0, cachedGameData.zappersMinted - cachedGameData.ducksMinted);
    const totalZapperRevenue = parseFloat(cachedGameData.zapperPrice) * paidZapperMints;
    const prizePool = totalZapperRevenue * 0.5;
    return prizePool.toFixed(3);
  };

  // Create modified holders list with winner/secondPlace/thirdPlace override
  const getDisplayHolders = () => {
    const zeroAddress = '0x0000000000000000000000000000000000000000';
    
    // Start with original holders list
    let displayHolders = [...holders];
    
    // If we have secondPlace and it's not zero address, inject it at position 2
    if (cachedGameData.secondPlace && cachedGameData.secondPlace !== zeroAddress) {
      // Remove secondPlace from original position if it exists
      displayHolders = displayHolders.filter(holder => holder.address !== cachedGameData.secondPlace);
      
      // Insert at position 1 (index 1 = 2nd place)
      displayHolders.splice(1, 0, {
        address: cachedGameData.secondPlace,
        balance: 'WINNER' // Or you could show actual balance if available
      });
    }
    
    // If we have thirdPlace and it's not zero address, inject it at position 3
    if (cachedGameData.thirdPlace && cachedGameData.thirdPlace !== zeroAddress) {
      // Remove thirdPlace from original position if it exists
      displayHolders = displayHolders.filter(holder => holder.address !== cachedGameData.thirdPlace);
      
      // Insert at position 2 (index 2 = 3rd place)
      displayHolders.splice(2, 0, {
        address: cachedGameData.thirdPlace,
        balance: 'WINNER' // Or you could show actual balance if available
      });
    }
    
    // Limit to top 5
    return displayHolders.slice(0, 5);
  };

  // Show loading state while cache is loading
  if (cachedGameData.loading) {
    return (
      <div className="splash pt-2 bg-black text-white" id="stats">
        <div className="w-full px-2 sm:px-4">
          <div className="flex flex-wrap justify-center">
            <div className="w-full text-center">
              <h1 className="pt-4 text-xl sm:text-2xl lg:text-3xl">Loading game data...</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="splash pt-2 bg-black text-white" id="stats">
      <div className="w-full px-2 sm:px-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full text-center">
            <h1 className="pt-4 text-xl sm:text-2xl lg:text-3xl">leaderboard</h1>
          </div>
        </div>
      </div>

      {/* Duck Holders Section */}
      <div className="w-full px-2 sm:px-4 pt-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full flex text-center">
            <div className="w-1/2 text-left">
              <h2 className="text-[#3BC3FD] text-lg sm:text-xl">Hodlers</h2>
            </div>
            <div className="w-1/2 text-right">
              <h2 className="text-[#3BC3FD] text-lg sm:text-xl">Ducks</h2>
            </div>
          </div>
          <hr className="w-full h-1 bg-[#3BC3FD] border-0 my-2 opacity-100" />
        </div>
      </div>

      <div className="w-full px-2 sm:px-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full text-center">
            {loading ? (
              <div className="flex stats">
                <div className="w-1/2 text-left">
                  <p className="text-[#3BC3FD] text-sm sm:text-base">Loading holders...</p>
                </div>
                <div className="w-1/2 text-right">
                  <p className="text-[#3BC3FD] text-sm sm:text-base">...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex stats">
                <div className="w-1/2 text-left">
                  <p className="text-[#3BC3FD] text-sm sm:text-base">Error loading</p>
                </div>
                <div className="w-1/2 text-right">
                  <p className="text-[#3BC3FD] text-sm sm:text-base">-</p>
                </div>
              </div>
            ) : holders.length > 0 || cachedGameData.secondPlace !== '0x0000000000000000000000000000000000000000' || cachedGameData.thirdPlace !== '0x0000000000000000000000000000000000000000' ? (
              <>
                {getDisplayHolders().map((holder, index) => (
                  <div key={holder.address} className="flex stats py-1">
                    <div className="w-1/2 text-left">
                      <p className="text-[#3BC3FD] text-sm sm:text-base">
                        {index + 1}. <AddressLink address={holder.address} style={{ color: '#3BC3FD' }}>
                          {formatAddress(holder.address)}
                        </AddressLink>
                      </p>
                    </div>
                    <div className="w-1/2 text-right">
                      <p className="text-[#3BC3FD] text-sm sm:text-base">{holder.balance}</p>
                    </div>
                  </div>
                ))}
                
                {/* Fill remaining positions with placeholders */}
                {[...Array(Math.max(0, 5 - getDisplayHolders().length))].map((_, index) => (
                  <div key={`placeholder-${index}`} className="flex stats py-1">
                    <div className="w-1/2 text-left">
                      <p className="text-[#3BC3FD] text-sm sm:text-base">
                        {getDisplayHolders().length + index + 1}. <AddressLink address="0x000000000000000000000000000000000000dEaD" style={{ color: '#3BC3FD' }}>
                          {formatAddress("0x000000000000000000000000000000000000dEaD")}
                        </AddressLink>
                      </p>
                    </div>
                    <div className="w-1/2 text-right">
                      <p className="text-[#3BC3FD] text-sm sm:text-base">0</p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // No holders found
              [...Array(5)].map((_, index) => (
                <div key={`no-holders-${index}`} className="flex stats py-1">
                  <div className="w-1/2 text-left">
                    <p className="text-[#3BC3FD] text-sm sm:text-base">
                      {index + 1}. <AddressLink address="0x000000000000000000000000000000000000dEaD" style={{ color: '#3BC3FD' }}>
                        {formatAddress("0x000000000000000000000000000000000000dEaD")}
                      </AddressLink>
                    </p>
                  </div>
                  <div className="w-1/2 text-right">
                    <p className="text-[#3BC3FD] text-sm sm:text-base">0</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Shots Section */}
      <div className="w-full px-2 sm:px-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full flex text-center">
            <div className="w-1/2 text-left">
              <h2 className="text-[#ea6126] text-lg sm:text-xl">Top Shots</h2>
            </div>
            <div className="w-1/2 text-right">
              <h2 className="text-[#ea6126] text-lg sm:text-xl">Hits</h2>
            </div>
          </div>
          <hr className="w-full h-1 bg-[#ea6126] border-0 opacity-100 my-2" />
        </div>
      </div>

      <div className="w-full px-2 sm:px-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full text-center">
            {leaderboardData.loading ? (
              <div className="flex stats py-1">
                <div className="w-1/2 text-left">
                  <p className="text-[#ea6126] text-sm sm:text-base">Loading hunters...</p>
                </div>
                <div className="w-1/2 text-right">
                  <p className="text-[#ea6126] text-sm sm:text-base">...</p>
                </div>
              </div>
            ) : leaderboardData.topHunters.length > 0 ? (
              <>
                {leaderboardData.topHunters.map((hunter, index) => (
                  <div key={hunter.address} className="flex stats py-1">
                    <div className="w-1/2 text-left">
                      <p className="text-[#ea6126] text-sm sm:text-base">
                        {index + 1}. <AddressLink address={hunter.address} style={{ color: '#ea6126' }}>
                          {formatAddress(hunter.address)}
                        </AddressLink>
                      </p>
                    </div>
                    <div className="w-1/2 text-right">
                      <p className="text-[#ea6126] text-sm sm:text-base">{hunter.zapCount}</p>
                    </div>
                  </div>
                ))}
                
                {/* Fill remaining positions with placeholders */}
                {[...Array(Math.max(0, 5 - leaderboardData.topHunters.length))].map((_, index) => (
                  <div key={`hunter-placeholder-${index}`} className="flex stats py-1">
                    <div className="w-1/2 text-left">
                      <p className="text-[#ea6126] text-sm sm:text-base">
                        {leaderboardData.topHunters.length + index + 1}. <AddressLink address="0x000000000000000000000000000000000000dEaD" style={{ color: '#ea6126' }}>
                          {formatAddress("0x000000000000000000000000000000000000dEaD")}
                        </AddressLink>
                      </p>
                    </div>
                    <div className="w-1/2 text-right">
                      <p className="text-[#ea6126] text-sm sm:text-base">0</p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // No hunters found
              [...Array(5)].map((_, index) => (
                <div key={`no-hunters-${index}`} className="flex stats py-1">
                  <div className="w-1/2 text-left">
                    <p className="text-[#ea6126] text-sm sm:text-base">
                      {index + 1}. <AddressLink address="0x000000000000000000000000000000000000dEaD" style={{ color: '#ea6126' }}>
                        {formatAddress("0x000000000000000000000000000000000000dEaD")}
                      </AddressLink>
                    </p>
                  </div>
                  <div className="w-1/2 text-right">
                    <p className="text-[#ea6126] text-sm sm:text-base">0</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="w-full px-2 sm:px-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full flex text-center">
            <div className="w-1/2 text-left">
              <h2 className="text-[#97E500] text-lg sm:text-xl">Stats</h2>
            </div>
            <div className="w-1/2 text-right">
              <h2 className="text-[#97E500] text-lg sm:text-xl">Count</h2>
            </div>
          </div>
          <hr className="w-full h-1 bg-[#97E500] border-0 opacity-100 my-2" />
        </div>
      </div>

      <div className="w-full px-2 sm:px-4">
        <div className="flex flex-wrap">
          <div className="w-full text-center space-y-2">
            <div className="flex stats">
              <div className="w-1/2 text-left">
                <p className="text-[#97E500] text-sm sm:text-base">Live Ducks:</p>
              </div>
              <div className="w-1/2 text-right">
                <p className="text-[#97E500] text-sm sm:text-base">{cachedGameData.ducksMinted - cachedGameData.ducksRekt}</p>
              </div>
            </div>

            <div className="flex stats">
              <div className="w-1/2 text-left">
                <p className="text-[#97E500] text-sm sm:text-base">Dead Ducks:</p>
              </div>
              <div className="w-1/2 text-right">
                <p className="text-[#97E500] text-sm sm:text-base">{cachedGameData.ducksRekt}</p>
              </div>
            </div>

            <div className="flex stats">
              <div className="w-1/2 text-left">
                <p className="text-[#97E500] text-sm sm:text-base">Live Zaps:</p>
              </div>
              <div className="w-1/2 text-right">
                <p className="text-[#97E500] text-sm sm:text-base">{cachedGameData.zappersMinted - cachedGameData.zappersBurned}</p>
              </div>
            </div>

            <div className="flex stats">
              <div className="w-1/2 text-left">
                <p className="text-[#97E500] text-sm sm:text-base">Shots Fired:</p>
              </div>
              <div className="w-1/2 text-right">
                <p className="text-[#97E500] text-sm sm:text-base">{cachedGameData.zappersBurned}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prize Pool Section */}
      <div className="w-full px-2 sm:px-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full flex text-center">
            <div className="w-1/2 text-left">
              <h2 className="text-[#aa32d2] text-lg sm:text-xl">Pool</h2>
            </div>
            <div className="w-1/2 text-right">
              <h2 className="text-[#aa32d2] text-lg sm:text-xl">ETH</h2>
            </div>
          </div>
          <hr className="w-full h-1 bg-[#aa32d2] border-0 opacity-100 my-2" />
        </div>
      </div>

      <div className="w-full px-2 sm:px-4">
        <div className="flex flex-wrap">
          <div className="w-full text-center space-y-2">
            <div className="flex stats">
              <div className="w-1/2 text-left">
                <p className="text-[#aa32d2] text-sm sm:text-base">Top 3 Ducks:</p>
              </div>
              <div className="w-1/2 text-right">
                <p className="text-[#aa32d2] text-sm sm:text-base">{calculateDuckPrizePool()}</p>
              </div>
            </div>

            <div className="flex stats">
              <div className="w-1/2 text-left">
                <p className="text-[#aa32d2] text-sm sm:text-base">Top Hunter:</p>
              </div>
              <div className="w-1/2 text-right">
                <p className="text-[#aa32d2] text-sm sm:text-base">{calculateZapperPrizePool()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-2 sm:px-4 pt-2 pb-4">
        <div className="flex flex-wrap justify-center">
          <div className="w-full text-center">
            <h2 className="text-base sm:text-lg">Contract:</h2>
            <a 
              className="underline transition-opacity" 
              href={`https://basescan.org/address/${CONTRACTS.MAIN}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#ea6126' }}
            >
              {formatAddress(CONTRACTS.MAIN)}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
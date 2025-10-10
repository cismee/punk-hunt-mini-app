// components/Splash.js
import React from 'react';
import { useCachedGameData } from './hooks/useCachedData';

const logo = '/img/punkhunt.png';
const etherscan = '/img/Pixel_Etherscan_Hunt.png';
const opensea = '/img/opensea.png';
const twitter = '/img/x_alt.png';

export default function Splash() {
  const cachedGameData = useCachedGameData();
  
  // Sound effect handlers
  const handleMenuClick = (soundKey, targetId) => {
    // Enable audio and play sound
    if (window.enableAudio) {
      window.enableAudio();
    }
    if (window.playButtonSound) {
      window.playButtonSound(soundKey);
    }
    
    // Navigate to section after a brief delay to let sound start
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // 🆕 Determine game status message and color
  const getGameStatus = () => {
    // Check if game is over (winner exists and not zero address)
    const gameCompleted = cachedGameData.winner && 
                         cachedGameData.winner !== '0x0000000000000000000000000000000000000000';
    
    if (gameCompleted) {
      return {
        message: 'Game Over!',
        color: '#f42a2a' // Red
      };
    }
    
    if (cachedGameData.gameStarted) {
      return {
        message: 'Game Started - Happy Hunting!',
        color: '#97E500' // Green
      };
    }
    
    return {
      message: 'Game Starts 10/28/25 @ 9AM PDT',
      color: '#aa32d2' // Purple
    };
  };

  const gameStatus = getGameStatus();

  return (
    <section className="splash bg-black text-white flex flex-col justify-center" id="splash" data-sfx="splash">
      
      {/* Title */}
      <div className="py-4">
        <div className="w-full px-4">
          <div className="flex flex-wrap">
            <div className="w-full text-center">
              <img src={logo} className="w-full max-w-xs mx-auto h-auto" alt="PUNK HUNT" />
            </div>
          </div>
        </div>
      </div>

      {/* Tagline */}
      <div className="w-full px-4">
        <div className="flex flex-wrap">
          <div className="w-full text-center">
            <h2 className="pt-2 px-2 uppercase font-bold">
              An Onchain PvP NFT Elimination Game
            </h2>
            {/* Game Status Line */}
            <p 
              className="pt-2 px-2 font-bold"
              style={{ 
                color: gameStatus.color,
                textShadow: '2px 2px 0 rgba(0, 0, 0, 0.3)'
              }}
            >
              {gameStatus.message}
            </p>
          </div>
        </div>
      </div>

      {/* Menu (pixel bullet + links, aligned) */}
      <div className="w-full px-4 py-2">
        <div className="flex flex-wrap justify-center">
          <div className="w-full text-center max-w-md">
            <ul className="space-y-3 text-left inline-block">

              <li className="flex items-center space-x-3 group">
                <a 
                  href="#duckmint" 
                  className="text-[#ff650b] hover:text-[#ff650b] text-sm sm:text-base font-bold"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick('ducks', 'duckmint');
                  }}
                >
                  Mint Ducks
                </a>
              </li>

              <li className="flex items-center space-x-3 group">
                <a 
                  href="#zappmint" 
                  className="text-[#ff650b] hover:text-[#ff650b] text-sm sm:text-base font-bold"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick('zappmint', 'zappmint');
                  }}
                >
                  Buy Zappers
                </a>
              </li>

              <li className="flex items-center space-x-3 group">
                <a 
                  href="#burn" 
                  className="text-[#ff650b] hover:text-[#ff650b] text-sm sm:text-base font-bold"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick('burn', 'burn');
                  }}
                >
                  Shoot Ducks
                </a>
              </li>

              <li className="flex items-center space-x-3 group">
                <a 
                  href="#stats" 
                  className="text-[#ff650b] hover:text-[#ff650b] text-sm sm:text-base font-bold"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMenuClick('stats', 'stats');
                  }}
                >
                  Leaderboard
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Winners + icons + footer */}
      <div className="w-full px-4">
        <div className="flex flex-wrap">
          <div className="w-full text-center">

            <div className="flex justify-center">
              <a 
                href="#faq" 
                className="text-[#97E500] hover:text-[#97E500]"
                onClick={(e) => {
                  e.preventDefault();
                  handleMenuClick('faq', 'faq');
                }}
              >
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Win Bluechip NFTs!</h1>
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center items-center space-x-4">
              <a href="https://opensea.io/item/base/0x068Addbbc8789C1F3Ba7e384B5614cF6c210c177/1" target="_blank" rel="noreferrer" className="hover:opacity-75 transition-opacity">
                <img src={opensea} alt="OpenSea" className="h-8 mx-2 sm:h-8 w-auto" />
              </a>
              <a href="https://x.com/cartyisme" target="_blank" rel="noreferrer" className="hover:opacity-75 transition-opacity">
                <img src={twitter} alt="X/Twitter" className="h-8 mx-2 sm:h-8 w-auto" />
              </a>
              <a href="https://basescan.org/address/0x831d0CC6fb4bDa004D2d49342085e5299A9B782B#code" target="_blank" rel="noreferrer" className="hover:opacity-75 transition-opacity">
                <img src={etherscan} alt="BaseScan" className="h-8 mx-2 sm:h-8 w-auto" />
              </a>
            </div>

            <h2 className="mt-3 mb-4 uppercase font-bold">©2025 ON BASE</h2>
          </div>
        </div>
      </div>

      <style jsx>{`
        .splash {
          background: linear-gradient(45deg, #000 25%, transparent 25%), 
                      linear-gradient(-45deg, #000 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #000 75%), 
                      linear-gradient(-45deg, transparent 75%, #000 75%);
          background-size: 4px 4px;
          background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .group:hover .group-hover\\:animate-pulse {
          animation: pulse 1s infinite;
        }
      `}</style>
    </section>
  );
}
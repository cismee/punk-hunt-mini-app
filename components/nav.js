import './nav.css';
const logo = './img/nav_icon.png';
import { useDisconnect, useAccount, useConnect } from 'wagmi';
import { useCachedUserData } from './hooks/useCachedData';
import { useEffect } from 'react';

const App = () => {
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { duckBalance, zapperBalance, zapCount, loading, refetch } = useCachedUserData(address);

  // Auto-refresh data periodically when connected
  useEffect(() => {
    if (address) {
      const interval = setInterval(() => {
        refetch();
      }, 5000); // Refetch every 5 seconds when connected

      return () => clearInterval(interval);
    }
  }, [address, refetch]);

  // Debug logging
  console.log('Nav debug (cached):', {
    userDuckBalance: duckBalance,
    userZapperBalance: zapperBalance,
    userKillCount: zapCount,
    address,
    loading
  });

  // Sound effect handlers
  const handleNavClick = (soundKey, targetId) => {
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

  const handleConnect = () => {
    // For Base mini-apps, try to connect with the first available connector
    // Usually this will be the injected connector (Base App's built-in wallet)
    const injectedConnector = connectors.find(connector => 
      connector.id === 'injected' || connector.name.toLowerCase().includes('injected')
    );
    
    if (injectedConnector) {
      connect({ connector: injectedConnector });
    } else if (connectors[0]) {
      connect({ connector: connectors[0] });
    }
  };

  // Only show loading on initial load when we have no data yet
  const showLoading = loading && (duckBalance === null || duckBalance === undefined);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full px-2 nav bg-black">
      <div className="w-full" style={{ marginTop: '0px !important' }}>
        <div className="flex items-center justify-between" style={{ maxHeight: '80px' }}>
          {/* Left Section */}
          <div className="flex items-center justify-start">
            <img src={logo} alt="Group Image" className="w-auto h-16 m-2" />
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-end">
            {!isConnected ? (
              // Not connected - show connect button
              <button
                className="nes-btn is-primary text-xs px-3 py-2"
                onClick={handleConnect}
                type="button"
              >
                CONNECT
              </button>
            ) : (
              // Connected - show balances and disconnect button
              <div className="flex items-center gap-3">
                {/* User Balances */}
                <div className="flex items-center gap-2 text-white text-sm">
                  <a 
                    href="#duckmint" 
                    className="flex items-center no-underline text-white hover:text-blue-300"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('ducks', 'duckmint');
                    }}
                    style={{ lineHeight: '1' }}
                  >
                    <span className="text-blue-400 font-bold cursor-pointer" style={{ fontSize: '16px' }}>🦆</span>
                    <span className="ml-1" style={{ lineHeight: '1' }}>{showLoading ? '...' : (duckBalance || 0)}</span>
                  </a>
                  <a 
                    href="#zappmint" 
                    className="flex items-center no-underline text-white hover:text-green-300"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('zappmint', 'zappmint');
                    }}
                    style={{ lineHeight: '1' }}
                  >
                    <span className="text-green-400 font-bold cursor-pointer" style={{ fontSize: '16px' }}>⚡</span>
                    <span className="ml-1" style={{ lineHeight: '1' }}>{showLoading ? '...' : (zapperBalance || 0)}</span>
                  </a>
                  <a 
                    href="#burn" 
                    className="flex items-center no-underline text-white hover:text-red-300"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('burn', 'burn');
                    }}
                    style={{ lineHeight: '1' }}
                  >
                    <span className="text-red-400 font-bold cursor-pointer" style={{ fontSize: '16px' }}>🎯</span>
                    <span className="ml-1 cursor-pointer" style={{ lineHeight: '1' }}>{showLoading ? '...' : (zapCount || 0)}</span>
                  </a>
                </div>

                {/* Disconnect Button */}
                <button
                  className="nes-btn text-xs px-2 py-1"
                  onClick={() => disconnect()}
                  type="button"
                >
                  X
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default App;
import './nav.css';
const logo = './img/nav_icon.png';
import { useDisconnect, useAccount, useConnect, useConnectors } from 'wagmi';
import { useCachedUserData } from './hooks/useCachedData';
import { useEffect, useState } from 'react';
import { getPreferredConnector } from '../wagmi-config';

const App = () => {
  const { disconnect } = useDisconnect();
  const { address, isConnected, connector } = useAccount();
  const { connect, error: connectError, isPending: isConnecting } = useConnect();
  const connectors = useConnectors();
  const { duckBalance, zapperBalance, zapCount, loading, refetch } = useCachedUserData(address);
  const [connectionAttempted, setConnectionAttempted] = useState(false);

  // Auto-refresh data periodically when connected
  useEffect(() => {
    if (address) {
      const interval = setInterval(() => {
        refetch();
      }, 5000); // Refetch every 5 seconds when connected

      return () => clearInterval(interval);
    }
  }, [address, refetch]);

  // Auto-connect in Base mini-app environment
  useEffect(() => {
    const attemptAutoConnect = async () => {
      if (!isConnected && !connectionAttempted && !isConnecting) {
        setConnectionAttempted(true);
        
        // Check if we're in a mini-app environment with injected wallet
        if (typeof window !== 'undefined' && window.ethereum) {
          try {
            const preferredConnector = getPreferredConnector(connectors);
            if (preferredConnector) {
              console.log('Auto-connecting with preferred connector:', preferredConnector.name);
              await connect({ connector: preferredConnector });
            }
          } catch (error) {
            console.log('Auto-connect failed, user will need to connect manually:', error);
          }
        }
      }
    };

    // Small delay to ensure connectors are initialized
    const timer = setTimeout(attemptAutoConnect, 100);
    return () => clearTimeout(timer);
  }, [isConnected, connectionAttempted, isConnecting, connectors, connect]);

  // Debug logging
  console.log('Nav debug (cached):', {
    userDuckBalance: duckBalance,
    userZapperBalance: zapperBalance,
    userKillCount: zapCount,
    address,
    loading,
    isConnected,
    connector: connector?.name,
    connectError: connectError?.message
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

  const handleConnect = async () => {
    try {
      setConnectionAttempted(true);
      const preferredConnector = getPreferredConnector(connectors);
      
      if (preferredConnector) {
        console.log('Connecting with preferred connector:', preferredConnector.name);
        await connect({ connector: preferredConnector });
      } else if (connectors[0]) {
        console.log('Fallback to first available connector:', connectors[0].name);
        await connect({ connector: connectors[0] });
      }
    } catch (error) {
      console.error('Connection failed:', error);
      // Reset connection attempt flag on failure so user can try again
      setConnectionAttempted(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setConnectionAttempted(false); // Allow reconnection
    } catch (error) {
      console.error('Disconnect failed:', error);
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
              // Not connected - show connect button with loading state
              <div className="flex items-center gap-2">
                <button
                  className="nes-btn is-primary text-xs px-3 py-2"
                  onClick={handleConnect}
                  disabled={isConnecting}
                  type="button"
                >
                  {isConnecting ? 'CONNECTING...' : 'CONNECT'}
                </button>
                
                {connectError && (
                  <div className="text-red-400 text-xs max-w-32 truncate" title={connectError.message}>
                    Connection failed
                  </div>
                )}
              </div>
            ) : (
              // Connected - show balances and disconnect button
              <div className="flex items-center gap-3">
                {/* Connection indicator */}
                <div className="flex items-center text-green-400 text-xs">
                  <span title={`Connected via ${connector?.name}`}>●</span>
                </div>

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
                  onClick={handleDisconnect}
                  type="button"
                  title={`Disconnect ${connector?.name}`}
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
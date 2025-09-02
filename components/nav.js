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

  return (
    <nav className="px-2 nav sticky-top">
      <div className="container-fluid" style={{ marginTop: '0px !important' }}>
        <div className="row align-items-center" style={{ maxHeight: '80px' }}>
          {/* Left Section */}
          <div className="col-6 d-flex align-items-center justify-content-start">
            <img src={logo} alt="Group Image" className="img-fluid m-2" style={{ height: '64px' }} />
          </div>

          {/* Right Section */}
          <div className="col-6 d-flex align-items-center justify-content-end">
            {!isConnected ? (
              // Not connected - show connect button
              <button
                className="nes-btn is-primary"
                onClick={handleConnect}
                type="button"
                style={{ 
                  fontSize: '12px',
                  padding: '8px 12px',
                  minHeight: 'auto'
                }}
              >
                CONNECT
              </button>
            ) : (
              // Connected - show balances and disconnect button
              <div className="d-flex align-items-center gap-3">
                {/* User Balances */}
                <div className="d-flex align-items-center gap-2" style={{ color: '#fff', fontSize: '0.9em' }}>
                  <a 
                    href="#duckmint" 
                    className="d-flex align-items-center text-decoration-none"
                    style={{ color: 'inherit' }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('ducks', 'duckmint');
                    }}
                  >
                    <span style={{ color: '#3BC3FD', fontWeight: 'bold', cursor: 'pointer' }}>🦆</span>
                    <span className="ms-1">{loading ? '...' : (duckBalance || 0)}</span>
                  </a>
                  <a 
                    href="#zappmint" 
                    className="d-flex align-items-center text-decoration-none"
                    style={{ color: 'inherit' }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('zappmint', 'zappmint');
                    }}
                  >
                    <span style={{ color: '#a7df10', fontWeight: 'bold', cursor: 'pointer' }}>⚡</span>
                    <span className="ms-1">{loading ? '...' : (zapperBalance || 0)}</span>
                  </a>
                  <a 
                    href="#burn" 
                    className="d-flex align-items-center text-decoration-none"
                    style={{ color: 'inherit' }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('burn', 'burn');
                    }}
                  >
                    <span style={{ color: '#ff4444', fontWeight: 'bold', cursor: 'pointer' }}>🎯</span>
                    <span className="ms-1" style={{ cursor: 'pointer' }}>{loading ? '...' : (zapCount || 0)}</span>
                  </a>
                </div>

                {/* Disconnect Button */}
                <button
                  className="nes-btn"
                  onClick={() => disconnect()}
                  type="button"
                  style={{ 
                    fontSize: '12px',
                    padding: '4px 8px',
                    minHeight: 'auto'
                  }}
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
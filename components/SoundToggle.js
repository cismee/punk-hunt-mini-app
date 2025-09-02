import React, { useState, useEffect } from 'react';

const SoundToggle = () => {
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Check if audio is enabled on component mount
  useEffect(() => {
    // Check localStorage for saved preference
    const savedPreference = localStorage.getItem('audioEnabled');
    if (savedPreference !== null) {
      const enabled = JSON.parse(savedPreference);
      setSoundEnabled(enabled);
      if (enabled && window.enableAudio) {
        window.enableAudio();
      }
    }
  }, []);

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    
    // Save preference to localStorage
    localStorage.setItem('audioEnabled', JSON.stringify(newState));
    
    if (newState) {
      // Enable audio
      if (window.enableAudio) {
        window.enableAudio();
      }
    } else {
      // Disable audio by setting a flag that SoundController can check
      window.audioEnabled = false;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '120px', // Position below nav (80px) + subnav (~40px)
      left: '20px',
      zIndex: 1030,
      cursor: 'pointer'
    }}>
      <button
        onClick={toggleSound}
        style={{
          background: soundEnabled ? '#97E500' : '#f42a2a',
          border: '3px solid #000',
          color: '#000',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '3px 3px 0 #000'
        }}
        title={soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
        aria-label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>
    </div>
  );
};

export default SoundToggle;
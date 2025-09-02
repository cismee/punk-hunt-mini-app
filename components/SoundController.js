// components/SoundController.js
import { useEffect, useRef } from 'react';

// Remove these direct imports:
// import splashSfx from './sounds/splash.mp3';
// import ducksSfx  from './sounds/ducks.mp3';
// etc.

// Replace with public folder paths:
const SOUND_CONFIG = {
  splash:   { src: '/sounds/splash.mp3', volume: 0.7 },
  ducks:    { src: '/sounds/ducks.mp3',  volume: 0.7 },
  zappmint: { src: '/sounds/zapp.mp3',   volume: 0.7 },
  burn:     { src: '/sounds/ded.mp3',    volume: 0.7 },
  stats:    { src: '/sounds/faq.mp3',  volume: 0.7 },
  faq:      { src: '/sounds/stats.mp3',    volume: 0.7 },
  terms:    { src: '/sounds/terms.mp3',  volume: 0.7 },
  howto:    { src: '/sounds/howto.mp3',  volume: 0.7 },
};

export default function SoundController() {
  const audioCache = useRef(new Map());
  const playedSections = useRef(new Set());
  const isInitialized = useRef(false);
  const audioEnabled = useRef(false);

  // Simple test function
  if (typeof window !== 'undefined') {
    window.testSound = (key) => {
      audioEnabled.current = true;
      playSound(key);
    };

    // Enable audio manually
    window.enableAudio = () => {
      audioEnabled.current = true;
      console.log('Audio enabled - sounds will play on button clicks');
    };

    // Global function to play sounds from components
    window.playButtonSound = (soundKey) => {
      if (audioEnabled.current) {
        playSound(soundKey);
      }
    };
  }

  const getAudio = (key) => {
    if (!audioCache.current.has(key)) {
      const config = SOUND_CONFIG[key];
      if (!config) return null;

      try {
        const audio = new Audio(config.src);
        audio.preload = 'auto';
        audio.volume = config.volume;
        audio.loop = false;
        audioCache.current.set(key, audio);
      } catch (error) {
        console.error(`Failed to load audio for ${key}:`, error);
        return null;
      }
    }
    return audioCache.current.get(key);
  };

  const playSound = async (key) => {
    if (!audioEnabled.current) {
      console.log(`Audio not enabled. Click to enable audio first.`);
      return;
    }

    const audio = getAudio(key);
    if (!audio) return;

    try {
      audio.currentTime = 0;
      await audio.play();
      console.log(`Played: ${key}`);
    } catch (error) {
      console.error(`Failed to play ${key}:`, error);
    }
  };

  // Rest of your SoundController logic...
  const hasPlayedSound = (element, sfx) => {
    const key = `${sfx}_${element.offsetTop}`;
    if (playedSections.current.has(key)) {
      return true;
    }
    playedSections.current.add(key);
    setTimeout(() => {
      playedSections.current.delete(key);
    }, 10000);
    return false;
  };

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    console.log('SoundController: Loading audio files...');
    
    // Preload audio
    Object.keys(SOUND_CONFIG).forEach(key => {
      getAudio(key);
    });

    // Enable audio on any interaction
    const enableOnInteract = () => {
      audioEnabled.current = true;
      console.log('Audio enabled by user interaction');
    };
    
    ['click', 'touchstart', 'keydown'].forEach(event => {
      document.addEventListener(event, enableOnInteract, { once: true });
    });

    return () => {
      audioCache.current.forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioCache.current.clear();
    };
  }, []);

  return null;
}
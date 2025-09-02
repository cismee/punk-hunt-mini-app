// src/SplashOnceAudio.jsx
import { useEffect, useRef } from 'react';
import splashSfx from './sounds/splash.mp3'; // put your file here

export default function SplashOnceAudio() {
  const triedRef = useRef(false); // guard against React StrictMode double effect

  useEffect(() => {
    if (triedRef.current) return;
    triedRef.current = true;

    try {
      const audio = new Audio(splashSfx);
      audio.preload = 'auto';
      audio.playsInline = true;
      audio.loop = false;
      audio.volume = 0.9;

      // Try exactly once. If blocked, swallow and never try again.
      audio.play().catch(() => {
        // Autoplay blocked — per your request, do nothing (forget the sound).
      });
    } catch {
      // If constructing Audio fails, also ignore.
    }
  }, []);

  return null; // no UI
}

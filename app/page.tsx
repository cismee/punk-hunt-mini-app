// app/page.tsx
'use client'

import { useEffect } from 'react'
import { useMiniKit } from '@coinbase/onchainkit/minikit'

// Import your game components (after copying them to components/)
import Splash from '../components/Splash'
import Nav from '../components/nav' 
import SubNav from '../components/subnav' 
import HowToPlay from '../components/HowToPlay'
import Ducks from '../components/Ducks'
import Zapp from '../components/Zapp'
import Ded from '../components/Ded'
import Stats from '../components/Stats'
import Faq from '../components/Faq'
import Terms from '../components/Terms'
import ChatInterface from '../components/ChatInterface'
import SoundController from '../components/SoundController'

export default function HomePage() {
  const { setFrameReady, isFrameReady, context } = useMiniKit()

  // Critical: Signal mini-app is ready
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady()
    }
  }, [setFrameReady, isFrameReady])

  // Log Farcaster user context 
  useEffect(() => {
    if (context?.user) {
      console.log('Farcaster user:', context.user)
    }
  }, [context])

  return (
    <div className="mini-app-container">
      {/* Sound system */}
      <SoundController />
      
      {/* Scrolling ticker */}
      <Nav />
      <SubNav />
      
      {/* Main game sections */}
      <Splash />
      <HowToPlay />
      <Ducks />
      <Zapp />
      <Ded />
      <Stats />
      <Faq />
      <Terms />
      <ChatInterface />
      
      <style jsx global>{`
        /* Mini-app container constraints */
        .mini-app-container {
          width: 100%;
          max-width: 424px;
          margin: 0 auto;
          overflow-x: hidden;
          background: #000;
        }
        
        @media (max-width: 480px) {
          .mini-app-container {
            max-width: 100vw;
          }
        }
        
        /* Touch-friendly controls */
        .btn-nes, .nes-btn {
          min-height: 44px;
          min-width: 44px;
          touch-action: manipulation;
          cursor: pointer;
        }
        
        input.nes-input {
          font-size: 16px; /* Prevent iOS zoom */
          min-height: 44px;
        }
        
        /* Adjust for smaller viewport */
        .container-fluid {
          padding-left: 8px;
          padding-right: 8px;
        }
        
        /* Make text more readable on mobile */
        h1, h2, h3 {
          font-size: 1.2em;
          line-height: 1.3;
        }
        
        @media (max-width: 424px) {
          h1 { font-size: 1.1em; }
          h2 { font-size: 1em; }
          h3 { font-size: 0.9em; }
        }
      `}</style>
    </div>
  )
}
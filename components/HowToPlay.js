// components/HowToPlay.js
import React, { useEffect, useRef, useState } from 'react';

const howtoArt = '/img/firstimg.gif';

export default function HowToPlay() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxH, setMaxH] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef(null);

  // Play sound helper
  const playHowToSound = () => {
    if (typeof window !== 'undefined' && typeof window.testSound === 'function') {
      window.testSound('howto');
    }
  };

  // Open/close with proper animation
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const onTransitionEnd = (e) => {
      if (e.propertyName !== 'max-height') return;
      if (isExpanded) setMaxH('none');
      setIsAnimating(false);
    };

    el.addEventListener('transitionend', onTransitionEnd);
    return () => el.removeEventListener('transitionend', onTransitionEnd);
  }, [isExpanded]);

  const recalc = () => {
    const el = contentRef.current;
    if (!el || !isExpanded) return;
    if (maxH !== 'none') setMaxH(el.scrollHeight);
  };

  const toggle = () => {
    const el = contentRef.current;
    const isOpening = !isExpanded;

    if (isOpening) {
      playHowToSound();
    }

    if (!el) {
      setIsExpanded((v) => !v);
      return;
    }

    if (!isExpanded) {
      setIsAnimating(true);
      setMaxH(el.scrollHeight);
      setIsExpanded(true);
    } else {
      setIsAnimating(true);
      if (maxH === 'none') {
        setMaxH(el.scrollHeight);
        requestAnimationFrame(() => setMaxH(0));
      } else {
        setMaxH(0);
      }
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    const onResize = () => recalc();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isExpanded, maxH]);

  return (
    <section id="how-to-play" className="bg-[#e5e5e5] text-black py-4">
      <div className="w-full px-0">
        {/* Toggle Button */}
        <div className="flex flex-wrap justify-center">
          <div className="w-full text-center">
            <button
              type="button"
              onClick={toggle}
              className="btn-nes bg-white text-black font-bold text-lg uppercase p-3 mb-3 cursor-pointer touch-manipulation"
              style={{
                border: '3px solid #000',
                borderRadius: '0',
                fontFamily: "'Press Start 2P', monospace",
                minHeight: '44px'
              }}
            >
              HOW TO PLAY {isExpanded ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {/* Collapsible content */}
        <div
          ref={contentRef}
          style={{
            maxHeight: maxH === 'none' ? 'none' : maxH,
            overflow: 'hidden',
            transition: isAnimating ? 'max-height 0.45s ease' : 'none',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >

          <div className="items-center justify-center gap-4 lg:gap-8">
            
            {/* Image column: BELOW text on mobile, LEFT on desktop */}
            <div className="w-full lg:w-1/3 text-center mb-2 order-2 lg:order-1">
              <img
                src={howtoArt}
                alt="Pixel zapper, gems, NES and chest"
                className="w-full max-w-xs lg:max-w-full mx-auto px-4 lg:px-8 h-auto"
                onLoad={recalc}
              />
              <div className="py-2"></div>
            </div>

            {/* Text column */}
            <div className="w-full lg:w-1/2 flex order-1 lg:order-2">
              <div className="w-full px-2">

<br />              
                <h1 className="text-black font-bold text-lg sm:text-xl lg:text-2xl mb-4">HOW TO PLAY:</h1>

                <div className="space-y-3 text-sm sm:text-base">
                  <p className="faq">
                    <b className="text-[#f42a2a]">STEP 1:</b>{' '}
                    <a href="#duckmint" className="text-[#3a3afc] underline">
                      Mint A DUCK
                    </a>
                    , Get a Zapper. More Ducks = better survival.
                  </p>
<br />
                  <p className="faq">
                    <b className="text-[#f42a2a]">STEP 2:</b> Out of AMMO?{' '}
                    <a href="#zappmint" className="text-[#3a3afc] underline">
                      Buy More Zappers
                    </a>
                    . Accuracy varies.
                  </p>
<br />
                  <p className="faq">
                    <b className="text-[#f42a2a]">STEP 3:</b> Hunting Szn? Burn Zappers to{' '}
                    <a href="#burn" className="text-[#3a3afc] underline">
                      shoot ducks!
                    </a>{' '}
                    Be wary of friendly fire—it's RNG.
                  </p>
<br />
                  <p className="faq">
                    <b className="text-[#f42a2a]">STEP 4:</b> LAST Duck STANDING wins!
                  </p>
<br />
                  <p className="faq">
                    Track progress on the{' '}
                    <a href="#burn" className="text-[#3a3afc] underline">
                      leaderboard
                    </a>
                    , or watch the chaos unfold in the trollbox.
                  </p>
<br />
                  <p className="text-[#f42a2a] font-bold faq">
                    *Last 3 Ducks and Top Shot receive blue-chip NFTs representing up to 50% of the
                    mint funds.*
                  </p>
<br />
                  <p className="faq">
                    Wanna know more!?{' '}
                    <a 
                      href="#faq" 
                      onClick={(e) => {
                        e.preventDefault();
                        if (window.playButtonSound) {
                          window.playButtonSound('faq');
                        }
                        const element = document.getElementById('faq');
                        if (element) {
                          element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest'
                          });
                        }
                      }}
                      className="text-[#3a3afc] underline"
                    >
                      <b>Read the FAQ.</b>
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS hardening */}
      <style jsx>{`
        #how-to-play, 
        #how-to-play * { 
          box-sizing: border-box; 
        }
        
        #how-to-play img { 
          display: block; 
          max-width: 100%; 
          height: auto; 
        }
        
        .touch-manipulation {
          touch-action: manipulation;
        }
      `}</style>
    </section>
  );
}
import { useEffect, useRef, useState } from 'react';

const TEXT = [
  'PUNK HUNT',
  'MINT DUCKS',
  'BUY ZAPPERS',
  'SHOOT DUCKS',
  'LAST 3 DUCKS STANDING WIN',
  'TOP SHOT WINS',
  'BLUECHIP PRIZES',
].join(' >>>\u00A0') + ' >>>\u00A0';

export default function SubNav() {
  const itemRef = useRef(null);
  const [repeat, setRepeat] = useState(100); // will be recalculated

  useEffect(() => {
    const measure = () => {
      const w = itemRef.current?.offsetWidth || 600;        // width of one message
      const vw = window.innerWidth || 1200;
      const needed = Math.ceil((vw * 2) / w) + 1;           // cover 2× viewport + 1
      setRepeat(needed);
      document.documentElement.style.setProperty('--mq-shift', `${w}px`);
      // tune speed: px/sec -> duration = shift / speed
      const speed = 80; // px/s
      document.documentElement.style.setProperty('--mq-dur', `${w / speed}s`);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <>
      <nav
        className="sticky w-full overflow-hidden"
        style={{ 
          background: '#a7df10', 
          zIndex: 1020,
          height: '40px'
        }}
        aria-label="Ticker"
      >
        {/* Remove container padding so the bar hits the edges */}
        <div className="w-full h-full flex items-center">
          <div className="marquee-container w-full h-full flex items-center overflow-hidden">
            <div className="marquee-track flex items-center whitespace-nowrap animate-scroll">
              {Array.from({ length: repeat }).map((_, i) => (
                <span
                  key={i}
                  ref={i === 0 ? itemRef : null}
                  className="font-bold text-black uppercase text-xs sm:text-sm inline-block"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  {TEXT}
                </span>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* CSS for the scrolling animation */}
      <style jsx>{`
        .marquee-container {
          position: relative;
          overflow: hidden;
        }
        
        .marquee-track {
          display: flex;
          width: max-content;
          animation: scroll var(--mq-dur, 10s) linear infinite;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-1 * var(--mq-shift, 600px)));
          }
        }
        
        .animate-scroll {
          animation: scroll var(--mq-dur, 10s) linear infinite;
        }
        
        /* Ensure text doesn't wrap */
        .marquee-track span {
          flex-shrink: 0;
        }
      `}</style>
    </>
  );
}
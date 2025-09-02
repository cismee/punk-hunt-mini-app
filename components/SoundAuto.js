// src/SoundAuto.jsx
import { useEffect, useMemo, useRef } from 'react';

// TODO: replace these with real files in /src/sounds (or remove keys you don’t use)
import splashSfx from './sounds/splash.mp3';
import ducksSfx  from './sounds/ducks.mp3';
import zappSfx   from './sounds/zapp.mp3';
import dedSfx    from './sounds/ded.mp3';
import statsSfx  from './sounds/stats.mp3';
import faqSfx    from './sounds/faq.mp3';
import termsSfx  from './sounds/terms.mp3';

// Keys -> files (must match data-sfx values or fallback IDs)
const SOUND_FILES = {
  splash:   { src: splashSfx, vol: 1.0 },
  ducks:    { src: ducksSfx,  vol: 1.0 },
  zappmint: { src: zappSfx,   vol: 1.0 },
  burn:     { src: dedSfx,    vol: 1.0 },
  stats:    { src: statsSfx,  vol: 1.0 },
  faq:      { src: faqSfx,    vol: 1.0 },
  terms:    { src: termsSfx,  vol: 1.0 },
};

// Fallback: if you didn’t add data-sfx, we’ll look for these IDs
const KNOWN_IDS = ['splash','ducks','zappmint','burn','stats','faq','terms'];

const DEBUG = false;
const log = (...a) => { if (DEBUG) console.log('[sfx]', ...a); };

export default function SoundAuto() {
  const audios   = useMemo(() => new Map(), []);
  const targets  = useRef([]);   // [{el, key}]
  const lastKey  = useRef(null); // last active key (for enter detection)
  const rafId    = useRef(0);

  // autoplay-unlock
  const pendingKeyRef = useRef(null);
  const unlockBound   = useRef(false);
  const initOnce      = useRef(false);

  // ---------- setup ----------
  const ensureAudio = (key) => {
    const spec = SOUND_FILES[key];
    if (!spec) return null;
    if (audios.has(key)) return audios.get(key);
    try {
      const el = new Audio(spec.src);
      el.loop = false;
      el.preload = 'auto';
      el.playsInline = true;
      el.muted = false;
      el.volume = spec.vol ?? 1.0;
      const obj = { el, vol: el.volume };
      audios.set(key, obj);
      return obj;
    } catch (e) {
      log('create audio failed', key, e);
      return null;
    }
  };

  const collectTargets = () => {
    // 1) opt-in via data-sfx
    const byAttr = Array.from(document.querySelectorAll('[data-sfx]'))
      .map(el => {
        const key = el.getAttribute('data-sfx')?.trim();
        return key ? { el, key } : null;
      })
      .filter(Boolean);

    // 2) fallback via known IDs
    const byId = KNOWN_IDS
      .map(id => {
        const el = document.getElementById(id);
        return el ? { el, key: id } : null;
      })
      .filter(Boolean);

    // de-dup by key, keep first
    const map = new Map();
    [...byAttr, ...byId].forEach(t => {
      if (!map.has(t.key)) map.set(t.key, t);
    });

    targets.current = Array.from(map.values());
    if (DEBUG) log('targets:', targets.current.map(t => t.key));
  };

  // Active area = element whose vertical center contains the viewport center,
  // or the closest by distance if none contain it.
  const getActiveKeyByCenter = () => {
    if (!targets.current.length) return null;
    const centerY = window.innerHeight / 2;
    let active = null, best = Infinity;

    for (const { el, key } of targets.current) {
      const r = el.getBoundingClientRect();
      if (r.height <= 0) continue;

      if (r.top <= centerY && r.bottom >= centerY) return key;
      const d = Math.min(Math.abs(r.top - centerY), Math.abs(r.bottom - centerY));
      if (d < best) { best = d; active = key; }
    }
    return active;
  };

  const evaluateActive = () => {
    const key = getActiveKeyByCenter();
    if (!key) return;
    if (key !== lastKey.current) {
      lastKey.current = key; // ENTER event
      playNow(key);
    }
  };

  const scheduleEvaluate = () => {
    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = 0;
      evaluateActive();
    });
  };

  // ---------- playback / unlock ----------
  const bindUnlockListeners = () => {
    if (unlockBound.current) return;
    unlockBound.current = true;

    const handler = async () => {
      const k = pendingKeyRef.current || getActiveKeyByCenter();
      pendingKeyRef.current = null;
      if (k) {
        const a = ensureAudio(k);
        if (a) { try { a.el.currentTime = 0; await a.el.play(); } catch {} }
      }
      // remove after first unlock
      ['click','pointerdown','pointerup','mousedown','mouseup','touchstart','touchend','keydown']
        .forEach(ev => window.removeEventListener(ev, handler, true));
      unlockBound.current = false;
    };

    ['click','pointerdown','pointerup','mousedown','mouseup','touchstart','touchend','keydown']
      .forEach(ev => window.addEventListener(ev, handler, true));
  };

  const playNow = async (key) => {
    const a = ensureAudio(key);
    if (!a) return;
    try {
      a.el.currentTime = 0;
      await a.el.play();
      log('played', key);
    } catch (err) {
      // Autoplay blocked: queue for immediate unlock on next gesture
      pendingKeyRef.current = key;
      bindUnlockListeners();
      log('queued for unlock', key, err?.name || err);
    }
  };

  // ---------- lifecycle ----------
  useEffect(() => {
    if (initOnce.current) return; // avoid double-init in StrictMode
    initOnce.current = true;

    collectTargets();

    // Warm up audio (optional)
    new Set(targets.current.map(t => t.key)).forEach(k => ensureAudio(k));

    // Try to play the active area on load
    const first = getActiveKeyByCenter();
    if (first) playNow(first);

    // Watch scroll/resize and DOM changes
    window.addEventListener('scroll', scheduleEvaluate, { passive: true });
    const onResize = () => { collectTargets(); scheduleEvaluate(); };
    window.addEventListener('resize', onResize, { passive: true });

    const mo = new MutationObserver(() => { collectTargets(); scheduleEvaluate(); });
    mo.observe(document.body, {
      childList: true, subtree: true, attributes: true, attributeFilter: ['data-sfx', 'id']
    });

    return () => {
      window.removeEventListener('scroll', scheduleEvaluate);
      window.removeEventListener('resize', onResize);
      mo.disconnect();
    };
  }, []);

  return null; // no UI
}

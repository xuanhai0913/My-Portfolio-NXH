import React, { useState, useCallback, useEffect, useRef } from 'react';
import './AudioActivator.css';

const AudioActivator = () => {
  const [activated, setActivated] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const activatedRef = useRef(false);

  const doActivate = useCallback(() => {
    if (activatedRef.current) return;
    activatedRef.current = true;

    // Unlock browser audio context by playing a silent audio
    const silentAudio = new Audio();
    silentAudio.volume = 0;
    silentAudio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
    silentAudio.play().then(() => {
      silentAudio.pause();
    }).catch(() => { });

    // Also try to create/resume AudioContext for broader compatibility
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) { }

    // Dispatch global event so other components know audio is activated
    window.dispatchEvent(new CustomEvent('audioActivated'));

    // Animate out
    setDismissing(true);
    setTimeout(() => {
      setActivated(true);
    }, 600);
  }, []);

  // Also listen for ANY click/touch anywhere on the page as fallback
  // So even if user ignores the overlay and clicks navbar, scrolls, etc.
  // audio will still activate automatically
  useEffect(() => {
    const handleGlobalInteraction = () => {
      doActivate();
    };

    document.addEventListener('click', handleGlobalInteraction, { capture: true, once: true });
    document.addEventListener('touchstart', handleGlobalInteraction, { capture: true, once: true });

    return () => {
      document.removeEventListener('click', handleGlobalInteraction, { capture: true });
      document.removeEventListener('touchstart', handleGlobalInteraction, { capture: true });
    };
  }, [doActivate]);

  if (activated) return null;

  return (
    <div
      className={`audio-activator ${dismissing ? 'dismissing' : ''}`}
      onClick={doActivate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') doActivate(); }}
      aria-label="Click to enable sound"
    >
      <div className="audio-activator-inner">
        <div className="audio-activator-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 11.995C17.0039 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19.07 4.93C20.9447 6.80528 21.9979 9.34836 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="audio-activator-text">
          <span className="audio-activator-label">SOUND</span>
          <span className="audio-activator-hint">CLICK TO ENABLE</span>
        </div>
        <div className="audio-activator-pulse"></div>
      </div>
    </div>
  );
};

export default AudioActivator;

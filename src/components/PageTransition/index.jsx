import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

/**
 * PageTransition — Clip-path reveal animation on route change.
 * Inspired by Active Theory's seamless camera transitions.
 * Uses CSS clip-path circle for a cinematic iris-wipe effect.
 */
const PageTransition = () => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(location);

  const runTransition = useCallback(() => {
    // Phase 1: Cover screen
    setIsTransitioning(true);

    // Phase 2: Reveal after short delay
    const timer = setTimeout(() => {
      setDisplayLocation(location);
      setIsTransitioning(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      runTransition();
    }
  }, [location, displayLocation.pathname, runTransition]);

  return (
    <div
      className={`page-transition-overlay ${isTransitioning ? 'active' : ''}`}
      aria-hidden="true"
    >
      <div className="transition-inner">
        <span className="transition-text">NXH</span>
      </div>
    </div>
  );
};

export default PageTransition;

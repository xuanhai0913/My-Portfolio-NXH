import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import AudioActivator from './components/AudioActivator/AudioActivator';
import ChatWidget from './components/ChatWidget';
import { initSectionTracking, initScrollDepthTracking } from './utils/analytics';
import './App.css';

// Critical above-fold components — load eagerly
import Profile from './components/Profile';
import About from './components/About';
import SectionTransition from './components/SectionTransition';

// Lazy load below-fold heavy components (bundle-dynamic-imports)
const Experience = lazy(() => import('./components/Experience/Experience'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Certifications = lazy(() => import('./components/Certifications'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

// Lazy load optional route pages
const VideoDemo = lazy(() => import('./components/VideoDemo'));
const Hero3D = lazy(() => import('./components/Hero3D'));

// Defer third-party analytics (bundle-defer-third-party)
const SpeedInsights = lazy(() =>
  import('@vercel/speed-insights/react').then(m => ({ default: m.SpeedInsights }))
);
const Analytics = lazy(() =>
  import('@vercel/analytics/react').then(m => ({ default: m.Analytics }))
);

// Hoisted loading fallback (rerender-no-inline-components)
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
  </div>
);

// Section fallback — minimal height to prevent CLS
const SectionFallback = () => (
  <div className="loading-container" style={{ minHeight: '400px' }}>
    <div className="loading-spinner"></div>
  </div>
);

// Hoisted Main Portfolio Page (rerender-no-inline-components)
const MainPortfolio = () => {
  useEffect(() => {
    // Force ScrollTrigger refresh after lazy components mount
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1000);

    // Initialize analytics tracking (analytics-tracking skill)
    const analyticsTimer = setTimeout(() => {
      initSectionTracking();
    }, 2000);
    const cleanupScroll = initScrollDepthTracking();

    return () => {
      clearTimeout(timer);
      clearTimeout(analyticsTimer);
      if (cleanupScroll) cleanupScroll();
    };
  }, []);

  return (
    <>
      {/* Above-fold — loaded eagerly */}
      <ErrorBoundary>
        <Profile />
      </ErrorBoundary>

      <ErrorBoundary>
        <About />
      </ErrorBoundary>

      {/* Below-fold — lazy loaded with Suspense (async-suspense-boundaries) */}
      <ErrorBoundary>
        <SectionTransition text="EXPERIENCE" />
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionFallback />}>
          <Experience />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <SectionTransition text="PROJECTS" />
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionFallback />}>
          <Portfolio />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionFallback />}>
          <Certifications />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionFallback />}>
          <Contact />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<SectionFallback />}>
          <Footer />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

const App = () => {
  const location = useLocation();
  const isAssistantRoute = location.pathname === '/assistant';

  return (
    <div className="app">
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>

      {!isAssistantRoute ? <AudioActivator /> : null}
      {!isAssistantRoute ? <ChatWidget /> : null}

      <Routes>
        <Route path="/" element={<MainPortfolio />} />
        <Route path="/assistant" element={<ChatWidget mode="page" />} />
        <Route path="/videos" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <VideoDemo />
            </Suspense>
          </ErrorBoundary>
        } />
        <Route path="/3d" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Hero3D />
            </Suspense>
          </ErrorBoundary>
        } />
      </Routes>

      {/* Deferred third-party analytics — loads after main content */}
      <Suspense fallback={null}>
        <Analytics debug={false} mode="production" />
        <SpeedInsights />
      </Suspense>
    </div>
  );
};

export default App;
import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
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

// Core sections are loaded eagerly to avoid runtime chunk stalls on production.
import Experience from './components/Experience/Experience';
import Portfolio from './components/Portfolio';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Lazy load optional route pages
const VideoDemo = lazy(() => import('./components/VideoDemo'));
const Hero3D = lazy(() => import('./components/Hero3D'));
const Blog = lazy(() => import('./components/Blog'));

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

      {/* Below-fold core sections — eager render for reliability */}
      <ErrorBoundary>
        <SectionTransition text="EXPERIENCE" />
      </ErrorBoundary>

      <ErrorBoundary>
        <Experience />
      </ErrorBoundary>

      <ErrorBoundary>
        <SectionTransition text="PROJECTS" />
      </ErrorBoundary>

      <ErrorBoundary>
        <Portfolio />
      </ErrorBoundary>

      <ErrorBoundary>
        <Certifications />
      </ErrorBoundary>

      <ErrorBoundary>
        <Contact />
      </ErrorBoundary>

      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </>
  );
};

const App = () => {
  const location = useLocation();
  const isAssistantRoute = location.pathname === '/assistant';

  return (
    <div className="app">
      {/* Skip to content — WCAG 2.4.1 */}
      <a href="#profile" className="skip-link">Skip to main content</a>

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
        <Route path="/blog" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Blog />
            </Suspense>
          </ErrorBoundary>
        } />
        {/* Redirect /home and /Home to root — fix Google indexing ghost page */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/Home" element={<Navigate to="/" replace />} />
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
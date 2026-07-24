import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import PageTransition from './components/PageTransition';
import AudioActivator from './components/AudioActivator/AudioActivator';
import ChatWidget from './components/ChatWidget';
import { initSectionTracking, initScrollDepthTracking } from './utils/analytics';
import useParallax from './hooks/useParallax';
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
const Tools = lazy(() => import('./pages/Tools'));
const ToolWorkspace = lazy(() => import('./pages/Tools/Workspace'));

// Defer third-party analytics (bundle-defer-third-party)
const SpeedInsights = lazy(() =>
  import('@vercel/speed-insights/react').then(m => ({ default: m.SpeedInsights }))
);
const Analytics = lazy(() =>
  import('@vercel/analytics/react').then(m => ({ default: m.Analytics }))
);

// Hoisted loading fallback (rerender-no-inline-components)
const LoadingFallback = () => {
  const { t } = useTranslation();

  return (
    <div className="loading-container" role="status" aria-label={t('common.loading')}>
      <div className="loading-spinner"></div>
    </div>
  );
};

// Hoisted Main Portfolio Page (rerender-no-inline-components)
const MainPortfolio = () => {
  const { t } = useTranslation();

  // Active Theory-inspired parallax depth layers
  useParallax();

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
        <SectionTransition text={t('sections.experience')} />
      </ErrorBoundary>

      <ErrorBoundary>
        <Experience />
      </ErrorBoundary>

      <ErrorBoundary>
        <SectionTransition text={t('sections.projects')} />
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

const routePath = (prefix, path) => {
  if (path === '/') return prefix || '/';
  return `${prefix}${path}`;
};

const renderLocalizedRoutes = (prefix) => (
  <React.Fragment key={prefix || 'en'}>
    <Route path={routePath(prefix, '/')} element={<MainPortfolio />} />
    <Route path={routePath(prefix, '/assistant')} element={<ChatWidget mode="page" />} />
    <Route path={routePath(prefix, '/videos')} element={(
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <VideoDemo />
        </Suspense>
      </ErrorBoundary>
    )} />
    <Route path={routePath(prefix, '/tools')} element={(
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Tools />
        </Suspense>
      </ErrorBoundary>
    )} />
    <Route path={routePath(prefix, '/tools/:slug')} element={(
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <ToolWorkspace />
        </Suspense>
      </ErrorBoundary>
    )} />
    <Route path={routePath(prefix, '/3d')} element={(
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Hero3D />
        </Suspense>
      </ErrorBoundary>
    )} />
    <Route path={routePath(prefix, '/blog')} element={(
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Blog />
        </Suspense>
      </ErrorBoundary>
    )} />
    <Route path={routePath(prefix, '/home')} element={<Navigate to={prefix || '/'} replace />} />
    <Route path={routePath(prefix, '/Home')} element={<Navigate to={prefix || '/'} replace />} />
  </React.Fragment>
);

const App = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isAssistantRoute = /^(\/vi)?\/assistant\/?$/.test(location.pathname);

  useEffect(() => {
    const urlLanguage = /^\/vi(?:\/|$)/.test(location.pathname) ? 'vi' : 'en';
    if (i18n.resolvedLanguage !== urlLanguage) {
      void i18n.changeLanguage(urlLanguage);
    }
  }, [i18n, location.pathname]);

  return (
    <SmoothScroll>
      <CustomCursor />
      <div className="app">
        {/* Page transition iris-wipe overlay */}
        <PageTransition />
        
        {/* Procedural 3D Background - DISABLED to prevent huge composite lag
        <BackgroundWaves /> */}

        {/* Skip to content — WCAG 2.4.1 */}
        <a href="#profile" className="skip-link">{t('common.skipToContent')}</a>

        <ErrorBoundary>
          <Header />
        </ErrorBoundary>

        {!isAssistantRoute ? <AudioActivator /> : null}
        {!isAssistantRoute ? <ChatWidget /> : null}

        <Routes>
          {renderLocalizedRoutes('')}
          {renderLocalizedRoutes('/vi')}
        </Routes>

        {/* Deferred third-party analytics — loads after main content */}
        <Suspense fallback={null}>
          <Analytics debug={false} mode="production" />
          <SpeedInsights />
        </Suspense>
      </div>
    </SmoothScroll>
  );
};

export default App;

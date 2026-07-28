import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import PageTransition from './components/PageTransition';
import { initSectionTracking, initScrollDepthTracking } from './utils/analytics';
import { updateMetaTags } from './utils/metaTags';
import './App.css';

// Critical above-fold components — load eagerly
import Profile from './components/Profile';
import About from './components/About';
import SectionTransition from './components/SectionTransition';

// Below-fold sections stay out of the critical bundle.
const Experience = lazy(() => import('./components/Experience/Experience'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Certifications = lazy(() => import('./components/Certifications'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const ChatWidget = lazy(() => import('./components/ChatWidget'));

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
const isProduction = process.env.NODE_ENV === 'production';

// Hoisted loading fallback (rerender-no-inline-components)
const LoadingFallback = () => {
  const { t } = useTranslation();

  return (
    <div className="loading-container" role="status" aria-label={t('common.loading')}>
      <div className="loading-spinner"></div>
    </div>
  );
};

const SectionFallback = () => (
  <div className="section-loading-placeholder" aria-hidden="true" />
);

const DeferredSection = ({
  children,
  anchorId,
  minHeight = 480,
  rootMargin = '500px 0px'
}) => {
  const containerRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender || !containerRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <div
      ref={containerRef}
      style={shouldRender ? undefined : { minHeight }}
      aria-busy={!shouldRender}
    >
      {!shouldRender && anchorId ? (
        <span id={anchorId} className="deferred-section-anchor" aria-hidden="true" />
      ) : null}
      {shouldRender ? children : null}
    </div>
  );
};

const ChatSurface = ({ mode }) => (
  <Suspense fallback={null}>
    <ChatWidget mode={mode} />
  </Suspense>
);

// Hoisted Main Portfolio Page (rerender-no-inline-components)
const MainPortfolio = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Initialize analytics tracking (analytics-tracking skill)
    const analyticsTimer = setTimeout(() => {
      initSectionTracking();
    }, 2000);
    const cleanupScroll = initScrollDepthTracking();

    return () => {
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

      {/* Below-fold core sections */}
      <ErrorBoundary>
        <SectionTransition text={t('sections.experience')} />
      </ErrorBoundary>

      <ErrorBoundary>
        <DeferredSection anchorId="experience" minHeight={900}>
          <Suspense fallback={<SectionFallback />}>
            <Experience />
          </Suspense>
        </DeferredSection>
      </ErrorBoundary>

      <ErrorBoundary>
        <SectionTransition text={t('sections.projects')} />
      </ErrorBoundary>

      <ErrorBoundary>
        <DeferredSection anchorId="portfolio" minHeight={900}>
          <Suspense fallback={<SectionFallback />}>
            <Portfolio />
          </Suspense>
        </DeferredSection>
      </ErrorBoundary>

      <ErrorBoundary>
        <DeferredSection anchorId="certifications" minHeight={700}>
          <Suspense fallback={<SectionFallback />}>
            <Certifications />
          </Suspense>
        </DeferredSection>
      </ErrorBoundary>

      <ErrorBoundary>
        <DeferredSection anchorId="contact" minHeight={640}>
          <Suspense fallback={<SectionFallback />}>
            <Contact />
          </Suspense>
        </DeferredSection>
      </ErrorBoundary>

      <ErrorBoundary>
        <DeferredSection minHeight={240}>
          <Suspense fallback={<SectionFallback />}>
            <Footer />
          </Suspense>
        </DeferredSection>
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
    <Route path={routePath(prefix, '/assistant')} element={<ChatSurface mode="page" />} />
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
    document.documentElement.lang = urlLanguage;
    if (i18n.resolvedLanguage !== urlLanguage) {
      void i18n.changeLanguage(urlLanguage);
    }
  }, [i18n, location.pathname]);

  useEffect(() => {
    updateMetaTags(location.pathname);
  }, [i18n.resolvedLanguage, location.pathname]);

  return (
    <div className="app">
      <PageTransition />

      <a href="#main-content" className="skip-link">{t('common.skipToContent')}</a>

      <ErrorBoundary>
        <Header />
      </ErrorBoundary>

      {!isAssistantRoute ? <ChatSurface /> : null}

      <main id="main-content">
        <Routes>
          {renderLocalizedRoutes('')}
          {renderLocalizedRoutes('/vi')}
        </Routes>
      </main>

      {isProduction ? (
        <Suspense fallback={null}>
          <Analytics debug={false} mode="production" />
          <SpeedInsights />
        </Suspense>
      ) : null}
    </div>
  );
};

export default App;

import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import PageTransition from './components/PageTransition';
import ChatWidget from './components/ChatWidget';
import Header from './components/Header';
import ImmersiveHome from './components/ImmersiveHome';
import './App.css';

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

const App = () => {
  const location = useLocation();
  const isAssistantRoute = location.pathname === '/assistant';
  const isHomeRoute = location.pathname === '/';

  return (
    <div className={isHomeRoute ? 'app app-immersive' : 'app'}>
      {!isHomeRoute ? <PageTransition /> : null}

      {!isHomeRoute ? (
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
      ) : null}

      {!isAssistantRoute && !isHomeRoute ? <ChatWidget /> : null}

      <Routes>
        <Route path="/" element={<ImmersiveHome />} />
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
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/Home" element={<Navigate to="/" replace />} />
      </Routes>

      <Suspense fallback={null}>
        <Analytics debug={false} mode="production" />
        <SpeedInsights />
      </Suspense>
    </div>
  );
};

export default App;
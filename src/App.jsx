import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import './App.css';

// Lazy load non-critical components
const Profile = lazy(() => import('./components/Profile'));
const About = lazy(() => import('./components/About'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Certifications = lazy(() => import('./components/Certifications'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const VideoDemo = lazy(() => import('./components/VideoDemo'));

// Loading fallback
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
  </div>
);

// Main Portfolio Page Component
const MainPortfolio = () => (
  <>
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Profile />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <About />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Portfolio />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Certifications />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Contact />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Footer />
      </Suspense>
    </ErrorBoundary>
  </>
);

const App = () => {
  console.log('🚀 App component is rendering...');

  return (
    <div className="app">
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>

      <Routes>
        <Route path="/" element={<MainPortfolio />} />
        <Route path="/videos" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <VideoDemo />
            </Suspense>
          </ErrorBoundary>
        } />
      </Routes>

      <Analytics debug={false} mode="production" />
      <SpeedInsights />
    </div>
  );
};

export default App;
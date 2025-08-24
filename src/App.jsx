import React, { lazy, Suspense, useEffect } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import SocialShare from './components/SocialShare';
import { initializeMetaTags } from './utils/metaTags';
import { useMetaTags } from './hooks/useMetaTags';
import './App.css';

// Lazy load non-critical components
const Profile = lazy(() => import('./components/Profile'));
const About = lazy(() => import('./components/About'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Contact = lazy(() => import('./components/Contact'));

// Loading fallback
const LoadingFallback = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
  </div>
);

const App = () => {
  console.log('🚀 App component is rendering...');
  
  // Initialize meta tags for the homepage
  useMetaTags('home');
  
  // Initialize meta tags on app start
  useEffect(() => {
    initializeMetaTags();
  }, []);
  
  return (
    <div className="app">
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      
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
          <Contact />
        </Suspense>
      </ErrorBoundary>
      
      {/* Social Share Component */}
      <ErrorBoundary>
        <section className="social-share-section">
          <div className="container">
            <SocialShare 
              pageName="home" 
              showText={true} 
              size="medium" 
            />
          </div>
        </section>
      </ErrorBoundary>
      
      <Analytics debug={false} mode="production" />
      <SpeedInsights />
    </div>
  );
};

export default App;
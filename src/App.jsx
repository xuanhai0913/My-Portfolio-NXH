import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import './App.css';

// Lazy load non-critical components
import Profile from './components/Profile';
import About from './components/About';
import Experience from './components/Experience/Experience';
import SectionTransition from './components/SectionTransition';
import Portfolio from './components/Portfolio';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Lazy load actual heavy/optional pages only
const VideoDemo = lazy(() => import('./components/VideoDemo'));
const Hero3D = lazy(() => import('./components/Hero3D'));

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
      <Profile />
    </ErrorBoundary>

    <ErrorBoundary>
      <About />
    </ErrorBoundary>

    {/* Section Transition - About to Experience */}
    <ErrorBoundary>
      <SectionTransition text="EXPERIENCE" videoSrc="/Neon_History_Optimized.mp4" />
    </ErrorBoundary>

    <ErrorBoundary>
      <Experience />
    </ErrorBoundary>

    {/* Section Transition - Experience to Projects */}
    <ErrorBoundary>
      <SectionTransition text="PROJECTS" videoSrc="/Neon_Projects_Optimized.mp4" />
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

const App = () => {

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
        <Route path="/3d" element={
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Hero3D />
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
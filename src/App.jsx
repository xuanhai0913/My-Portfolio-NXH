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
const Experience = lazy(() => import('./components/Experience/Experience'));
const SectionTransition = lazy(() => import('./components/SectionTransition'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Certifications = lazy(() => import('./components/Certifications'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
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
      <Suspense fallback={<LoadingFallback />}>
        <Profile />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <About />
      </Suspense>
    </ErrorBoundary>

    {/* Section Transition - About to Experience */}
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <SectionTransition text="EXPERIENCE" videoSrc="/Nhan_Gai_Optimized.mp4" />
      </Suspense>
    </ErrorBoundary>

    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <Experience />
      </Suspense>
    </ErrorBoundary>

    {/* Section Transition - Experience to Projects */}
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <SectionTransition text="PROJECTS" videoSrc="/Neon_Projects_Optimized.mp4" />
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
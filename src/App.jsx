import React from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import Header from './components/Header';
import Profile from './components/Profile';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Header />
      <Profile />
      <About />
      <Portfolio />
      <Contact />
      <Analytics debug={true} mode="production" />
      <SpeedInsights />
    </div>
  );
};

export default App;
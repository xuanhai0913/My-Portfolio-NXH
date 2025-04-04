import React, { useEffect } from 'react';
import Header from './components/Header';
import About from './components/About';
import Profile from './components/Profile';
import Contact from './components/Contact';
import Portfolio from './components/Portfolio';
import Separator from './components/Separator';
import './App.css';

function App() {
  useEffect(() => {
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Header />
      <main className="main-content">
        <Profile />
        <About />
        <Portfolio />
        <Separator />
        <Contact />
      </main>
    </div>
  );
}

export default App;
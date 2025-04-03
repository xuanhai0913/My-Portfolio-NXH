import React, { useState } from 'react';
import Waves from '../Waves';
import './styles/Header.css';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <header className="header">
      <div className="header-overlay"></div>
      <Waves
        lineColor="#fff"
        backgroundColor="rgba(75, 65, 65, 0.31)"
        waveSpeedX={0.02}
        waveSpeedY={0.01}
        waveAmpX={40}
        waveAmpY={20}
        friction={0.9}
        tension={0.01}
        maxCursorMove={120}
        xGap={12}
        yGap={36}
      />
      <div className="nav-container">
        <div className="logo-container">
          <a href="#welcome-section" className="logo-link">
            <i className="fas fa-code logo-icon"></i>
            <span className="logo-text">NGUYEN XUAN HAI</span>
          </a>
        </div>

        <button className="nav-toggle" onClick={toggleNav} aria-label="Toggle navigation">
          <span className="hamburger"></span>
        </button>

        <nav className={`nav ${isNavOpen ? 'nav-open' : ''}`}>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#profile">Profile</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
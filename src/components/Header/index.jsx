import React, { useState } from 'react';
import Waves from '../Waves';
import './styles/Header.css';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
    // Prevent body scroll when nav is open
    document.body.style.overflow = !isNavOpen ? 'hidden' : 'auto';
  };

  const closeNav = () => {
    setIsNavOpen(false);
    document.body.style.overflow = 'auto';
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
          <a href="#welcome-section" className="logo-link" onClick={closeNav}>
            <i className="fas fa-code logo-icon"></i>
            <span className="logo-text">NGUYEN XUAN HAI</span>
          </a>
        </div>

        <button 
          className={`nav-toggle ${isNavOpen ? 'active' : ''}`} 
          onClick={toggleNav} 
          aria-label="Toggle navigation"
        >
          <span className="hamburger"></span>
        </button>

        <nav className={`nav ${isNavOpen ? 'nav-open' : ''}`}>
          <ul className="nav-links">
            {['home', 'about', 'profile', 'contact'].map((item) => (
              <li key={item}>
                <a href={`#${item}`} onClick={closeNav}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
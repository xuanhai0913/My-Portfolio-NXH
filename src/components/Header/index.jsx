import React, { useState } from 'react';
import './styles/Header.css';

// Logo from Cloudinary CDN (full logo with text)
const logoFull = 'https://res.cloudinary.com/dqdcqtu8m/image/upload/v1765001214/Logo_st3nmr.png';

const Header = () => {
  console.log('📋 Header component is rendering...');
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
    document.body.style.overflow = !isNavOpen ? 'hidden' : 'auto';
  };

  const closeNav = () => {
    setIsNavOpen(false);
    document.body.style.overflow = 'auto';
  };

  const navItems = [
    { id: 'home', label: 'Home', href: '#profile' },
    { id: 'about', label: 'About', href: '#about' },
    { id: 'portfolio', label: 'Portfolio', href: '#portfolio' },
    { id: 'certifications', label: 'Certifications', href: '#certifications' },
    { id: 'contact', label: 'Contact', href: '#contact' }
  ];

  return (
    <header className="header">
      <div className="header-overlay"></div>
      <div className="nav-container">
        <div className="logo-container">
          <a href="#profile" className="logo-link" onClick={closeNav}>
            <img src={logoFull} alt="HaiLam Dev" className="logo-full" />
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
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={item.href} onClick={closeNav}>
                  {item.label}
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
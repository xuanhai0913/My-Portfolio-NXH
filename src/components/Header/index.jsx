import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/Header.css';

// Logo from Cloudinary CDN (full logo with text)
const logoFull = 'https://res.cloudinary.com/dqdcqtu8m/image/upload/v1765001214/Logo_st3nmr.png';

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    { id: 'videos', label: 'Videos', href: '/videos', isRoute: true },
    { id: 'blog', label: 'Blog', href: '/blog', isRoute: true },
    { id: 'contact', label: 'Contact', href: '#contact' }
  ];

  // Check if we're on a sub-route page (not main portfolio)
  const isSubRoute = location.pathname !== '/';

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header-overlay"></div>
      <div className="nav-container">
        <div className="logo-container">
          <Link to="/" className="logo-link" onClick={closeNav}>
            <img src={logoFull} alt="HaiLam Dev" className="logo-full" />
          </Link>
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
                {item.isRoute ? (
                  <Link
                    to={item.href}
                    onClick={closeNav}
                    className={location.pathname === item.href ? 'active' : ''}
                  >
                    {item.label}
                  </Link>
                ) : isSubRoute ? (
                  <Link
                    to={`/${item.href}`}
                    onClick={closeNav}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} onClick={closeNav}>
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
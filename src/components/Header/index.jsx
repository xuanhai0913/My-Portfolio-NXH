import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useLocaleNavigation from '../../hooks/useLocaleNavigation';
import './styles/Header.css';

// Logo from Cloudinary CDN (full logo with text)
const logoFull = 'https://res.cloudinary.com/dqdcqtu8m/image/upload/v1765001214/Logo_st3nmr.png';

const Header = () => {
  const { t } = useTranslation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();
  const { locale, localizePath, changeLocale } = useLocaleNavigation();
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);
  const rafRef = useRef(null);

  const onScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      const isScrolled = window.scrollY > 60;
      if (isScrolled !== scrolledRef.current) {
        scrolledRef.current = isScrolled;
        setScrolled(isScrolled);
      }
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.style.overflow = 'auto';
    };
  }, [onScroll]);

  const toggleNav = () => {
    setIsNavOpen((wasOpen) => {
      document.body.style.overflow = wasOpen ? 'auto' : 'hidden';
      return !wasOpen;
    });
  };

  const closeNav = () => {
    setIsNavOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleLocaleChange = (targetLocale) => {
    closeNav();
    changeLocale(targetLocale);
  };

  const navItems = [
    { id: 'home', label: t('header.home', { defaultValue: 'Home' }), href: '#profile' },
    { id: 'about', label: t('header.about', { defaultValue: 'About' }), href: '#about' },
    { id: 'portfolio', label: t('header.portfolio', { defaultValue: 'Portfolio' }), href: '#portfolio' },
    { id: 'certifications', label: t('header.certifications', { defaultValue: 'Certifications' }), href: '#certifications' },
    { id: 'tools', label: t('header.tools', { defaultValue: 'Tools' }), href: '/tools', isRoute: true },
    { id: 'blog', label: t('header.blog', { defaultValue: 'Blog' }), href: '/blog', isRoute: true },
    { id: 'contact', label: t('header.contact', { defaultValue: 'Contact' }), href: '#contact' }
  ];

  const localizedRoot = localizePath('/');
  const isSubRoute = location.pathname !== localizedRoot;

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header-overlay"></div>
      <div className="nav-container">
        <div className="logo-container">
          <Link to={localizedRoot} className="logo-link" onClick={closeNav}>
            <img src={logoFull} alt="HaiLam Dev" className="logo-full" />
          </Link>
        </div>

        <nav id="primary-navigation" className={`nav ${isNavOpen ? 'nav-open' : ''}`}>
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.id}>
                {item.isRoute ? (
                  <Link
                    to={localizePath(item.href)}
                    onClick={closeNav}
                    className={location.pathname === localizePath(item.href) ? 'active' : ''}
                  >
                    {item.label}
                  </Link>
                ) : isSubRoute ? (
                  <Link
                    to={`${localizedRoot}${item.href}`}
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

        <div className="header-actions">
          <div
            className="language-switcher"
            role="group"
            aria-label={t('header.languageSwitcher', { defaultValue: 'Select language' })}
          >
            <button
              type="button"
              className={locale === 'en' ? 'active' : ''}
              onClick={() => handleLocaleChange('en')}
              aria-pressed={locale === 'en'}
              aria-label={t('header.english', { defaultValue: 'English' })}
            >
              EN
            </button>
            <span aria-hidden="true">|</span>
            <button
              type="button"
              className={locale === 'vi' ? 'active' : ''}
              onClick={() => handleLocaleChange('vi')}
              aria-pressed={locale === 'vi'}
              aria-label={t('header.vietnamese', { defaultValue: 'Vietnamese' })}
            >
              VI
            </button>
          </div>

          <button
            className={`nav-toggle ${isNavOpen ? 'active' : ''}`}
            onClick={toggleNav}
            aria-label={t('header.toggleNavigation', { defaultValue: 'Toggle navigation' })}
            aria-expanded={isNavOpen}
            aria-controls="primary-navigation"
          >
            <span className="hamburger"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

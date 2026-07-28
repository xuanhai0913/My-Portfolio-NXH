import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useLocaleNavigation from '../../hooks/useLocaleNavigation';
import './styles/Header.css';

const ICON_PATHS = {
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /><path d="M9 20v-6h6v6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  portfolio: <><path d="m12 3-9 5 9 5 9-5-9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 16 9 5 9-5" /></>,
  certifications: <><circle cx="12" cy="9" r="6" /><path d="m8 14-1 7 5-3 5 3-1-7" /><path d="m12 6 1 2 2 .5-1.5 1.5.5 2-2-1-2 1 .5-2L9 8.5l2-.5 1-2Z" /></>,
  tools: <><path d="M14.5 6.5a4 4 0 0 0-5-5L12 4 9 7 6.5 4.5a4 4 0 0 0 5 5L20 18l-2 2-8.5-8.5" /><path d="m5 15-3 3 4 4 3-3" /></>,
  blog: <><path d="M4 20h4L20 8l-4-4L4 16v4Z" /><path d="m14 6 4 4" /></>,
  contact: <><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="m22 2-11 11" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>
};

const HeaderIcon = ({ name }) => (
  <svg
    className="header-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {ICON_PATHS[name]}
  </svg>
);

const Header = () => {
  const { t } = useTranslation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();
  const { locale, localizePath, changeLocale } = useLocaleNavigation();
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);
  const rafRef = useRef(null);

  const closeNav = useCallback(() => {
    setIsNavOpen(false);
    document.body.style.overflow = 'auto';
  }, []);

  const toggleNav = useCallback(() => {
    setIsNavOpen((wasOpen) => {
      document.body.style.overflow = wasOpen ? 'auto' : 'hidden';
      return !wasOpen;
    });
  }, []);

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

  useEffect(() => {
    closeNav();
  }, [closeNav, location.pathname]);

  useEffect(() => {
    if (!isNavOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') closeNav();
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [closeNav, isNavOpen]);

  const handleLocaleChange = () => {
    closeNav();
    changeLocale(locale === 'en' ? 'vi' : 'en');
  };

  const navItems = [
    { id: 'home', icon: 'home', label: t('header.home', { defaultValue: 'Home' }), href: '#profile' },
    { id: 'about', icon: 'user', label: t('header.about', { defaultValue: 'About' }), href: '#about' },
    { id: 'portfolio', icon: 'portfolio', label: t('header.portfolio', { defaultValue: 'Portfolio' }), href: '#portfolio' },
    { id: 'certifications', icon: 'certifications', label: t('header.certifications', { defaultValue: 'Certifications' }), href: '#certifications' },
    { id: 'tools', icon: 'tools', label: t('header.tools', { defaultValue: 'Tools' }), href: '/tools', isRoute: true },
    { id: 'blog', icon: 'blog', label: t('header.blog', { defaultValue: 'Blog' }), href: '/blog', isRoute: true },
    { id: 'contact', icon: 'contact', label: t('header.contact', { defaultValue: 'Contact' }), href: '#contact' }
  ];

  const localizedRoot = localizePath('/');
  const isSubRoute = location.pathname !== localizedRoot;

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''} ${isNavOpen ? 'header--open' : ''}`}>
      <button
        type="button"
        className="header-overlay"
        onClick={closeNav}
        aria-label={t('header.closeNavigation', { defaultValue: 'Close navigation' })}
        tabIndex={isNavOpen ? 0 : -1}
      />
      <div className="nav-container">
        <div className="logo-container">
          <Link
            to={localizedRoot}
            className="logo-link"
            onClick={closeNav}
            aria-label={`NXH — ${t('header.home', { defaultValue: 'Home' })}`}
          >
            <span className="logo-mark" aria-hidden="true">NXH</span>
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
                    aria-label={item.label}
                    data-tooltip={item.label}
                  >
                    <HeaderIcon name={item.icon} />
                    <span className="nav-label">{item.label}</span>
                  </Link>
                ) : isSubRoute ? (
                  <Link
                    to={`${localizedRoot}${item.href}`}
                    onClick={closeNav}
                    aria-label={item.label}
                    data-tooltip={item.label}
                  >
                    <HeaderIcon name={item.icon} />
                    <span className="nav-label">{item.label}</span>
                  </Link>
                ) : (
                  <a href={item.href} onClick={closeNav} aria-label={item.label} data-tooltip={item.label}>
                    <HeaderIcon name={item.icon} />
                    <span className="nav-label">{item.label}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="language-toggle"
            onClick={handleLocaleChange}
            aria-label={`${locale.toUpperCase()} — ${locale === 'en'
              ? t('header.switchToVietnamese', { defaultValue: 'Switch to Vietnamese' })
              : t('header.switchToEnglish', { defaultValue: 'Switch to English' })}`}
            title={locale === 'en'
              ? t('header.switchToVietnamese', { defaultValue: 'Switch to Vietnamese' })
              : t('header.switchToEnglish', { defaultValue: 'Switch to English' })}
          >
            <HeaderIcon name="globe" />
            <span translate="no">{locale.toUpperCase()}</span>
          </button>

          <button
            type="button"
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

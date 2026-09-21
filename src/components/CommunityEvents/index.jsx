import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import enCommunity from '../../i18n/locales/en/community.json';
import viCommunity from '../../i18n/locales/vi/community.json';
import aiRiserVietnam from '../../images/community/ai-riser-vietnam-2026.webp';
import echEnglishCommunity from '../../images/community/ech-english-community.webp';
import j2teamCommunity from '../../images/community/j2team-community.webp';
import './styles/CommunityEvents.css';

i18n.addResourceBundle('en', 'community', enCommunity, true, true);
i18n.addResourceBundle('vi', 'community', viCommunity, true, true);

const communityMoments = [
  {
    id: 'aiRiser',
    image: aiRiserVietnam,
    objectPosition: 'center center',
    featured: true,
  },
  {
    id: 'ech',
    image: echEnglishCommunity,
    objectPosition: 'center center',
  },
  {
    id: 'j2team',
    image: j2teamCommunity,
    objectPosition: 'center center',
  },
];

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

const FrameIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 9V5h4M15 5h4v4M19 15v4h-4M9 19H5v-4" />
  </svg>
);

const ChevronIcon = ({ direction }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={direction === 'previous' ? 'm15 5-7 7 7 7' : 'm9 5 7 7-7 7'} />
  </svg>
);

const getAdjacentMomentId = (currentId, direction) => {
  const currentIndex = communityMoments.findIndex((moment) => moment.id === currentId);
  const safeIndex = currentIndex < 0 ? 0 : currentIndex;
  const nextIndex = (safeIndex + direction + communityMoments.length) % communityMoments.length;
  return communityMoments[nextIndex].id;
};

const CommunityEvents = () => {
  const { t } = useTranslation('community');
  const [activeMomentId, setActiveMomentId] = useState(null);
  const closeButtonRef = useRef(null);
  const viewerRef = useRef(null);
  const previousActiveElementRef = useRef(null);
  const touchStartXRef = useRef(null);
  const modalTitleId = useId();
  const modalDescriptionId = useId();
  const activeMoment = communityMoments.find((moment) => moment.id === activeMomentId) || null;
  const activeMomentIndex = activeMoment
    ? communityMoments.findIndex((moment) => moment.id === activeMoment.id)
    : -1;
  const isViewerOpen = activeMomentId !== null;

  useEffect(() => {
    if (!isViewerOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    previousActiveElementRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveMomentId(null);
        return;
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const direction = event.key === 'ArrowLeft' ? -1 : 1;
        setActiveMomentId((currentId) => getAdjacentMomentId(currentId, direction));
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = viewerRef.current?.querySelectorAll('button:not([disabled])');
      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      previousActiveElementRef.current?.focus?.();
    };
  }, [isViewerOpen]);

  const closeViewer = () => setActiveMomentId(null);
  const showPreviousMoment = () => {
    setActiveMomentId((currentId) => getAdjacentMomentId(currentId, -1));
  };
  const showNextMoment = () => {
    setActiveMomentId((currentId) => getAdjacentMomentId(currentId, 1));
  };

  const handleTouchStart = (event) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartXRef.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const distance = endX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(distance) < 48) return;
    if (distance > 0) showPreviousMoment();
    else showNextMoment();
  };

  return (
    <section id="community" className="community-events-section" aria-labelledby="community-events-title">
      <div className="community-events-noise" aria-hidden="true" />
      <div className="community-events-container">
        <header className="community-events-header">
          <div>
            <p className="community-events-eyebrow">{t('eyebrow')}</p>
            <h2 id="community-events-title">{t('title')}</h2>
          </div>
          <div className="community-events-intro-wrap">
            <p className="community-events-intro">{t('intro')}</p>
            <p className="community-events-count" aria-label={t('countAria', { count: communityMoments.length })}>
              <span>{String(communityMoments.length).padStart(2, '0')}</span>
              <span>{t('countLabel')}</span>
            </p>
          </div>
        </header>

        <article className="community-certificate" aria-labelledby="community-certificate-title">
          <a className="community-certificate__image" href="/images/community-ai-riser-certificate.png" target="_blank" rel="noopener noreferrer" aria-label={t('certificate.view')}>
            <img src="/images/community-ai-riser-certificate.png" alt={t('certificate.alt')} width="1494" height="1052" loading="lazy" decoding="async" />
          </a>
          <div className="community-certificate__copy">
            <p className="community-events-eyebrow">AI RISER VIETNAM 2026</p>
            <h3 id="community-certificate-title">{t('certificate.title')}</h3>
            <p>{t('certificate.description')}</p>
            <div className="community-certificate__actions">
              <a href="/images/community-ai-riser-certificate.png" target="_blank" rel="noopener noreferrer">{t('certificate.view')}</a>
              <button type="button" onClick={() => setActiveMomentId('aiRiser')} aria-haspopup="dialog">{t('certificate.photos')}</button>
            </div>
            <small>{t('certificate.note')}</small>
          </div>
        </article>

        <div className="community-events-grid" role="group" aria-label={t('galleryAria')}>
          {communityMoments.map((moment, index) => {
            const title = t(`items.${moment.id}.title`);
            const kind = t(`items.${moment.id}.kind`);
            const description = t(`items.${moment.id}.description`);
            const sequence = String(index + 1).padStart(2, '0');

            return (
              <button
                key={moment.id}
                type="button"
                className={`community-event-card ${moment.featured ? 'community-event-card--featured' : ''}`}
                onClick={() => setActiveMomentId(moment.id)}
                aria-haspopup="dialog"
                aria-label={t('actions.openPhoto', { title })}
              >
                <img
                  src={moment.image}
                  alt=""
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  style={{ objectPosition: moment.objectPosition }}
                />
                <span className="community-event-card__veil" aria-hidden="true" />
                <span className="community-event-card__topline" aria-hidden="true">
                  <span>{sequence} / {String(communityMoments.length).padStart(2, '0')}</span>
                  <span>{kind}</span>
                </span>
                <span className="community-event-card__body">
                  <span className="community-event-card__title">{title}</span>
                  <span className="community-event-card__description">{description}</span>
                  <span className="community-event-card__action">
                    <FrameIcon />
                    {t('actions.openFrame')}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <p className="community-events-footer-note">{t('footerNote')}</p>
      </div>

      {activeMoment ? createPortal(
        <div className="community-story" role="presentation">
          <section
            ref={viewerRef}
            className="community-story__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
            aria-describedby={modalDescriptionId}
          >
            <header className="community-story__topbar">
              <p>
                <span>{t('actions.storyLabel')}</span>
                <strong>{String(activeMomentIndex + 1).padStart(2, '0')} / {String(communityMoments.length).padStart(2, '0')}</strong>
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                className="community-story__close"
                onClick={closeViewer}
                aria-label={t('actions.closeViewer')}
              >
                <span>{t('actions.close')}</span>
                <CloseIcon />
              </button>
            </header>

            <div className="community-story__stage">
              <div
                className="community-story__media"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <span className="community-story__frame" aria-hidden="true" />
                <img
                  key={activeMoment.id}
                  src={activeMoment.image}
                  alt={t(`items.${activeMoment.id}.title`)}
                  style={{ objectPosition: activeMoment.objectPosition }}
                />
                <span className="community-story__image-index" aria-hidden="true">
                  {String(activeMomentIndex + 1).padStart(2, '0')}
                </span>
              </div>

              <aside className="community-story__caption">
                <p className="community-story__kind">{t(`items.${activeMoment.id}.kind`)}</p>
                <h3 id={modalTitleId}>{t(`items.${activeMoment.id}.title`)}</h3>
                <p id={modalDescriptionId} className="community-story__description">
                  {t(`items.${activeMoment.id}.description`)}
                </p>
                <p className="community-story__hint">{t('actions.navigationHint')}</p>
              </aside>
            </div>

            <footer className="community-story__controls">
              <button type="button" onClick={showPreviousMoment} aria-label={t('actions.previousPhoto')}>
                <ChevronIcon direction="previous" />
                <span>{t('actions.previous')}</span>
              </button>

              <div className="community-story__progress" aria-label={t('actions.photoProgress', {
                current: activeMomentIndex + 1,
                total: communityMoments.length,
              })}>
                {communityMoments.map((moment, index) => (
                  <button
                    key={moment.id}
                    type="button"
                    className={moment.id === activeMoment.id ? 'is-active' : ''}
                    onClick={() => setActiveMomentId(moment.id)}
                    aria-label={t('actions.goToPhoto', {
                      index: index + 1,
                      title: t(`items.${moment.id}.title`),
                    })}
                    aria-current={moment.id === activeMoment.id ? 'true' : undefined}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                  </button>
                ))}
              </div>

              <button type="button" onClick={showNextMoment} aria-label={t('actions.nextPhoto')}>
                <span>{t('actions.next')}</span>
                <ChevronIcon direction="next" />
              </button>
            </footer>
          </section>
        </div>,
        document.body,
      ) : null}
    </section>
  );
};

export default CommunityEvents;

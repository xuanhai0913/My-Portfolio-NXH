import React, { useEffect, useId, useRef, useState } from 'react';
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

const CommunityEvents = () => {
  const { t } = useTranslation('community');
  const [activeMomentId, setActiveMomentId] = useState(null);
  const closeButtonRef = useRef(null);
  const previousActiveElementRef = useRef(null);
  const modalTitleId = useId();
  const activeMoment = communityMoments.find((moment) => moment.id === activeMomentId) || null;

  useEffect(() => {
    if (!activeMoment) return undefined;

    const previousOverflow = document.body.style.overflow;
    previousActiveElementRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveMomentId(null);
    };

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElementRef.current?.focus?.();
    };
  }, [activeMoment]);

  const closeViewer = () => setActiveMomentId(null);

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

      {activeMoment ? (
        <div className="community-viewer" role="presentation" onClick={(event) => {
          if (event.target === event.currentTarget) closeViewer();
        }}>
          <section className="community-viewer__dialog" role="dialog" aria-modal="true" aria-labelledby={modalTitleId}>
            <button
              ref={closeButtonRef}
              type="button"
              className="community-viewer__close"
              onClick={closeViewer}
              aria-label={t('actions.closeViewer')}
            >
              <CloseIcon />
              <span>{t('actions.close')}</span>
            </button>
            <div className="community-viewer__image-wrap">
              <img
                src={activeMoment.image}
                alt={t(`items.${activeMoment.id}.title`)}
                style={{ objectPosition: activeMoment.objectPosition }}
              />
            </div>
            <div className="community-viewer__details">
              <p>{t(`items.${activeMoment.id}.kind`)}</p>
              <h3 id={modalTitleId}>{t(`items.${activeMoment.id}.title`)}</h3>
              <p>{t(`items.${activeMoment.id}.description`)}</p>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
};

export default CommunityEvents;

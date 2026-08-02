import React, { useRef, useState, useMemo, Suspense, lazy } from 'react';
import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';
import { API } from '../../utils/constants';
import { trackContactSubmit, trackSocialClick } from '../../utils/analytics';
import SlateEditor, { SLATE_DRAFT_STORAGE_KEY } from './SlateEditor';
import './styles/Contact.css';

const IceCreamModel = lazy(() => import('./IceCreamModel'));

const DOMAIN_SUGGESTIONS = [
  '@gmail.com',
  '@yahoo.com',
  '@outlook.com',
  '@hotmail.com',
  '@icloud.com',
];

const Contact = () => {
  const { t } = useTranslation('contact');
  const form = useRef();
  const hiddenMessageRef = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [editorKey, setEditorKey] = useState(0);
  const [email, setEmail] = useState('');

  // Show domain chips when user typed '@' but hasn't completed a known domain
  const domainChips = useMemo(() => {
    const atIndex = email.indexOf('@');
    if (atIndex === -1 || atIndex === 0) return [];
    const typed = email.slice(atIndex).toLowerCase();
    // Hide if user already typed a full domain from the list
    if (DOMAIN_SUGGESTIONS.includes(typed)) return [];
    return DOMAIN_SUGGESTIONS.filter((d) => d.startsWith(typed));
  }, [email]);

  const handleDomainClick = (domain) => {
    const atIndex = email.indexOf('@');
    if (atIndex === -1) return;
    setEmail(email.slice(0, atIndex) + domain);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    // Manual validation: hidden inputs don't support `required`
    if (!hiddenMessageRef.current || !hiddenMessageRef.current.value.trim()) {
      setStatus('empty');
      setTimeout(() => setStatus(null), 3000);
      return;
    }

    setLoading(true);
    setStatus(null);

    // 1. Send Admin Notification
    const sendAdmin = emailjs.sendForm(
      API.EMAILJS_SERVICE,
      API.EMAILJS_TEMPLATE,
      form.current,
      API.EMAILJS_PUBLIC_KEY
    );

    // 2. Send Auto-Reply to User
    const sendAutoReply = emailjs.sendForm(
      API.EMAILJS_SERVICE,
      API.EMAILJS_AUTOREPLY_TEMPLATE,
      form.current,
      API.EMAILJS_PUBLIC_KEY
    );

    // Use allSettled to allow partial success (e.g., Admin mail sends but Auto-reply fails)
    Promise.allSettled([sendAdmin, sendAutoReply])
      .then((results) => {
        const adminResult = results[0];
        const autoReplyResult = results[1];

        // If Admin mail sends successfully, we consider it a success for the user
        if (adminResult.status === 'fulfilled') {
          setLoading(false);
          setStatus('success');
          trackContactSubmit('email_form');
          form.current.reset();
          setEmail('');
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(SLATE_DRAFT_STORAGE_KEY);
          }
          setEditorKey((k) => k + 1); // remount SlateEditor to reset
          setTimeout(() => setStatus(null), 5000);

          // Log warning if auto-reply failed silently
          if (autoReplyResult.status === 'rejected') {
            console.warn('Auto-reply failed to send:', autoReplyResult.reason);
          }
        } else {
          // Only show error if Main Admin mail also failed
          setLoading(false);
          setStatus('error');
          console.error('Admin Email Failed:', adminResult.reason);
        }
      });
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">

        {/* Left Column: 3D Ice Cream */}
        <div className="contact-model-col">
          <Suspense fallback={
            <div className="model-loading">
              <span className="model-loading-icon">🍦</span>
            </div>
          }>
            <IceCreamModel celebrate={status === 'success'} />
          </Suspense>
          <p className="model-caption">{t('model.caption')} 🍦</p>
        </div>

        {/* Right Column: Form */}
        <div className="contact-content">
          <h2 className="contact-heading">
            {t('heading.prefix')} <span className="neon">{t('heading.highlight')}</span>
          </h2>
          <p className="contact-intro">
            {t('intro.beforeHighlight')} <span className="neon">{t('intro.highlight')}</span>{t('intro.afterHighlight')}
          </p>

          <form ref={form} onSubmit={sendEmail} className="minimal-form" aria-busy={loading}>
            <div className="form-group">
              <input
                type="text"
                name="user_name"
                autoComplete="name"
                placeholder={t('form.namePlaceholder')}
                aria-label={t('form.nameAria')}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group form-group--email">
              <input
                type="email"
                name="user_email"
                autoComplete="email"
                inputMode="email"
                spellCheck="false"
                placeholder={t('form.emailPlaceholder')}
                aria-label={t('form.emailAria')}
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {domainChips.length > 0 && (
                <div className="email-domain-suggestions">
                  {domainChips.map((domain) => (
                    <button
                      key={domain}
                      type="button"
                      className="email-domain-chip"
                      onClick={() => handleDomainClick(domain)}
                      aria-label={t('form.useEmailDomain', { domain })}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="form-group form-group--editor">
              <input
                type="hidden"
                name="message"
                ref={hiddenMessageRef}
              />
              <SlateEditor
                key={editorKey}
                hiddenInputRef={hiddenMessageRef}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={`btn-submit ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? t('form.sending') : t('form.send')}
            </button>

            {status === 'success' && (
              <p className="status-msg success" role="status" aria-live="polite">
                {t('status.success')}
              </p>
            )}
            {status === 'error' && (
              <p className="status-msg error" role="alert">
                {t('status.error')}
              </p>
            )}
            {status === 'empty' && (
              <p className="status-msg error" role="alert">
                {t('status.empty')}
              </p>
            )}
          </form>

          <div className="social-links">
            <a href="https://github.com/xuanhai0913" target="_blank" rel="noreferrer" className="social-icon" aria-label={t('social.githubAria')} onClick={() => trackSocialClick('github')}>GITHUB</a>
            <a href="https://www.linkedin.com/in/xuanhai0913/" target="_blank" rel="noreferrer" className="social-icon" aria-label={t('social.linkedinAria')} onClick={() => trackSocialClick('linkedin')}>LINKEDIN</a>
            <a href="https://www.youtube.com/@xuanhai0913" target="_blank" rel="noreferrer" className="social-icon" aria-label={t('social.youtubeAria')} onClick={() => trackSocialClick('youtube')}>YOUTUBE</a>
            <a href="https://dev.to/xuanhai0913" target="_blank" rel="noreferrer" className="social-icon" aria-label={t('social.devtoAria')} onClick={() => trackSocialClick('devto')}>DEV.TO</a>
            <a href="mailto:xuanhai0913750452@gmail.com" className="social-icon" aria-label={t('social.emailAria')} onClick={() => trackSocialClick('email')}>EMAIL</a>
          </div>
        </div>

      </div>

      <div className="footer-placeholder" aria-hidden="true"></div>
    </section>
  );
};

export default Contact;

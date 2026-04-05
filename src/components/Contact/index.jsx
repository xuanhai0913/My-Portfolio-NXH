import React, { useRef, useState, useMemo, useEffect, Suspense, lazy } from 'react';
import emailjs from '@emailjs/browser';
import { API } from '../../utils/constants';
import { trackContactSubmit, trackSocialClick } from '../../utils/analytics';
import SlateEditor, { SLATE_DRAFT_STORAGE_KEY } from './SlateEditor';
import ErrorBoundary from '../ErrorBoundary';
import './styles/Contact.css';

const IceCreamModel = lazy(() => import('./IceCreamModel'));

const DOMAIN_SUGGESTIONS = [
  '@gmail.com',
  '@yahoo.com',
  '@outlook.com',
  '@hotmail.com',
  '@icloud.com',
];

const ModelLoadingFallback = () => (
  <div className="model-loading" role="status" aria-live="polite">
    <span className="model-loading-icon" aria-hidden="true">🍦</span>
    <span className="model-loading-text">Loading visual...</span>
  </div>
);

const ModelStaticFallback = () => (
  <div className="model-static-fallback" role="img" aria-label="Contact illustration placeholder">
    <div className="model-static-icon" aria-hidden="true">🍦</div>
    <p className="model-static-title">Interactive model unavailable</p>
    <p className="model-static-copy">You can still send your message below.</p>
  </div>
);

const Contact = () => {
  const form = useRef();
  const hiddenMessageRef = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'
  const [editorKey, setEditorKey] = useState(0);
  const [email, setEmail] = useState('');
  const [allowInteractiveModel, setAllowInteractiveModel] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateCapability = () => {
      const reducedMotion = mediaQuery.matches;
      const smallViewport = window.innerWidth < 1024;
      const lowCpu = typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
      const lowMemory = typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory <= 4;

      const shouldDisableInteractiveModel = reducedMotion || (smallViewport && (lowCpu || lowMemory));
      setAllowInteractiveModel(!shouldDisableInteractiveModel);
    };

    updateCapability();
    window.addEventListener('resize', updateCapability, { passive: true });
    mediaQuery.addEventListener('change', updateCapability);

    return () => {
      window.removeEventListener('resize', updateCapability);
      mediaQuery.removeEventListener('change', updateCapability);
    };
  }, []);

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
          {allowInteractiveModel ? (
            <ErrorBoundary fallback={<ModelStaticFallback />}>
              <Suspense fallback={<ModelLoadingFallback />}>
                <IceCreamModel celebrate={status === 'success'} />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <ModelStaticFallback />
          )}
          <p className="model-caption">
            {allowInteractiveModel
              ? 'Move your cursor around me! 🍦'
              : 'Static mode enabled for smoother experience.'}
          </p>
        </div>

        {/* Right Column: Form */}
        <div className="contact-content">
          <h2 className="contact-heading">
            Let's <span className="neon">Connect</span>
          </h2>
          <p className="contact-intro">
            Have an idea or project? Let's collaborate and build something <span className="neon">extraordinary</span>.
          </p>

          <form ref={form} onSubmit={sendEmail} className="minimal-form">
            <div className="form-group">
              <input
                type="text"
                name="user_name"
                placeholder="NAME"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group form-group--email">
              <input
                type="email"
                name="user_email"
                placeholder="EMAIL"
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
              {loading ? 'SENDING...' : 'SEND MESSAGE →'}
            </button>

            {status === 'success' && (
              <p className="status-msg success">
                Message sent! I'll get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p className="status-msg error">
                Failed to send. Please verify the keys or try again later.
              </p>
            )}
            {status === 'empty' && (
              <p className="status-msg error">
                Please type a message before sending.
              </p>
            )}
          </form>

          <div className="social-links">
            <a href="https://github.com/xuanhai0913" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub profile" onClick={() => trackSocialClick('github')}>GITHUB</a>
            <a href="https://www.linkedin.com/in/xuanhai0913/" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn profile" onClick={() => trackSocialClick('linkedin')}>LINKEDIN</a>
            <a href="https://www.youtube.com/@xuanhai0913" target="_blank" rel="noreferrer" className="social-icon" aria-label="YouTube channel" onClick={() => trackSocialClick('youtube')}>YOUTUBE</a>
            <a href="https://dev.to/xuanhai0913" target="_blank" rel="noreferrer" className="social-icon" aria-label="Dev.to blog" onClick={() => trackSocialClick('devto')}>DEV.TO</a>
            <a href="mailto:contact@hailamdev.space" className="social-icon" aria-label="Send email" onClick={() => trackSocialClick('email')}>EMAIL</a>
          </div>
        </div>

      </div>

      <footer className="footer-placeholder"></footer>
    </section>
  );
};

export default Contact;

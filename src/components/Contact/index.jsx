import React, { useRef, useState, useMemo, Suspense, lazy } from 'react';
import emailjs from '@emailjs/browser';
import { API } from '../../utils/constants';
import SlateEditor from './SlateEditor';
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
          form.current.reset();
          setEmail('');
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
          <p className="model-caption">Move your cursor around me! 🍦</p>
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
            <a href="https://github.com/xuanhai0913" target="_blank" rel="noreferrer" className="social-icon">GITHUB</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon">LINKEDIN</a>
            <a href="mailto:contact@hailamdev.space" className="social-icon">EMAIL</a>
          </div>
        </div>

      </div>

      <footer className="footer-placeholder"></footer>
    </section>
  );
};

export default Contact;

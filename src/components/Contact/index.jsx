import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { API } from '../../utils/constants';
import './styles/Contact.css';

const Contact = () => {
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'

  const sendEmail = (e) => {
    e.preventDefault();
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

        <h2 className="vertical-header">CONTACT</h2>

        <div className="contact-content">
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
            <div className="form-group">
              <input
                type="email"
                name="user_email"
                placeholder="EMAIL"
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder="MESSAGE"
                rows="4"
                required
                disabled={loading}
              ></textarea>
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
                ✅ Message sent! I'll get back to you soon.
              </p>
            )}
            {status === 'error' && (
              <p className="status-msg error">
                ❌ Failed to send. Please verify the keys or try again later.
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
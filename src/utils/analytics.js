/**
 * GA4 Analytics Utility Module
 * Track meaningful user interactions for hailamdev.space portfolio
 * 
 * Skills applied: analytics-tracking
 * Events follow Object-Action naming convention
 */

// Safe gtag wrapper — doesn't crash if GA4 hasn't loaded
const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
};

// ==========================================
// Section Tracking — IntersectionObserver
// ==========================================
const trackedSections = new Set();

export const initSectionTracking = () => {
  if (typeof IntersectionObserver === 'undefined') return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionName = entry.target.dataset.section || entry.target.id;
          if (sectionName && !trackedSections.has(sectionName)) {
            trackedSections.add(sectionName);
            trackEvent('section_viewed', {
              section_name: sectionName,
            });
          }
        }
      });
    },
    { threshold: 0.3 }
  );

  // Observe all sections with data-section or id
  const sections = document.querySelectorAll('[data-section], section[id]');
  sections.forEach((section) => observer.observe(section));

  return observer;
};

// ==========================================
// Scroll Depth Tracking
// ==========================================
const trackedDepths = new Set();

export const initScrollDepthTracking = () => {
  const milestones = [25, 50, 75, 100];

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100);

    milestones.forEach((milestone) => {
      if (scrollPercent >= milestone && !trackedDepths.has(milestone)) {
        trackedDepths.add(milestone);
        trackEvent('scroll_depth', {
          percent: milestone,
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
};

// ==========================================
// User Action Events
// ==========================================

/** Track when a portfolio project link is clicked */
export const trackProjectClick = (projectName, linkType = 'demo') => {
  trackEvent('project_clicked', {
    project_name: projectName,
    link_type: linkType, // 'demo' | 'github'
  });
};

/** Track resume/CV download */
export const trackResumeDownload = (format = 'pdf') => {
  trackEvent('resume_downloaded', {
    format,
  });
};

/** Track contact form submission */
export const trackContactSubmit = (method = 'form') => {
  trackEvent('contact_form_submitted', {
    method,
  });
};

/** Track social link clicks */
export const trackSocialClick = (platform) => {
  trackEvent('social_link_clicked', {
    platform,
  });
};

/** Track AI assistant interactions */
export const trackAssistantOpen = (source = 'widget') => {
  trackEvent('assistant_opened', {
    source, // 'widget' | 'page' | 'nav'
  });
};

/** Track CTA button clicks */
export const trackCTAClick = (buttonText, location) => {
  trackEvent('cta_clicked', {
    button_text: buttonText,
    location,
  });
};

export default trackEvent;

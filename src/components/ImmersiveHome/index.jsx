import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { EXTERNAL_URLS, WORK_EXPERIENCE } from '../../utils/constants';
import prj1 from '../../images/project/prj1.png';
import prj2 from '../../images/project/prj2.png';
import prj3 from '../../images/project/prj3.png';
import prj5 from '../../images/project/prj5.png';
import './ImmersiveHome.css';

const SECTION_FLOW = [
  { id: 'hero', label: 'Entry', nav: false },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'projects', label: 'Projects' },
  { id: 'journey', label: 'Journey' },
  { id: 'lab', label: 'Lab' },
  { id: 'contact-zone', label: 'Contact' },
];

const NAV_SECTIONS = SECTION_FLOW.filter((section) => section.nav !== false);

const SHOWCASE_PROJECTS = [
  {
    title: 'Neon Commerce Core',
    subtitle: 'React + .NET architecture',
    image: prj1,
    summary:
      'High-throughput commerce dashboard with resilient APIs, modular UI blocks, and event-driven analytics.',
  },
  {
    title: 'Media Intelligence Engine',
    subtitle: 'Content orchestration system',
    image: prj2,
    summary:
      'End-to-end editorial automation with workflow controls, preview states, and adaptive publishing templates.',
  },
  {
    title: 'Learning Experience Cloud',
    subtitle: 'LMS + certificate pipeline',
    image: prj3,
    summary:
      'Learning platform with document generation, identity workflows, and dynamic student progress surfaces.',
  },
  {
    title: 'Conversation Studio',
    subtitle: 'AI-assisted interaction layer',
    image: prj5,
    summary:
      'Human-centered AI UX patterns for assistant workflows, intent routing, and production-safe fallback logic.',
  },
];

const STATS = [
  { value: '25+', label: 'Systems Delivered' },
  { value: '04', label: 'Core Product Domains' },
  { value: '99.9%', label: 'Uptime Mindset' },
  { value: '∞', label: 'Iteration Mode' },
];

const HeroScene3D = lazy(() => import('./HeroScene3D'));

const HeroScene = ({ reducedMotion }) => {
  if (reducedMotion) {
    return (
      <div className="hero-static-sphere" aria-hidden="true">
        <div className="hero-static-core" />
      </div>
    );
  }

  return <HeroScene3D />;
};

const getSectionElement = (sectionId) => {
  if (typeof document === 'undefined') return null;
  return document.getElementById(sectionId);
};

const ImmersiveHome = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const labVideoRefs = useRef([]);
  const [revealedSections, setRevealedSections] = useState(() => (
    SECTION_FLOW.reduce((acc, section) => {
      acc[section.id] = section.id === 'hero';
      return acc;
    }, {})
  ));

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncMotionPreference = () => {
      setReducedMotion(mediaQuery.matches);
    };

    syncMotionPreference();
    mediaQuery.addEventListener('change', syncMotionPreference);

    return () => {
      mediaQuery.removeEventListener('change', syncMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const sectionElements = SECTION_FLOW.map((section) => document.getElementById(section.id)).filter(Boolean);

    if (sectionElements.length === 0) return undefined;

    if (reducedMotion) {
      setRevealedSections((prev) => {
        const next = { ...prev };
        SECTION_FLOW.forEach((section) => {
          next[section.id] = true;
        });
        return next;
      });
    }

    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        threshold: [0.25, 0.45, 0.65],
        rootMargin: '-10% 0px -30% 0px',
      }
    );

    const revealObserver = reducedMotion
      ? null
      : new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const sectionId = entry.target.id;
            setRevealedSections((prev) => {
              if (prev[sectionId]) return prev;
              return { ...prev, [sectionId]: true };
            });
          });
        },
        {
          threshold: 0.18,
          rootMargin: '0px 0px -12% 0px',
        }
      );

    sectionElements.forEach((section) => {
      activeObserver.observe(section);
      if (revealObserver) revealObserver.observe(section);
    });

    return () => {
      sectionElements.forEach((section) => {
        activeObserver.unobserve(section);
        if (revealObserver) revealObserver.unobserve(section);
      });
      activeObserver.disconnect();
      if (revealObserver) revealObserver.disconnect();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

    let rafId = 0;

    const updateProgress = () => {
      const documentElement = document.documentElement;
      const maxScrollable = Math.max(documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(100, Math.max(0, Math.round((window.scrollY / maxScrollable) * 100)));
      setScrollProgress(progress);
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId !== 0) return;
      rafId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (reducedMotion || typeof IntersectionObserver === 'undefined') return undefined;

    const videos = labVideoRefs.current.filter(Boolean);
    if (videos.length === 0) return undefined;

    const inViewMap = new WeakMap();

    const syncVideoState = () => {
      const isVisible = !document.hidden;
      videos.forEach((video) => {
        const isInView = inViewMap.get(video) ?? false;

        if (isVisible && isInView) {
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
              // Ignore autoplay policy rejections.
            });
          }
          return;
        }

        video.pause();
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inViewMap.set(entry.target, entry.isIntersecting);
        });
        syncVideoState();
      },
      {
        threshold: 0.2,
        rootMargin: '80px 0px',
      }
    );

    videos.forEach((video) => {
      inViewMap.set(video, false);
      observer.observe(video);
    });

    document.addEventListener('visibilitychange', syncVideoState);
    syncVideoState();

    return () => {
      document.removeEventListener('visibilitychange', syncVideoState);
      observer.disconnect();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const hash = window.location.hash.replace('#', '');
    if (!hash) return undefined;

    const target = getSectionElement(hash);
    if (!target) return undefined;

    const run = window.requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(run);
  }, [reducedMotion]);

  const jumpToSection = (event, sectionId) => {
    const target = getSectionElement(sectionId);
    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });

    if (typeof window !== 'undefined' && window.history?.replaceState) {
      window.history.replaceState(null, '', `#${sectionId}`);
    }

    const focusDelay = reducedMotion ? 0 : 260;
    window.setTimeout(() => {
      target.focus({ preventScroll: true });
    }, focusDelay);
  };

  const registerLabVideo = (index) => (element) => {
    labVideoRefs.current[index] = element;
  };

  return (
    <div className="immersive-home">
      <a className="neo-skip-link" href="#neo-main">Skip to immersive content</a>

      <header className="neo-nav-shell">
        <div className="neo-brand">
          <span className="neo-brand-accent">NGUYEN</span>
          <span className="neo-brand-core">XUAN HAI</span>
        </div>

        <nav aria-label="Primary" className="neo-nav-links">
          {NAV_SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={activeSection === section.id ? 'is-active' : ''}
              aria-current={activeSection === section.id ? 'page' : undefined}
              onClick={(event) => jumpToSection(event, section.id)}
            >
              {section.label}
            </a>
          ))}
        </nav>
      </header>

      <aside className="neo-progress-hud" aria-label="Page progression">
        <div className="neo-progress-head">
          <span>Scroll</span>
          <strong>{scrollProgress}%</strong>
        </div>
        <div className="neo-progress-track" aria-hidden="true">
          <span
            className="neo-progress-fill"
            style={{ transform: `scaleY(${scrollProgress / 100})` }}
          />
        </div>
        <div className="neo-progress-steps">
          {SECTION_FLOW.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`neo-progress-step ${activeSection === section.id ? 'is-active' : ''} ${revealedSections[section.id] ? 'is-seen' : ''}`}
              aria-current={activeSection === section.id ? 'step' : undefined}
              aria-label={`Jump to ${section.label} section`}
              onClick={(event) => jumpToSection(event, section.id)}
            >
              <span>{section.label}</span>
            </a>
          ))}
        </div>
      </aside>

      <main id="neo-main" aria-label="Immersive portfolio content">
        <section className={`neo-hero neo-scene ${revealedSections.hero ? 'is-visible' : ''}`} id="hero" tabIndex={-1} aria-labelledby="hero-title">
          <div className="neo-hero-text">
            <p className="neo-eyebrow">Immersive Product Frontend</p>
            <h1 id="hero-title">
              DIGITAL
              <span>EXPERIENCE</span>
              SYSTEMS
            </h1>
            <p className="neo-hero-copy">
              A full visual reset for this portfolio: cinematic motion, layered depth,
              and product storytelling designed for high-impact frontend identity.
            </p>
            <div className="neo-hero-actions">
              <a href="#projects" onClick={(event) => jumpToSection(event, 'projects')} className="neo-btn neo-btn-primary">Explore Projects</a>
              <a href={EXTERNAL_URLS.GITHUB} target="_blank" rel="noreferrer" className="neo-btn neo-btn-ghost">Github Signal</a>
            </div>
          </div>

          <div className="neo-hero-visual" aria-hidden="true">
            <Suspense fallback={<div className="hero-static-sphere"><div className="hero-static-core" /></div>}>
              <HeroScene reducedMotion={reducedMotion} />
            </Suspense>
          </div>
        </section>

        <section id="manifesto" tabIndex={-1} className={`neo-manifesto neo-scene ${revealedSections.manifesto ? 'is-visible' : ''}`}>
          <div className="neo-section-head">
            <p>Manifesto</p>
            <h2>Not another template portfolio.</h2>
          </div>

          <div className="neo-manifesto-grid">
            <article>
              <h3>01 / Narrative First</h3>
              <p>Every screen should explain intent, not just decorate. Motion is used to guide attention and reveal hierarchy.</p>
            </article>
            <article>
              <h3>02 / Systems Thinking</h3>
              <p>Design tokens, reusable layout rhythms, and stable component boundaries keep the experience scalable.</p>
            </article>
            <article>
              <h3>03 / Runtime Discipline</h3>
              <p>3D, animation, and interaction are adaptive by capability, with graceful fallbacks and reduced-motion fidelity.</p>
            </article>
          </div>

          <div className="neo-stats-grid" role="list" aria-label="Portfolio statistics">
            {STATS.map((stat) => (
              <div key={stat.label} role="listitem" className="neo-stat-card">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="projects" tabIndex={-1} className={`neo-projects neo-scene ${revealedSections.projects ? 'is-visible' : ''}`}>
          <div className="neo-section-head">
            <p>Projects</p>
            <h2>High-fidelity product work, rebuilt with a new visual language.</h2>
          </div>

          <div className="neo-project-grid">
            {SHOWCASE_PROJECTS.map((project) => (
              <article key={project.title} className="neo-project-card">
                <div className="neo-project-media">
                  <img src={project.image} alt={`${project.title} preview`} loading="lazy" />
                </div>
                <div className="neo-project-body">
                  <p>{project.subtitle}</p>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="journey" tabIndex={-1} className={`neo-journey neo-scene ${revealedSections.journey ? 'is-visible' : ''}`}>
          <div className="neo-section-head">
            <p>Journey</p>
            <h2>From LMS infrastructure to media platforms and AI product surfaces.</h2>
          </div>

          <div className="neo-journey-list">
            {WORK_EXPERIENCE.slice(0, 4).map((job) => (
              <article key={job.company} className="neo-journey-item">
                <div className="neo-journey-meta">
                  <span>{job.period}</span>
                  <strong>{job.role}</strong>
                </div>
                <div className="neo-journey-content">
                  <h3>{job.company}</h3>
                  <p>{job.description}</p>
                  <div className="neo-chip-row">
                    {job.technologies.slice(0, 5).map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="lab" tabIndex={-1} className={`neo-lab neo-scene ${revealedSections.lab ? 'is-visible' : ''}`}>
          <div className="neo-section-head">
            <p>Lab</p>
            <h2>Motion-driven presentation layer inspired by digital installations.</h2>
          </div>

          <div className="neo-lab-grid">
            <article className="neo-lab-panel">
              <h3>Neon History Feed</h3>
              <p>Editorial storytelling with temporal transitions and modular scene composition.</p>
              <video
                ref={registerLabVideo(0)}
                src="/Neon_History_Optimized.mp4"
                autoPlay={!reducedMotion}
                muted
                loop
                playsInline
                controls={reducedMotion}
                preload="metadata"
              />
            </article>

            <article className="neo-lab-panel">
              <h3>Neon Projects Stage</h3>
              <p>Projects rendered as cinematic cards with dense information and layered depth treatment.</p>
              <video
                ref={registerLabVideo(1)}
                src="/Neon_Projects_Optimized.mp4"
                autoPlay={!reducedMotion}
                muted
                loop
                playsInline
                controls={reducedMotion}
                preload="metadata"
              />
            </article>
          </div>
        </section>

        <section id="contact-zone" tabIndex={-1} className={`neo-contact neo-scene ${revealedSections['contact-zone'] ? 'is-visible' : ''}`}>
          <p>Ready for the next visual system upgrade?</p>
          <h2>Let&apos;s build a frontend experience that people remember.</h2>
          <div className="neo-contact-actions">
            <a href="mailto:nguyenxuanhai0913@gmail.com" className="neo-btn neo-btn-primary">Send an Email</a>
            <a href="/assistant" className="neo-btn neo-btn-ghost">Open AI Assistant</a>
            <a href={EXTERNAL_URLS.LINKEDIN} target="_blank" rel="noreferrer" className="neo-btn neo-btn-ghost">LinkedIn</a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ImmersiveHome;

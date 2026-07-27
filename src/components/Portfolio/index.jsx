import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useLocaleNavigation from '../../hooks/useLocaleNavigation';
import i18n from '../../i18n';
import { trackProjectClick } from '../../utils/analytics';
import enProjects from '../../i18n/locales/en/projects.json';
import viProjects from '../../i18n/locales/vi/projects.json';
import './styles/Portfolio.css';

// Import project images
import prj1 from '../../images/project/prj1.webp';
import prj3 from '../../images/project/prj3.webp';
import prj6 from '../../images/project/prj6.webp';
import prj8 from '../../images/project/prj8.webp';
import prj10 from '../../images/project/prj10.webp';
import visionKey from '../../images/project/visionKey.webp';
import agriTrace from '../../images/project/agritrace.webp';
import chongScam from '../../images/project/chongscam.webp';
import routeLab from '../../images/project/routelab.webp';
import oakMind from '../../images/project/oakmind.webp';

i18n.addResourceBundle('en', 'projects', enProjects, true, true);
i18n.addResourceBundle('vi', 'projects', viProjects, true, true);

const projectCatalog = [
    {
      id: "oakmind",
      image: oakMind,
      demo: "https://oakmindgroup.com/",
      technologies: ["React 19", "ASP.NET Core 8", "SQL Server", "Cloudflare R2"],
      badge: true,
      company: "OAKMIND GROUP",
      year: "2026",
      group: "client"
    },
    {
      id: "greatLinkMaiHouse",
      image: prj8,
      demo: "https://greatlinkmaihouse.com/",
      technologies: ["React", "ASP.NET Core", "SQL Server", "SignalR"],
      badge: true,
      company: "OAKMIND GROUP",
      year: "2025",
      group: "client"
    },
    {
      id: "educationEnglish",
      image: prj6,
      demo: "https://ech.edu.vn",
      technologies: ["ASP.NET Core", "EF Core", "SQL Server", "QuestPDF"],
      company: "ECH COMMUNITY",
      year: "2024",
      group: "client"
    },
    {
      id: "vnMediaHub",
      image: prj3,
      demo: "https://vnmediahub.com",
      technologies: ["React", "ASP.NET Core", "SQL Server", "Redis"],
      company: "OAKMIND GROUP",
      year: "2024",
      group: "client"
    },
    {
      id: "chongScam",
      image: chongScam,
      demo: "https://chongscam.vn/",
      technologies: ["React 19", "NestJS 11", "PostgreSQL", "Jest"],
      badge: true,
      company: "PET PROJECT",
      year: "2026",
      group: "pet"
    },
    {
      id: "routeLab",
      image: routeLab,
      demo: "https://tsp-delivery-route-optimizer.vercel.app/",
      github: "https://github.com/xuanhai0913/tsp-delivery-route-optimizer",
      technologies: ["React", "TypeScript", "Express", "Vitest"],
      badge: true,
      company: "PET PROJECT",
      year: "2026",
      group: "pet"
    },
    {
      id: "agriTrace",
      image: agriTrace,
      github: "https://github.com/xuanhai0913/agri-traceability-system",
      technologies: ["React", "Express", "PostgreSQL", "Solidity"],
      badge: true,
      company: "PET PROJECT",
      year: "2026",
      group: "pet"
    },
    {
      id: "visionKey",
      image: visionKey,
      technologies: ["Swift", "Next.js", "AI"],
      badge: true,
      demo: "https://landing-vision-premium.vercel.app",
      githubLinks: [
        { url: "https://github.com/xuanhai0913/Vision-Key", label: "MacOS" },
        { url: "https://github.com/xuanhai0913/Extension-Vision-Premium", label: "Premium" },
        { url: "https://github.com/xuanhai0913/Extension-Vision-Key", label: "Standard" }
      ],
      year: "2025",
      group: "pet"
    },
    {
      id: "llmUnitTestGen",
      image: prj10,
      demo: "/videos",
      github: "https://github.com/xuanhai0913/LLM-Unit-tests",
      technologies: ["React", "Deepseek", "Node.js"],
      badge: true,
      year: "2025",
      group: "pet"
    },
    {
      id: "portfolioWebsite",
      image: prj1,
      demo: "https://my-portfolio-nxh.vercel.app/",
      github: "https://github.com/xuanhai0913/My-Portfolio-NXH",
      technologies: ["React", "GSAP", "CSS3"],
      year: "2024",
      group: "pet"
    }
];

const projectGroups = ['all', 'client', 'pet'];

const ProjectUiIcon = ({ type }) => {
  const paths = {
    all: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    client: (
      <>
        <path d="M4 8h16v11H4z" />
        <path d="M9 8V5h6v3M4 12h16M10 12v2h4v-2" />
      </>
    ),
    pet: (
      <>
        <path d="M9 3v5l-5 9a2 2 0 0 0 1.8 3h12.4a2 2 0 0 0 1.8-3l-5-9V3" />
        <path d="M8 13h8M8 3h8" />
      </>
    ),
    role: (
      <>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20c.8-4 3.1-6 7-6s6.2 2 7 6" />
      </>
    ),
    impact: (
      <>
        <path d="M4 18V9M10 18V5M16 18v-7M22 18H2" />
        <path d="m16 7 3-3 3 3M19 4v8" />
      </>
    ),
    stack: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
      </>
    )
  };

  return (
    <svg className="project-ui-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[type] || paths.all}
    </svg>
  );
};

const Portfolio = () => {
  const { t } = useTranslation('projects');
  const { localizePath } = useLocaleNavigation();
  const sectionRef = useRef(null);
  const projectListRef = useRef(null);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const prevIndexRef = useRef(0);
  const scrollFrameRef = useRef(null);
  const hasPreloadedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [projectGroup, setProjectGroup] = useState('all');
  const filteredCatalog = projectGroup === 'all'
    ? projectCatalog
    : projectCatalog.filter((project) => project.group === projectGroup);
  const projectCount = filteredCatalog.length;
  const allProjects = filteredCatalog.map((project) => ({
    ...project,
    title: t(`items.${project.id}.title`),
    description: t(`items.${project.id}.description`),
    role: t(`items.${project.id}.role`),
    achievement: t(`items.${project.id}.achievement`),
    badge: project.badge ? t(`items.${project.id}.badge`) : null,
  }));

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const updateMode = () => setIsMobile(mediaQuery.matches);

    updateMode();
    mediaQuery.addEventListener('change', updateMode);
    return () => mediaQuery.removeEventListener('change', updateMode);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const preloadProjectImages = () => {
      if (hasPreloadedRef.current) return;
      hasPreloadedRef.current = true;

      projectCatalog.forEach((project) => {
        const image = new Image();
        image.decoding = 'async';
        image.src = project.image;
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        preloadProjectImages();
        observer.disconnect();
      },
      { rootMargin: '900px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobile) return undefined;

    const current = Number.isFinite(activeIndex) ? activeIndex : 0;
    setScrollProgress((current + 1) / projectCount);
    return undefined;
  }, [activeIndex, isMobile, projectCount]);

  useEffect(() => {
    if (isMobile) return undefined;

    const updateFromScroll = () => {
      scrollFrameRef.current = null;
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const totalScrollable = Math.max(sectionHeight - viewportHeight, 1);
      const rawProgress = -rect.top / totalScrollable;
      const progress = Number.isFinite(rawProgress)
        ? Math.max(0, Math.min(1, rawProgress))
        : 0;

      setScrollProgress((current) => (
        Math.abs(current - progress) > 0.001 ? progress : current
      ));

      const rawIndex = Math.round(progress * (projectCount - 1));
      const newIndex = Number.isFinite(rawIndex)
        ? Math.min(projectCount - 1, Math.max(0, rawIndex))
        : prevIndexRef.current;

      if (newIndex === prevIndexRef.current) return;
      prevIndexRef.current = newIndex;
      setActiveIndex(newIndex);
    };

    const handleScroll = () => {
      if (scrollFrameRef.current !== null) return;
      scrollFrameRef.current = window.requestAnimationFrame(updateFromScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateFromScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollFrameRef.current !== null) {
        window.cancelAnimationFrame(scrollFrameRef.current);
        scrollFrameRef.current = null;
      }
    };
  }, [isMobile, projectCount]);

  // Handle project click from list
  const handleProjectClick = (index) => {
    setActiveIndex(index);
    prevIndexRef.current = index;

    if (isMobile) return;

    // Scroll to appropriate position
    if (sectionRef.current) {
      const sectionTop = sectionRef.current.offsetTop;
      const sectionHeight = sectionRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const totalScrollable = Math.max(sectionHeight - viewportHeight, 1);
      const progress = projectCount > 1 ? index / (projectCount - 1) : 0;
      const targetScroll = sectionTop + progress * totalScrollable;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const handlePrevProject = () => {
    setActiveIndex((prev) => {
      const next = (prev - 1 + projectCount) % projectCount;
      prevIndexRef.current = next;
      return next;
    });
  };

  const handleNextProject = () => {
    setActiveIndex((prev) => {
      const next = (prev + 1) % projectCount;
      prevIndexRef.current = next;
      return next;
    });
  };

  const handleStageTouchStart = (event) => {
    if (!isMobile) return;
    const firstTouch = event.touches[0];
    touchStartXRef.current = firstTouch.clientX;
    touchStartYRef.current = firstTouch.clientY;
  };

  const handleStageTouchEnd = (event) => {
    if (!isMobile || touchStartXRef.current === null || touchStartYRef.current === null) {
      return;
    }

    const endTouch = event.changedTouches[0];
    const deltaX = endTouch.clientX - touchStartXRef.current;
    const deltaY = endTouch.clientY - touchStartYRef.current;

    touchStartXRef.current = null;
    touchStartYRef.current = null;

    // Ignore mostly vertical gestures so natural page scrolling still works.
    if (Math.abs(deltaX) < Math.abs(deltaY)) return;

    const SWIPE_THRESHOLD = 45;
    if (deltaX <= -SWIPE_THRESHOLD) {
      handleNextProject();
    } else if (deltaX >= SWIPE_THRESHOLD) {
      handlePrevProject();
    }
  };

  const safeActiveIndex = Number.isFinite(activeIndex)
    ? Math.min(projectCount - 1, Math.max(0, activeIndex))
    : 0;
  const activeProject = allProjects[safeActiveIndex] || allProjects[0];

  const handleGroupChange = (group) => {
    if (group === projectGroup) return;
    setProjectGroup(group);
    setActiveIndex(0);
    prevIndexRef.current = 0;
    setScrollProgress(0);

    if (!isMobile && sectionRef.current) {
      window.scrollTo({
        top: sectionRef.current.offsetTop,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    }
  };

  const renderShowcaseCard = (project, prioritizeImage = false) => (
    <article className="showcase-card">
      <div className="showcase-visual">
        <div className="visual-frame">
          <img
            src={project.image}
            alt={t('aria.preview', { title: project.title })}
            className="showcase-image"
            loading={prioritizeImage ? 'eager' : 'lazy'}
            fetchpriority={prioritizeImage ? 'high' : 'low'}
            decoding="async"
            width="1600"
            height="1000"
          />
        </div>
        {project.badge && (
          <div className="showcase-badge">{project.badge}</div>
        )}
      </div>

      <div className="showcase-info">
        <div className="showcase-meta">
          {project.company && <span className="showcase-company">{project.company}</span>}
          <span className="showcase-year">{project.year}</span>
        </div>
        <h3 className="showcase-title">{project.title}</h3>
        <p className="showcase-desc">{project.description}</p>

        <div className="showcase-evidence">
          <div className="evidence-item">
            <span className="evidence-icon"><ProjectUiIcon type="role" /></span>
            <div>
              <span className="evidence-label">{t('labels.role')}</span>
              <p>{project.role}</p>
            </div>
          </div>
          {project.achievement && (
            <div className="evidence-item">
              <span className="evidence-icon"><ProjectUiIcon type="impact" /></span>
              <div>
                <span className="evidence-label">{t('labels.impact')}</span>
                <p>{project.achievement}</p>
              </div>
            </div>
          )}
        </div>

        <div className="showcase-stack">
          <span className="stack-label">
            <ProjectUiIcon type="stack" />
            {t('labels.stack')}
          </span>
          <div className="showcase-tech">
            {project.technologies.map((tech) => (
              <span key={tech} className="tech-pill">{tech}</span>
            ))}
          </div>
        </div>

        <div className="showcase-actions">
          {project.demo && (
            <a
              href={project.demo.startsWith('/') ? localizePath(project.demo) : project.demo}
              target={project.demo.startsWith('/') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className="action-btn primary"
              aria-label={t('aria.visitSite', { title: project.title })}
              onClick={() => trackProjectClick(project.title, 'demo')}
            >
              <span className="btn-text">{t('actions.visitSite')}</span>
              <span className="btn-icon" aria-hidden="true">↗</span>
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn secondary"
              aria-label={t('aria.github', { title: project.title })}
              onClick={() => trackProjectClick(project.title, 'github')}
            >
              <span className="btn-text">{t('actions.github')}</span>
            </a>
          )}
          {project.githubLinks && project.githubLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn secondary"
              aria-label={t('aria.githubVariant', { title: project.title, variant: link.label })}
              onClick={() => trackProjectClick(project.title, `github-${link.label}`)}
            >
              <span className="btn-text">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );

  return (
    <section
      id="portfolio"
      className="portfolio-section portfolio-scrollytelling"
      ref={sectionRef}
      style={{ '--project-scroll-height': `${Math.max(420, projectCount * 55)}vh` }}
      aria-labelledby="portfolio-title"
    >
      <div className="portfolio-sticky">
        {/* Fixed Header */}
        <div className="portfolio-header scrolly-header">
          <h2 id="portfolio-title" className="section-title glitch-text" data-text={t('heading')}>{t('heading')}</h2>
          <p className="project-overview">
            {t('overview', {
              total: projectCatalog.length,
              client: projectCatalog.filter((project) => project.group === 'client').length,
              pet: projectCatalog.filter((project) => project.group === 'pet').length
            })}
          </p>
          <div className="project-group-switch" role="group" aria-label={t('aria.projectGroups')}>
            {projectGroups.map((group) => (
              <button
                key={group}
                type="button"
                className={projectGroup === group ? 'is-active' : ''}
                aria-pressed={projectGroup === group}
                onClick={() => handleGroupChange(group)}
              >
                <ProjectUiIcon type={group} />
                <span>{t(`groups.${group}`)}</span>
                <small>
                  {group === 'all'
                    ? projectCatalog.length
                    : projectCatalog.filter((project) => project.group === group).length}
                </small>
              </button>
            ))}
          </div>
          <div className="project-counter">
            <span className="current">{String(safeActiveIndex + 1).padStart(2, '0')}</span>
            <span className="divider">/</span>
            <span className="total">{String(projectCount).padStart(2, '0')}</span>
          </div>
        </div>

        {isMobile ? (
          <div className="portfolio-mobile">
            <div className="mobile-project-nav" role="tablist" aria-label={t('aria.projectNavigation')}>
              {allProjects.map((project, index) => (
                <button
                  key={project.id}
                  role="tab"
                  aria-selected={safeActiveIndex === index}
                  aria-label={t('aria.selectProject', { title: project.title })}
                  className={`mobile-nav-item ${safeActiveIndex === index ? 'active' : ''}`}
                  onClick={() => handleProjectClick(index)}
                >
                  <span className="mobile-nav-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="mobile-nav-title">{project.title}</span>
                </button>
              ))}
            </div>

            <div
              className="mobile-project-stage"
              onTouchStart={handleStageTouchStart}
              onTouchEnd={handleStageTouchEnd}
            >
              {allProjects.map((project, index) => (
                <div
                  key={project.id}
                  className={`mobile-project-card ${safeActiveIndex === index ? 'is-active' : ''}`}
                  aria-hidden={safeActiveIndex !== index}
                >
                  {renderShowcaseCard(project, safeActiveIndex === index)}
                </div>
              ))}
            </div>

            <p className="mobile-swipe-hint">{t('hints.swipe')}</p>

            <div className="mobile-project-controls">
              <button type="button" className="mobile-control-btn" onClick={handlePrevProject} aria-label={t('aria.previousProject')}>
                {t('actions.previous')}
              </button>
              <span className="mobile-control-counter">
                {String(safeActiveIndex + 1).padStart(2, '0')} / {String(projectCount).padStart(2, '0')}
              </span>
              <button type="button" className="mobile-control-btn" onClick={handleNextProject} aria-label={t('aria.nextProject')}>
                {t('actions.next')}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Main Content Grid */}
            <div className="scrollytelling-grid">
              {/* Project List (Left Side) */}
              <div className="project-list" ref={projectListRef}>
                <div className="list-inner">
                  {allProjects.map((project, index) => (
                    <button
                      key={project.id}
                      aria-label={t('aria.selectProject', { title: project.title })}
                      className={`project-list-item ${safeActiveIndex === index ? 'active' : ''} ${index < safeActiveIndex ? 'passed' : ''}`}
                      onClick={() => handleProjectClick(index)}
                    >
                      <span className="item-index">{String(index + 1).padStart(2, '0')}</span>
                      <img
                        className="item-thumb"
                        src={project.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width="96"
                        height="64"
                      />
                      <div className="item-content">
                        <span className="item-title">{project.title}</span>
                        {project.badge && <span className="item-badge">{project.badge}</span>}
                      </div>
                      <span className="item-year">{project.year}</span>
                      <div className="item-progress">
                        <div
                          className="progress-fill"
                          style={{
                            transform: `scaleX(${safeActiveIndex === index ? 1 : safeActiveIndex > index ? 1 : 0})`,
                          }}
                        ></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Project Detail (Right Side) */}
              <div className="project-showcase">
                {renderShowcaseCard(activeProject, true)}
              </div>
            </div>

            {/* Vertical Progress Indicator */}
            <div className="scroll-progress">
              <div
                className="progress-bar"
                style={{ height: `${scrollProgress * 100}%` }}
              ></div>
              <div className="progress-dots">
                {allProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className={`progress-dot ${safeActiveIndex >= index ? 'active' : ''}`}
                    onClick={() => handleProjectClick(index)}
                    role="button"
                    tabIndex={0}
                    aria-label={t('aria.selectProject', { title: project.title })}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        handleProjectClick(index);
                      }
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Scroll Hint */}
        <div className={`scroll-hint ${scrollProgress > 0.1 || isMobile ? 'hidden' : ''}`}>
          <span className="hint-text">{t('hints.scroll')}</span>
          <div className="hint-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5L12 19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

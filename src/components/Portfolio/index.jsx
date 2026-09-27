import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useLocaleNavigation from '../../hooks/useLocaleNavigation';
import i18n from '../../i18n';
import { trackProjectClick } from '../../utils/analytics';
import enProjects from '../../i18n/locales/en/projects.json';
import viProjects from '../../i18n/locales/vi/projects.json';
import './styles/Gallery.css';
import { learnsprint } from '../../data/learnsprint';

// Import project images
import prj1 from '../../images/project/prj1.webp';
import prj10 from '../../images/project/prj10.webp';
import visionKey from '../../images/project/visionKey.webp';
import agriTrace from '../../images/project/agritrace.webp';
import chongScam from '../../images/project/chongscam.webp';
import routeLab from '../../images/project/routelab.webp';

i18n.addResourceBundle('en', 'projects', enProjects, true, true);
i18n.addResourceBundle('vi', 'projects', viProjects, true, true);

const projectCatalog = [
    learnsprint,
    {
      id: "oakmind",
      image: "/images/projects/gallery/oakmind-cover.webp",
      capture: "/images/projects/gallery/oakmind-capture.png",
      demo: "https://oakmindgroup.com/",
      technologies: ["React 19", "ASP.NET Core 8", "SQL Server", "Cloudflare R2"],
      badge: true,
      company: "OAKMIND GROUP",
      year: "2026",
      group: "client"
    },
    {
      id: "greatLinkMaiHouse",
      image: "/images/projects/gallery/greatlink-cover.webp",
      capture: "/images/projects/gallery/greatlink-capture.png",
      demo: "https://greatlinkmaihouse.com/",
      technologies: ["React", "ASP.NET Core", "SQL Server", "SignalR"],
      badge: true,
      company: "OAKMIND GROUP",
      year: "2025",
      group: "client"
    },
    {
      id: "educationEnglish",
      image: "/images/projects/gallery/education-cover.webp",
      capture: "/images/projects/gallery/education-capture.png",
      demo: "https://ech.edu.vn",
      technologies: ["ASP.NET Core", "EF Core", "SQL Server", "QuestPDF"],
      company: "ECH COMMUNITY",
      year: "2024",
      group: "client"
    },
    {
      id: "vnMediaHub",
      image: "/images/projects/gallery/vnmedia-cover.webp",
      capture: "/images/projects/gallery/vnmedia-capture.png",
      demo: "https://vnmediahub.com",
      technologies: ["React", "ASP.NET Core", "SQL Server", "Redis"],
      company: "OAKMIND GROUP",
      year: "2024",
      group: "client"
    },
    {
      id: "securityLab",
      image: "/images/projects/rat-security-lab.svg",
      caseStudy: "/projects/security-lab",
      github: "https://github.com/xuanhai0913/RAT-HAILAMDEV",
      technologies: ["Python", "TLS 1.3", "TCP Sockets", "JSON"],
      badge: true,
      company: "SECURITY RESEARCH",
      year: "2026",
      group: "pet"
    },
    {
      id: "sqliLab",
      image: "/images/projects/web-security-labs.svg",
      caseStudy: "/security?topic=sqli",
      github: "https://github.com/xuanhai0913/SQLI-HAILAMDEV",
      technologies: ["Python", "SQL", "Flask"],
      badge: true,
      company: "SECURITY RESEARCH",
      year: "2026",
      group: "pet"
    },
    {
      id: "xssLab",
      image: "/images/projects/web-security-labs.svg",
      caseStudy: "/security?topic=xss",
      github: "https://github.com/xuanhai0913/klg-xss-hailamdev",
      technologies: ["Python", "JavaScript", "Flask"],
      badge: true,
      company: "SECURITY RESEARCH",
      year: "2026",
      group: "pet"
    },
    {
      id: "ddosLab",
      image: "/images/projects/ddos-lab.svg",
      github: "https://github.com/xuanhai0913/DDOS-HAILAMDEV",
      technologies: ["Python", "asyncio", "Traffic Analysis"],
      badge: true,
      company: "SECURITY RESEARCH",
      year: "2026",
      group: "pet"
    },
    {
      id: "malwareLab",
      image: "/images/projects/malware-lab.svg",
      github: "https://github.com/xuanhai0913/Malware-HAILAMDEV",
      technologies: ["Python", "LIEF", "Capstone", "Static Analysis"],
      badge: true,
      company: "SECURITY RESEARCH",
      year: "2026",
      group: "pet"
    },
    {
      id: "chongScam",
      image: chongScam,
      demo: "https://chongscam.vn/",
      technologies: ["React 19", "NestJS 11", "PostgreSQL", "Jest"],
      badge: true,
      company: "INDEPENDENT BUILD",
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
      company: "INDEPENDENT BUILD",
      year: "2026",
      group: "pet"
    },
    {
      id: "agriTrace",
      image: agriTrace,
      github: "https://github.com/xuanhai0913/agri-traceability-system",
      technologies: ["React", "Express", "PostgreSQL", "Solidity"],
      badge: true,
      company: "INDEPENDENT BUILD",
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
      company: "INDEPENDENT BUILD",
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
      company: "INDEPENDENT BUILD",
      year: "2025",
      group: "pet"
    },
    {
      id: "portfolioWebsite",
      image: prj1,
      demo: "https://my-portfolio-nxh.vercel.app/",
      github: "https://github.com/xuanhai0913/My-Portfolio-NXH",
      technologies: ["React", "GSAP", "CSS3"],
      company: "INDEPENDENT BUILD",
      year: "2024",
      group: "pet"
    }
];


const selectedIds = ['oakmind', 'greatLinkMaiHouse', 'educationEnglish', 'vnMediaHub'];
const galleryCopy = {
  en: { eyebrow: 'SELECTED WORK', title: 'Built for the real world.', intro: 'A selection of client platforms and independent products.', selected: 'Selected', all: 'All projects', details: 'View contribution', original: 'Original screenshot', more: 'Explore all', count: 'projects', security: 'Security research', competitions: 'Competition projects', role: 'My role', outcome: 'Contribution & outcome', stack: 'Technology', live: 'Live site', source: 'Source code', study: 'Case study', video: 'Watch demo', submission: 'Submission', covers: 'Presentation covers based on live website captures. Original screenshots are available in each project.' },
  vi: { eyebrow: 'DỰ ÁN CHỌN LỌC', title: 'Từ ý tưởng đến thực tế.', intro: 'Một số nền tảng khách hàng và sản phẩm tôi tự phát triển.', selected: 'Chọn lọc', all: 'Tất cả', details: 'Xem đóng góp', original: 'Ảnh chụp gốc', more: 'Khám phá toàn bộ', count: 'dự án', security: 'Nghiên cứu bảo mật', competitions: 'Dự án cuộc thi', role: 'Vai trò của tôi', outcome: 'Đóng góp & kết quả', stack: 'Công nghệ', live: 'Website', source: 'Mã nguồn', study: 'Case study', video: 'Xem demo', submission: 'Bài dự thi', covers: 'Ảnh trình bày dựa trên giao diện website đang chạy. Có thể xem ảnh chụp gốc trong từng dự án.' },
};

function ProjectCard({ project, text, t, localizePath }) {
  const title = t(`items.${project.id}.title`);
  const links = [
    project.caseStudy && { href: project.caseStudy, label: text.study, type: 'case-study' },
    project.video && { href: project.video, label: text.video, type: 'video' },
    project.submission && { href: project.submission, label: text.submission, type: 'devpost' },
    project.demo && { href: project.demo, label: text.live, type: 'demo' },
    project.github && { href: project.github, label: text.source, type: 'github' },
    ...(project.githubLinks || []).map(link => ({ href: link.url, label: link.label, type: 'github' })),
  ].filter(Boolean);
  return <article className="work-card">
    <div className={`work-image ${project.capture ? 'work-image-framed' : ''}`}>
      {project.capture ? <img className="work-backdrop" src={project.image} alt="" aria-hidden="true" loading="lazy" decoding="async" width="1536" height="1024" /> : null}
      <img className="work-screenshot" src={project.capture || project.image} alt={t('aria.preview', { title })} loading="lazy" decoding="async" width="1536" height="1024" />
      <span className="work-year">{project.year}</span>
    </div>
    <div className="work-card-heading">
      <h3>{title}</h3>
      <p>{t(`items.${project.id}.role`)}</p>
    </div>
    <details className="work-details">
      <summary>{text.details}<span aria-hidden="true">+</span></summary>
      <div className="work-detail-body">
        <p>{t(`items.${project.id}.description`)}</p>
        <h4>{text.outcome}</h4>
        <p>{t(`items.${project.id}.achievement`)}</p>
        <ul className="work-stack" aria-label={text.stack}>{project.technologies.map(tech => <li key={tech}>{tech}</li>)}</ul>
        <div className="work-links">
          {links.map(link => <a key={link.href} href={link.href.startsWith('/') ? localizePath(link.href) : link.href}
            target={link.href.startsWith('/') ? undefined : '_blank'} rel={link.href.startsWith('/') ? undefined : 'noopener noreferrer'}
            onClick={() => trackProjectClick(title, link.type)}>{link.label}<span aria-hidden="true"> ↗</span></a>)}
          {project.capture ? <a href={project.capture} target="_blank" rel="noopener noreferrer">{text.original}</a> : null}
        </div>
      </div>
    </details>
  </article>;
}

export default function Portfolio() {
  const { t } = useTranslation('projects');
  const { locale, localizePath } = useLocaleNavigation();
  const [group, setGroup] = useState('selected');
  const text = galleryCopy[locale] || galleryCopy.en;
  const projects = group === 'selected'
    ? selectedIds.map(id => projectCatalog.find(project => project.id === id))
    : projectCatalog.filter(project => group === 'all' || project.group === group);
  return <section id="portfolio" className="work-gallery" aria-labelledby="portfolio-title">
    <div className="work-shell">
      <header className="work-heading">
        <p className="work-eyebrow">{text.eyebrow}</p>
        <h2 id="portfolio-title">{text.title}</h2>
        <p>{text.intro}</p>
      </header>
      <div className="work-filters" role="group" aria-label={t('aria.projectGroups')}>
        {['selected', 'client', 'pet', 'all'].map(key => <button key={key} type="button" aria-pressed={group === key} onClick={() => setGroup(key)}>
          {key === 'selected' ? text.selected : key === 'all' ? text.all : t(`groups.${key}`)}
        </button>)}
      </div>
      <p className="work-result-count" aria-live="polite">{projects.length} / {projectCatalog.length} {text.count}</p>
      <div className="work-grid">
        {projects.map(project => <ProjectCard key={project.id} project={project} text={text} t={t} localizePath={localizePath} />)}
      </div>
      <footer className="work-footer">
        {group !== 'all' ? <button type="button" onClick={() => setGroup('all')}>{text.more} {projectCatalog.length} {text.count}<span aria-hidden="true"> ↗</span></button> : null}
        <div><a href={localizePath('/security')}>{text.security}</a><a href={localizePath('/competitions')}>{text.competitions}</a></div>
        <p>{text.covers}</p>
      </footer>
    </div>
  </section>;
}

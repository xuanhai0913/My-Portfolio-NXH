const SITE_URL = 'https://my-portfolio-nxh.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/images/og-image.jpg`;

export const defaultMetaTags = {
  title: 'Nguyễn Xuân Hải | Full-Stack Developer in Ho Chi Minh City',
  description: 'Full-Stack Developer building production React, ASP.NET Core, NestJS and Odoo systems. Explore verified client work, engineering projects and credentials.',
  image: DEFAULT_IMAGE,
  url: `${SITE_URL}/`,
  type: 'website'
};

const localizedPages = {
  en: {
    portfolio: {
      title: 'Nguyễn Xuân Hải | Full-Stack Developer in Ho Chi Minh City',
      description: 'Full-Stack Developer building production React, ASP.NET Core, NestJS and Odoo systems. Explore verified client work, engineering projects and credentials.',
      keywords: 'Nguyễn Xuân Hải, Full-Stack Developer Ho Chi Minh City, React Developer, ASP.NET Core, NestJS, Odoo Developer'
    },
    assistant: {
      title: 'Portfolio AI Assistant | Nguyễn Xuân Hải',
      description: 'Ask Nguyễn Xuân Hải’s portfolio assistant about verified skills, production projects, work experience, credentials and contact details.',
      keywords: 'developer portfolio assistant, Nguyễn Xuân Hải experience, developer projects'
    },
    videos: {
      title: 'Software Project Demos | Nguyễn Xuân Hải',
      description: 'Watch concise demonstrations of web, AI and software engineering projects built by Full-Stack Developer Nguyễn Xuân Hải.',
      keywords: 'software project demos, React portfolio, AI development demos'
    },
    tools: {
      title: 'AI Engineering Tools | Nguyễn Xuân Hải',
      description: 'Try practical AI engineering tools for unit-test drafting, repository analysis, incident diagnosis and agent workflow design.',
      keywords: 'AI developer tools, unit test generator, repository analysis, incident analysis, agent workflow'
    },
    threeD: {
      title: 'Interactive 3D Web Experience | Nguyễn Xuân Hải',
      description: 'An experimental Three.js and WebGL experience by Full-Stack Developer Nguyễn Xuân Hải.',
      keywords: 'Three.js, WebGL, interactive developer portfolio'
    },
    blog: {
      title: 'Software Engineering Notes | Nguyễn Xuân Hải',
      description: 'Practical notes about React, ASP.NET Core, AI integration, web performance and shipping production software.',
      keywords: 'software engineering blog, React, ASP.NET Core, AI integration, web performance'
    }
  },
  vi: {
    portfolio: {
      title: 'Nguyễn Xuân Hải | Lập trình viên Full-Stack tại TP.HCM',
      description: 'Lập trình viên Full-Stack xây dựng hệ thống production với React, ASP.NET Core, NestJS và Odoo. Xem dự án thực tế, kinh nghiệm và chứng chỉ.',
      keywords: 'Nguyễn Xuân Hải, lập trình viên Full-Stack TP.HCM, React, ASP.NET Core, NestJS, Odoo'
    },
    assistant: {
      title: 'Trợ lý AI Portfolio | Nguyễn Xuân Hải',
      description: 'Hỏi trợ lý portfolio về kỹ năng, dự án production, kinh nghiệm, chứng chỉ và thông tin liên hệ của Nguyễn Xuân Hải.',
      keywords: 'trợ lý portfolio, kinh nghiệm Nguyễn Xuân Hải, dự án lập trình'
    },
    videos: {
      title: 'Video dự án phần mềm | Nguyễn Xuân Hải',
      description: 'Xem video ngắn giới thiệu các dự án web, AI và kỹ thuật phần mềm do Nguyễn Xuân Hải phát triển.',
      keywords: 'video dự án phần mềm, portfolio React, dự án AI'
    },
    tools: {
      title: 'Bộ công cụ AI cho lập trình viên | Nguyễn Xuân Hải',
      description: 'Trải nghiệm công cụ AI hỗ trợ tạo unit test, phân tích repository, chẩn đoán sự cố và thiết kế quy trình agent.',
      keywords: 'công cụ AI lập trình, tạo unit test, phân tích source code, AI agent'
    },
    threeD: {
      title: 'Trải nghiệm web 3D | Nguyễn Xuân Hải',
      description: 'Trải nghiệm Three.js và WebGL thử nghiệm được xây dựng bởi lập trình viên Full-Stack Nguyễn Xuân Hải.',
      keywords: 'Three.js, WebGL, portfolio lập trình viên'
    },
    blog: {
      title: 'Ghi chú kỹ thuật phần mềm | Nguyễn Xuân Hải',
      description: 'Chia sẻ thực tế về React, ASP.NET Core, tích hợp AI, hiệu năng web và quy trình đưa phần mềm lên production.',
      keywords: 'blog kỹ thuật phần mềm, React, ASP.NET Core, tích hợp AI, hiệu năng web'
    }
  }
};

const toolSeo = {
  testforge: {
    en: {
      title: 'TestForge AI - Unit Test Drafting Tool | Nguyễn Xuân Hải',
      description: 'Draft coverage-focused Jest, Vitest, Pytest or xUnit tests, edge cases and dependency-mocking notes from source code.'
    },
    vi: {
      title: 'TestForge AI - Công cụ tạo Unit Test | Nguyễn Xuân Hải',
      description: 'Tạo bản nháp Jest, Vitest, Pytest hoặc xUnit, kèm edge case và gợi ý mock dependency từ source code.'
    }
  },
  repolens: {
    en: {
      title: 'RepoLens AI - Repository Analysis Tool | Nguyễn Xuân Hải',
      description: 'Turn repository context into an architecture map, dependency risks and an actionable implementation plan.'
    },
    vi: {
      title: 'RepoLens AI - Công cụ phân tích Repository | Nguyễn Xuân Hải',
      description: 'Chuyển ngữ cảnh repository thành sơ đồ kiến trúc, rủi ro dependency và kế hoạch triển khai có thể thực hiện.'
    }
  },
  incidentlens: {
    en: {
      title: 'IncidentLens - Log and Incident Analysis | Nguyễn Xuân Hải',
      description: 'Organize logs and stack traces into likely root causes, supporting evidence, verification steps and recovery actions.'
    },
    vi: {
      title: 'IncidentLens - Phân tích Log và Sự cố | Nguyễn Xuân Hải',
      description: 'Phân tích log và stack trace thành nguyên nhân khả dĩ, bằng chứng, bước xác minh và hành động khắc phục.'
    }
  },
  agentflow: {
    en: {
      title: 'AgentFlow Studio - AI Agent Workflow Designer | Nguyễn Xuân Hải',
      description: 'Design a reviewable multi-agent workflow with explicit roles, dependencies, handoffs and quality gates.'
    },
    vi: {
      title: 'AgentFlow Studio - Thiết kế quy trình AI Agent | Nguyễn Xuân Hải',
      description: 'Thiết kế quy trình multi-agent có vai trò, dependency, điểm bàn giao và quality gate rõ ràng.'
    }
  }
};

const normalizePath = (pathname = '/') => {
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '');
  return cleanPath || '/';
};

const getRouteDetails = (pathname) => {
  const path = normalizePath(pathname);
  const locale = /^\/vi(?:\/|$)/.test(path) ? 'vi' : 'en';
  const route = path.replace(/^\/vi(?=\/|$)/, '') || '/';
  let page = 'portfolio';

  if (route.startsWith('/assistant')) page = 'assistant';
  else if (route.startsWith('/videos')) page = 'videos';
  else if (route.startsWith('/tools')) page = 'tools';
  else if (route.startsWith('/3d')) page = 'threeD';
  else if (route.startsWith('/blog')) page = 'blog';

  return { locale, page, path, route };
};

export const getRouteMeta = (pathname = '/') => {
  const legacyPaths = {
    home: '/',
    portfolio: '/',
    assistant: '/assistant',
    videos: '/videos',
    tools: '/tools',
    threeD: '/3d',
    '3d': '/3d',
    blog: '/blog'
  };
  const resolvedPathname = pathname.startsWith('/') ? pathname : (legacyPaths[pathname] || '/');
  const details = getRouteDetails(resolvedPathname);
  const toolSlug = details.route.match(/^\/tools\/([^/]+)$/)?.[1];
  const routeMeta = toolSlug && toolSeo[toolSlug]?.[details.locale];
  const pageMeta = {
    ...localizedPages[details.locale][details.page],
    ...routeMeta
  };
  const canonicalPath = details.path === '/' ? '/' : details.path;
  const alternatePath = details.route === '/' ? '' : details.route;
  const englishUrl = `${SITE_URL}${alternatePath || '/'}`;
  const vietnameseUrl = `${SITE_URL}/vi${alternatePath}`;

  return {
    ...pageMeta,
    ...details,
    url: `${SITE_URL}${canonicalPath}`,
    englishUrl,
    vietnameseUrl,
    image: DEFAULT_IMAGE,
    toolSlug,
    robots: details.page === 'threeD' || (toolSlug && !toolSeo[toolSlug])
      ? 'noindex, follow'
      : 'index, follow'
  };
};

export const updateMetaTags = (pathname = window.location.pathname) => {
  const meta = getRouteMeta(pathname);

  document.title = meta.title;
  document.documentElement.lang = meta.locale;
  updateMetaTag('name', 'description', meta.description);
  updateMetaTag('name', 'keywords', meta.keywords);
  updateMetaTag('name', 'robots', meta.robots);
  updateMetaTag('name', 'language', meta.locale === 'vi' ? 'Vietnamese' : 'English');
  updateMetaTag('property', 'og:title', meta.title);
  updateMetaTag('property', 'og:description', meta.description);
  updateMetaTag('property', 'og:url', meta.url);
  updateMetaTag('property', 'og:locale', meta.locale === 'vi' ? 'vi_VN' : 'en_US');
  updateMetaTag('name', 'twitter:title', meta.title);
  updateMetaTag('name', 'twitter:description', meta.description);
  updateMetaTag('name', 'twitter:url', meta.url);
  updateCanonicalUrl(meta.url);
  updateAlternateUrl('en', meta.englishUrl);
  updateAlternateUrl('vi', meta.vietnameseUrl);
  updateAlternateUrl('x-default', meta.englishUrl);
  generateStructuredData(meta);
};

// Helper function to update meta tags
const updateMetaTag = (attribute, name, content) => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
};

// Update canonical URL
const updateCanonicalUrl = (url) => {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', url);
  } else {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', url);
    document.head.appendChild(canonical);
  }
};

const updateAlternateUrl = (language, url) => {
  let alternate = document.querySelector(`link[rel="alternate"][hreflang="${language}"]`);
  if (!alternate) {
    alternate = document.createElement('link');
    alternate.rel = 'alternate';
    alternate.hreflang = language;
    document.head.appendChild(alternate);
  }
  alternate.href = url;
};

export const generateStructuredData = (metaOrPage = getRouteMeta()) => {
  const meta = typeof metaOrPage === 'string'
    ? getRouteMeta(metaOrPage.startsWith('/') ? metaOrPage : '/')
    : metaOrPage;
  const pageTypes = {
    portfolio: 'ProfilePage',
    assistant: 'WebApplication',
    videos: 'CollectionPage',
    tools: meta.toolSlug ? 'SoftwareApplication' : 'CollectionPage',
    threeD: 'WebPage',
    blog: 'Blog'
  };

  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': pageTypes[meta.page] || 'WebPage',
    '@id': `${meta.url}#webpage`,
    name: meta.title,
    description: meta.description,
    url: meta.url,
    image: DEFAULT_IMAGE,
    inLanguage: meta.locale === 'vi' ? 'vi-VN' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Nguyễn Xuân Hải Portfolio',
      url: `${SITE_URL}/`
    },
    about: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'Nguyễn Xuân Hải',
      jobTitle: 'Full-Stack Developer',
      url: `${SITE_URL}/`
    },
    dateModified: '2026-07-28'
  };

  if (meta.page === 'assistant' || meta.toolSlug) {
    baseStructuredData.applicationCategory = 'BusinessApplication';
    baseStructuredData.operatingSystem = 'Web';
    baseStructuredData.offers = {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    };
  }

  let structuredDataScript = document.querySelector('script[type="application/ld+json"][data-page]');
  if (structuredDataScript) {
    structuredDataScript.textContent = JSON.stringify(baseStructuredData);
  } else {
    structuredDataScript = document.createElement('script');
    structuredDataScript.type = 'application/ld+json';
    structuredDataScript.setAttribute('data-page', meta.page);
    structuredDataScript.textContent = JSON.stringify(baseStructuredData);
    document.head.appendChild(structuredDataScript);
  }
};

// Social media sharing URLs
export const getSocialShareUrls = (pathname = '/') => {
  const meta = getRouteMeta(pathname);
  const encodedUrl = encodeURIComponent(meta.url);
  const encodedTitle = encodeURIComponent(meta.title);
  const encodedDescription = encodeURIComponent(meta.description);

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`
  };
};

// Preload critical social media assets
export const preloadSocialAssets = () => {
  const assets = [
    defaultMetaTags.image,
    '/images/preview.png',
    '/favicon.ico'
  ];

  assets.forEach(asset => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = asset;
    document.head.appendChild(link);
  });
};

// Initialize meta tags on page load
export const initializeMetaTags = () => {
  updateMetaTags(window.location.pathname);

  // Add viewport meta for mobile optimization
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1, shrink-to-fit=no';
    document.head.appendChild(viewport);
  }
};

const metaTags = {
  defaultMetaTags,
  getRouteMeta,
  updateMetaTags,
  generateStructuredData,
  getSocialShareUrls,
  initializeMetaTags
};

export default metaTags;

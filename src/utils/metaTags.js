// Meta Tags Utility for Dynamic Social Media Optimization
// Utility functions to manage meta tags for different pages and social media platforms

export const defaultMetaTags = {
  title: "Nguyễn Xuân Hải - Full-Stack Developer Portfolio | React & Web Expert",
  description: "Full-Stack Developer specializing in React, Node.js, ASP.NET Core and modern web technologies. Explore my projects and professional skills.",
  image: "https://www.hailamdev.space/images/og-image.jpg",
  url: "https://www.hailamdev.space/",
  type: "website"
};

export const pageMetaTags = {
  home: {
    title: "Nguyễn Xuân Hải - Full-Stack Developer Portfolio",
    description: "Welcome to my portfolio. I'm a Full-Stack Developer specializing in React, Node.js, ASP.NET Core and modern web technologies.",
    keywords: "Full-Stack Developer, React Developer, Node.js Developer, ASP.NET Core, JavaScript Expert, Portfolio",
    url: "https://www.hailamdev.space/"
  },
  about: {
    title: "About Me - Nguyễn Xuân Hải | Full-Stack Developer",
    description: "Learn about my experience, skills and career journey in Full-Stack Development.",
    keywords: "About, Experience, Skills, Full-Stack Developer Career, React Expert",
    url: "https://www.hailamdev.space/#about"
  },
  portfolio: {
    title: "Projects - Portfolio | Nguyễn Xuân Hải",
    description: "Explore my web development and UI/UX design projects, from React applications to responsive websites, including commercial projects for Great Link Mai House.",
    keywords: "Portfolio, Projects, Web Development, React Projects, UI/UX Design, Commercial Projects, B2B Platform, Full-Stack",
    url: "https://www.hailamdev.space/#portfolio"
  },
  contact: {
    title: "Contact - Nguyễn Xuân Hải | Full-Stack Developer",
    description: "Get in touch to discuss web development projects, collaboration opportunities, or technical consulting.",
    keywords: "Contact, Hire Full-Stack Developer, React Developer Contact, Web Development Services",
    url: "https://www.hailamdev.space/#contact"
  },
  assistant: {
    title: "AI Assistant - Nguyễn Xuân Hải Portfolio",
    description: "Chat with an AI assistant powered by Gemini to learn about Nguyễn Xuân Hải's skills, projects, experience, and availability. Get instant answers about hiring and collaboration.",
    keywords: "AI Assistant, Portfolio Chatbot, Gemini AI, Developer Skills, Hire Developer, Interactive CV",
    url: "https://www.hailamdev.space/assistant"
  },
  videos: {
    title: "Project Demos - Nguyễn Xuân Hải Portfolio",
    description: "Watch video demonstrations of projects including LLM Unit Test Generator, AI integrations, and web application showcases.",
    keywords: "Project Demos, Video Portfolio, LLM Unit Test Generator, AI Development, Code Demos",
    url: "https://www.hailamdev.space/videos"
  },
  "3d": {
    title: "3D Experience - Nguyễn Xuân Hải Portfolio",
    description: "Interactive 3D experience built with Three.js showcasing creative web development and WebGL capabilities.",
    keywords: "Three.js, 3D Web, WebGL, Interactive Experience, Creative Development, 3D Portfolio",
    url: "https://www.hailamdev.space/3d"
  }
};

// Update document meta tags
export const updateMetaTags = (pageName = 'home') => {
  const meta = pageMetaTags[pageName] || pageMetaTags.home;

  // Update title
  document.title = meta.title;

  // Update meta description
  updateMetaTag('name', 'description', meta.description);
  updateMetaTag('name', 'keywords', meta.keywords);

  // Update Open Graph tags
  updateMetaTag('property', 'og:title', meta.title);
  updateMetaTag('property', 'og:description', meta.description);
  updateMetaTag('property', 'og:url', meta.url);

  // Update Twitter tags
  updateMetaTag('name', 'twitter:title', meta.title);
  updateMetaTag('name', 'twitter:description', meta.description);
  updateMetaTag('name', 'twitter:url', meta.url);

  // Update canonical URL
  updateCanonicalUrl(meta.url);
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

// Generate structured data for specific page
export const generateStructuredData = (pageName, additionalData = {}) => {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageMetaTags[pageName]?.title || defaultMetaTags.title,
    "description": pageMetaTags[pageName]?.description || defaultMetaTags.description,
    "url": pageMetaTags[pageName]?.url || defaultMetaTags.url,
    "image": defaultMetaTags.image,
    "author": {
      "@type": "Person",
      "name": "Nguyễn Xuân Hải",
      "url": "https://www.hailamdev.space"
    },
    "publisher": {
      "@type": "Person",
      "name": "Nguyễn Xuân Hải"
    },
    "mainEntity": {
      "@type": "Person",
      "name": "Nguyễn Xuân Hải",
      "jobTitle": "Full-Stack Developer",
      "worksFor": {
        "@type": "Organization",
        "name": "Freelancer"
      }
    },
    ...additionalData
  };

  // Update or create structured data script
  let structuredDataScript = document.querySelector('script[type="application/ld+json"][data-page]');
  if (structuredDataScript) {
    structuredDataScript.textContent = JSON.stringify(baseStructuredData);
  } else {
    structuredDataScript = document.createElement('script');
    structuredDataScript.type = 'application/ld+json';
    structuredDataScript.setAttribute('data-page', pageName);
    structuredDataScript.textContent = JSON.stringify(baseStructuredData);
    document.head.appendChild(structuredDataScript);
  }
};

// Social media sharing URLs
export const getSocialShareUrls = (pageName = 'home') => {
  const meta = pageMetaTags[pageName] || pageMetaTags.home;
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
  // Preload social assets
  preloadSocialAssets();

  // Set default meta tags
  updateMetaTags('home');
  generateStructuredData('home');

  // Add viewport meta for mobile optimization
  if (!document.querySelector('meta[name="viewport"]')) {
    const viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1, shrink-to-fit=no';
    document.head.appendChild(viewport);
  }
};

export default {
  defaultMetaTags,
  pageMetaTags,
  updateMetaTags,
  generateStructuredData,
  getSocialShareUrls,
  initializeMetaTags
};

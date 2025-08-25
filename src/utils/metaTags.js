// Meta Tags Utility for Dynamic Social Media Optimization
// Utility functions to manage meta tags for different pages and social media platforms

export const defaultMetaTags = {
  title: "Nguyễn Xuân Hải - Frontend Developer Portfolio | React & UI/UX Expert",
  description: "Frontend Developer chuyên về React, UI/UX và Web Development. Khám phá các dự án và kỹ năng chuyên môn của tôi trong lĩnh vực phát triển web.",
  image: "https://nxhai0913.me/images/og-image.jpg",
  url: "https://nxhai0913.me/",
  type: "website"
};

export const pageMetaTags = {
  home: {
    title: "Nguyễn Xuân Hải - Frontend Developer Portfolio",
    description: "Chào mừng đến với portfolio của tôi. Tôi là Frontend Developer chuyên về React, JavaScript và UI/UX Design.",
    keywords: "Frontend Developer, React Developer, UI/UX Designer, JavaScript Expert, Portfolio",
    url: "https://nxhai0913.me/"
  },
  about: {
    title: "Về tôi - Nguyễn Xuân Hải | Frontend Developer",
    description: "Tìm hiểu về kinh nghiệm, kỹ năng và hành trình phát triển sự nghiệp của tôi trong lĩnh vực Frontend Development.",
    keywords: "About, Experience, Skills, Frontend Developer Career, React Expert",
    url: "https://nxhai0913.me/#about"
  },
  portfolio: {
    title: "Dự án - Portfolio | Nguyễn Xuân Hải",
    description: "Khám phá các dự án web development và UI/UX design mà tôi đã thực hiện, từ ứng dụng React đến website responsive, bao gồm cả dự án thương mại cho Great Link Mai House.",
    keywords: "Portfolio, Projects, Web Development, React Projects, UI/UX Design, Commercial Projects, B2B Platform, Import-Export",
    url: "https://nxhai0913.me/#portfolio"
  },
  contact: {
    title: "Liên hệ - Nguyễn Xuân Hải | Frontend Developer",
    description: "Hãy liên hệ với tôi để thảo luận về các dự án web development, cơ hội hợp tác hoặc tư vấn kỹ thuật.",
    keywords: "Contact, Hire Frontend Developer, React Developer Contact, Web Development Services",
    url: "https://nxhai0913.me/#contact"
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
      "url": "https://nxhai0913.me"
    },
    "publisher": {
      "@type": "Person",
      "name": "Nguyễn Xuân Hải"
    },
    "mainEntity": {
      "@type": "Person",
      "name": "Nguyễn Xuân Hải",
      "jobTitle": "Frontend Developer",
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

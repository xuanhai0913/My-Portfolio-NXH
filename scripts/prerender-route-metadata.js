/*
 * CRA renders one client-side shell. This script creates route-specific copies
 * of that shell so crawlers and social preview bots receive the right title,
 * canonical URL, language, and description before JavaScript runs.
 */
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://my-portfolio-nxh.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/images/og-image.jpg`;
const OUTPUT_DIRECTORY = path.resolve(__dirname, '..', 'build');
const SOURCE_HTML_PATH = path.join(OUTPUT_DIRECTORY, 'index.html');
const SEO_DIRECTORY = path.join(OUTPUT_DIRECTORY, '_seo');

const routes = [
  {
    path: '/vi',
    file: 'vi.html',
    locale: 'vi',
    title: 'Nguyễn Xuân Hải | Lập trình viên Full-Stack tại TP.HCM',
    description: 'Lập trình viên Full-Stack xây dựng hệ thống production với React, ASP.NET Core, NestJS và Odoo. Xem dự án thực tế, kinh nghiệm và chứng chỉ.',
    keywords: 'Nguyễn Xuân Hải, lập trình viên Full-Stack TP.HCM, React, ASP.NET Core, NestJS, Odoo',
  },
  {
    path: '/assistant',
    file: 'assistant.html',
    locale: 'en',
    title: 'Portfolio AI Assistant | Nguyễn Xuân Hải',
    description: 'Ask Nguyễn Xuân Hải’s portfolio assistant about verified skills, production projects, work experience, credentials and contact details.',
    keywords: 'developer portfolio assistant, Nguyễn Xuân Hải experience, developer projects',
  },
  {
    path: '/vi/assistant',
    file: 'vi-assistant.html',
    locale: 'vi',
    title: 'Trợ lý AI Portfolio | Nguyễn Xuân Hải',
    description: 'Hỏi trợ lý portfolio về kỹ năng, dự án production, kinh nghiệm, chứng chỉ và thông tin liên hệ của Nguyễn Xuân Hải.',
    keywords: 'trợ lý portfolio, kinh nghiệm Nguyễn Xuân Hải, dự án lập trình',
  },
  {
    path: '/videos',
    file: 'videos.html',
    locale: 'en',
    title: 'Software Project Demos | Nguyễn Xuân Hải',
    description: 'Watch concise demonstrations of web, AI and software engineering projects built by Full-Stack Developer Nguyễn Xuân Hải.',
    keywords: 'software project demos, React portfolio, AI development demos',
  },
  {
    path: '/vi/videos',
    file: 'vi-videos.html',
    locale: 'vi',
    title: 'Video dự án phần mềm | Nguyễn Xuân Hải',
    description: 'Xem video ngắn giới thiệu các dự án web, AI và kỹ thuật phần mềm do Nguyễn Xuân Hải phát triển.',
    keywords: 'video dự án phần mềm, portfolio React, dự án AI',
  },
  {
    path: '/tools',
    file: 'tools.html',
    locale: 'en',
    title: 'AI Engineering Tools | Nguyễn Xuân Hải',
    description: 'Try practical AI engineering tools for unit-test drafting, repository analysis, incident diagnosis and agent workflow design.',
    keywords: 'AI developer tools, unit test generator, repository analysis, incident analysis, agent workflow',
  },
  {
    path: '/vi/tools',
    file: 'vi-tools.html',
    locale: 'vi',
    title: 'Bộ công cụ AI cho lập trình viên | Nguyễn Xuân Hải',
    description: 'Trải nghiệm công cụ AI hỗ trợ tạo unit test, phân tích repository, chẩn đoán sự cố và thiết kế quy trình agent.',
    keywords: 'công cụ AI lập trình, tạo unit test, phân tích source code, AI agent',
  },
  {
    path: '/tools/testforge',
    file: 'tools-testforge.html',
    locale: 'en',
    title: 'TestForge AI - Unit Test Drafting Tool | Nguyễn Xuân Hải',
    description: 'Draft coverage-focused Jest, Vitest, Pytest or xUnit tests, edge cases and dependency-mocking notes from source code.',
    keywords: 'AI developer tools, unit test generator, repository analysis, incident analysis, agent workflow',
  },
  {
    path: '/vi/tools/testforge',
    file: 'vi-tools-testforge.html',
    locale: 'vi',
    title: 'TestForge AI - Công cụ tạo Unit Test | Nguyễn Xuân Hải',
    description: 'Tạo bản nháp Jest, Vitest, Pytest hoặc xUnit, kèm edge case và gợi ý mock dependency từ source code.',
    keywords: 'công cụ AI lập trình, tạo unit test, phân tích source code, AI agent',
  },
  {
    path: '/tools/repolens',
    file: 'tools-repolens.html',
    locale: 'en',
    title: 'RepoLens AI - Repository Analysis Tool | Nguyễn Xuân Hải',
    description: 'Turn repository context into an architecture map, dependency risks and an actionable implementation plan.',
    keywords: 'AI developer tools, unit test generator, repository analysis, incident analysis, agent workflow',
  },
  {
    path: '/vi/tools/repolens',
    file: 'vi-tools-repolens.html',
    locale: 'vi',
    title: 'RepoLens AI - Công cụ phân tích Repository | Nguyễn Xuân Hải',
    description: 'Chuyển ngữ cảnh repository thành sơ đồ kiến trúc, rủi ro dependency và kế hoạch triển khai có thể thực hiện.',
    keywords: 'công cụ AI lập trình, tạo unit test, phân tích source code, AI agent',
  },
  {
    path: '/tools/incidentlens',
    file: 'tools-incidentlens.html',
    locale: 'en',
    title: 'IncidentLens - Log and Incident Analysis | Nguyễn Xuân Hải',
    description: 'Organize logs and stack traces into likely root causes, supporting evidence, verification steps and recovery actions.',
    keywords: 'AI developer tools, unit test generator, repository analysis, incident analysis, agent workflow',
  },
  {
    path: '/vi/tools/incidentlens',
    file: 'vi-tools-incidentlens.html',
    locale: 'vi',
    title: 'IncidentLens - Phân tích Log và Sự cố | Nguyễn Xuân Hải',
    description: 'Phân tích log và stack trace thành nguyên nhân khả dĩ, bằng chứng, bước xác minh và hành động khắc phục.',
    keywords: 'công cụ AI lập trình, tạo unit test, phân tích source code, AI agent',
  },
  {
    path: '/tools/agentflow',
    file: 'tools-agentflow.html',
    locale: 'en',
    title: 'AgentFlow Studio - AI Agent Workflow Designer | Nguyễn Xuân Hải',
    description: 'Design a reviewable multi-agent workflow with explicit roles, dependencies, handoffs and quality gates.',
    keywords: 'AI developer tools, unit test generator, repository analysis, incident analysis, agent workflow',
  },
  {
    path: '/vi/tools/agentflow',
    file: 'vi-tools-agentflow.html',
    locale: 'vi',
    title: 'AgentFlow Studio - Thiết kế quy trình AI Agent | Nguyễn Xuân Hải',
    description: 'Thiết kế quy trình multi-agent có vai trò, dependency, điểm bàn giao và quality gate rõ ràng.',
    keywords: 'công cụ AI lập trình, tạo unit test, phân tích source code, AI agent',
  },
  {
    path: '/blog',
    file: 'blog.html',
    locale: 'en',
    title: 'Software Engineering Notes | Nguyễn Xuân Hải',
    description: 'Practical notes about React, ASP.NET Core, AI integration, web performance and shipping production software.',
    keywords: 'software engineering blog, React, ASP.NET Core, AI integration, web performance',
  },
  {
    path: '/vi/blog',
    file: 'vi-blog.html',
    locale: 'vi',
    title: 'Ghi chú kỹ thuật phần mềm | Nguyễn Xuân Hải',
    description: 'Chia sẻ thực tế về React, ASP.NET Core, tích hợp AI, hiệu năng web và quy trình đưa phần mềm lên production.',
    keywords: 'blog kỹ thuật phần mềm, React, ASP.NET Core, tích hợp AI, hiệu năng web',
  },
  {
    path: '/3d',
    file: '3d.html',
    locale: 'en',
    title: 'Interactive 3D Web Experience | Nguyễn Xuân Hải',
    description: 'An experimental Three.js and WebGL experience by Full-Stack Developer Nguyễn Xuân Hải.',
    keywords: 'Three.js, WebGL, interactive developer portfolio',
    robots: 'noindex, follow',
  },
  {
    path: '/vi/3d',
    file: 'vi-3d.html',
    locale: 'vi',
    title: 'Trải nghiệm web 3D | Nguyễn Xuân Hải',
    description: 'Trải nghiệm Three.js và WebGL thử nghiệm được xây dựng bởi lập trình viên Full-Stack Nguyễn Xuân Hải.',
    keywords: 'Three.js, WebGL, portfolio lập trình viên',
    robots: 'noindex, follow',
  },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function replaceMeta(html, attribute, name, content) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${escapedName}["'][^>]*>`, 'i');
  const tag = `<meta ${attribute}="${name}" content="${escapeHtml(content)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n</head>`);
}

function replaceLink(html, rel, href, extraAttribute = '') {
  const pattern = new RegExp(`<link\\s+rel=["']${rel}["'][^>]*>`, 'i');
  const extra = extraAttribute ? ` ${extraAttribute}` : '';
  const tag = `<link rel="${rel}"${extra} href="${escapeHtml(href)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `  ${tag}\n</head>`);
}

function buildPageSchema(route, canonicalUrl) {
  const pageType = route.path.includes('/tools/')
    ? 'SoftwareApplication'
    : route.path.includes('/tools')
      ? 'CollectionPage'
      : route.path.includes('/assistant')
        ? 'WebApplication'
        : route.path.includes('/videos')
          ? 'CollectionPage'
          : route.path.includes('/blog')
            ? 'Blog'
            : 'WebPage';

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': pageType,
    '@id': `${canonicalUrl}#webpage`,
    name: route.title,
    description: route.description,
    url: canonicalUrl,
    image: DEFAULT_IMAGE,
    inLanguage: route.locale === 'vi' ? 'vi-VN' : 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'Nguyễn Xuân Hải Portfolio',
      url: `${SITE_URL}/`,
    },
  }).replace(/</g, '\\u003c');
}

function renderRouteHtml(sourceHtml, route) {
  const canonicalUrl = `${SITE_URL}${route.path}`;
  const routeWithoutLocale = route.path.replace(/^\/vi(?=\/|$)/, '') || '/';
  const englishUrl = `${SITE_URL}${routeWithoutLocale}`;
  const vietnameseUrl = `${SITE_URL}/vi${routeWithoutLocale === '/' ? '' : routeWithoutLocale}`;
  const robots = route.robots || 'index, follow';
  const language = route.locale === 'vi' ? 'Vietnamese' : 'English';
  const ogLocale = route.locale === 'vi' ? 'vi_VN' : 'en_US';

  let html = sourceHtml.replace(/<html\s+lang=["'][^"']*["']>/i, `<html lang="${route.locale}">`);
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);
  html = replaceMeta(html, 'name', 'title', route.title);
  html = replaceMeta(html, 'name', 'description', route.description);
  html = replaceMeta(html, 'name', 'keywords', route.keywords);
  html = replaceMeta(html, 'name', 'robots', robots);
  html = replaceMeta(html, 'name', 'language', language);
  html = replaceMeta(html, 'property', 'og:title', route.title);
  html = replaceMeta(html, 'property', 'og:description', route.description);
  html = replaceMeta(html, 'property', 'og:url', canonicalUrl);
  html = replaceMeta(html, 'property', 'og:locale', ogLocale);
  html = replaceMeta(html, 'name', 'twitter:title', route.title);
  html = replaceMeta(html, 'name', 'twitter:description', route.description);
  html = replaceMeta(html, 'name', 'twitter:url', canonicalUrl);
  html = replaceLink(html, 'canonical', canonicalUrl);
  html = html.replace(/<link\s+rel=["']alternate["']\s+hreflang=["']en["'][^>]*>/i, `<link rel="alternate" hreflang="en" href="${escapeHtml(englishUrl)}" />`);
  html = html.replace(/<link\s+rel=["']alternate["']\s+hreflang=["']vi["'][^>]*>/i, `<link rel="alternate" hreflang="vi" href="${escapeHtml(vietnameseUrl)}" />`);
  html = html.replace(/<link\s+rel=["']alternate["']\s+hreflang=["']x-default["'][^>]*>/i, `<link rel="alternate" hreflang="x-default" href="${escapeHtml(englishUrl)}" />`);

  const schema = `<script type="application/ld+json" data-prerendered-page>${buildPageSchema(route, canonicalUrl)}</script>`;
  return html.replace('</head>', `  ${schema}\n</head>`);
}

function generateMetadataShells() {
  if (!fs.existsSync(SOURCE_HTML_PATH)) {
    throw new Error(`Expected CRA output at ${SOURCE_HTML_PATH}`);
  }

  const sourceHtml = fs.readFileSync(SOURCE_HTML_PATH, 'utf8');
  fs.mkdirSync(SEO_DIRECTORY, { recursive: true });

  for (const route of routes) {
    const outputPath = path.join(SEO_DIRECTORY, route.file);
    fs.writeFileSync(outputPath, renderRouteHtml(sourceHtml, route));
  }

  return routes.length;
}

if (require.main === module) {
  console.log(`Generated ${generateMetadataShells()} route-specific metadata shells.`);
}

module.exports = {
  generateMetadataShells,
  renderRouteHtml,
  routes,
};

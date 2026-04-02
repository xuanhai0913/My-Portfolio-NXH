---
title: "My React Portfolio SEO Checklist: From 0 to Rich Results in 48 Hours"
published: true
description: "Complete SEO checklist for React SPAs — structured data, meta tags, robots.txt for AI bots, Core Web Vitals, and noscript fallbacks. Copy-paste ready."
tags: seo, react, webdev, javascript
cover_image: https://www.hailamdev.space/images/blog-seo-checklist-cover.png
canonical_url: https://www.hailamdev.space/blog/react-seo-checklist
---

## The Problem with React & SEO

Here's the dirty secret: **Google can render JavaScript.** But most developers still treat React SPAs as SEO-unfriendly. The real issue isn't rendering — it's the missing fundamentals.

I audited my portfolio at [hailamdev.space](https://www.hailamdev.space) and went from zero structured data to **passing Google's Rich Results Test** in 48 hours. Here's my exact checklist.

## The Complete Checklist

### 1. Meta Tags (index.html)

Every React SPA needs these in `public/index.html`:

```html
<!-- Primary Meta Tags -->
<title>Your Name — Role | Tech Stack</title>
<meta name="description" 
  content="[155 chars max] Specific description with keywords and metrics" />
<meta name="robots" content="index, follow" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://yourdomain.com/" />
<meta property="og:title" content="Same as title tag" />
<meta property="og:description" content="Same as meta description" />
<meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Same as title tag" />
<meta name="twitter:description" content="Same as meta description" />
<meta name="twitter:image" content="https://yourdomain.com/og-image.jpg" />

<!-- Canonical URL (prevents duplicate content) -->
<link rel="canonical" href="https://yourdomain.com/" />
```

**Pro tip:** Keep your title under 60 characters and description under 155 characters. Google truncates anything longer in SERPs.

### 2. Structured Data (JSON-LD) — The #1 Thing Most Portfolios Miss

Structured data tells Google exactly what your page is about. Without it, Google is guessing:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Your Name",
  "url": "https://yourdomain.com",
  "image": "https://yourdomain.com/images/profile.png",
  "jobTitle": "Fullstack Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Freelance"
  },
  "sameAs": [
    "https://github.com/yourusername",
    "https://www.linkedin.com/in/yourusername/",
    "https://dev.to/yourusername"
  ],
  "knowsAbout": ["React", ".NET Core", "Node.js", "AI Integration"],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Your City",
    "addressCountry": "Your Country"
  }
}
</script>
```

For my portfolio at [hailamdev.space](https://www.hailamdev.space), I added **6 schemas total**:

| Schema | Purpose |
|--------|---------|
| `Person` | My identity — name, role, skills, social profiles |
| `WebSite` | Site info + sitelinks search box eligibility |
| `BreadcrumbList` | Navigation paths for Google |
| `ProfilePage` | Signals this is a personal profile page |
| `ItemList` | Project listings structured as an ordered list |
| `FAQPage` | Common questions about my work (AI search gold mine) |

### 3. FAQPage Schema — The AI Search Secret Weapon

This is the most underrated SEO technique for 2025. AI search engines (ChatGPT, Perplexity, Google AI Overviews) extract FAQ content at **3x the rate** of regular paragraphs.

Why? Because FAQ format is already structured as question→answer pairs — exactly what AI models need.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What technologies does [Your Name] specialize in?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "I specialize in React, .NET Core, Node.js, and AI integration with Google Gemini and Deepseek LLM. I have shipped 9+ production projects including 3 commercial platforms in Vietnam."
      }
    },
    {
      "@type": "Question",
      "name": "How to add an AI chatbot to a React portfolio website?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "I integrated a Google Gemini-powered AI assistant into my React portfolio at hailamdev.space. The implementation uses the Gemini 2.0 API with a custom system prompt containing portfolio context, enabling visitors to ask about skills, projects, and availability in real-time."
      }
    },
    {
      "@type": "Question",
      "name": "What makes a good developer portfolio in 2025?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A standout developer portfolio in 2025 should include: real commercial projects with measurable impact, AI-powered interactive features, structured data for SEO, responsive design with smooth animations, and clear calls-to-action."
      }
    }
  ]
}
</script>
```

**The key insight:** Write each answer as a **self-contained, 40-60 word block**. This is the optimal length for AI citation according to the [Princeton GEO Study (KDD 2024)](https://arxiv.org/abs/2311.09735).

### 4. robots.txt — Don't Forget AI Bots

Most robots.txt files only handle Googlebot. In 2025, you need to explicitly allow AI search bots — otherwise they literally **cannot cite your work**:

```
User-agent: *
Allow: /

# Block sensitive paths
Disallow: /src/
Disallow: /node_modules/
Disallow: /.git/
Disallow: /.env

# ============================================
# AI Search Bots — Allow for citation
# ============================================

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Bingbot
Allow: /

# Sitemap
Sitemap: https://yourdomain.com/sitemap.xml
```

Many developers don't realize: if your `robots.txt` blocks `GPTBot` (some default configs do), then **ChatGPT will never cite your portfolio** — no matter how great your content is.

### 5. XML Sitemap

For a React SPA with few routes, keep it simple:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2025-04-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://yourdomain.com/images/og-image.jpg</image:loc>
      <image:title>Your Portfolio Preview</image:title>
      <image:caption>Portfolio showcasing React, .NET and AI projects</image:caption>
    </image:image>
  </url>

  <!-- Add each real route -->
  <url>
    <loc>https://yourdomain.com/assistant</loc>
    <lastmod>2025-04-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

</urlset>
```

Submit this through [Google Search Console](https://search.google.com/search-console) for fastest indexing.

### 6. Noscript Fallback — Your SEO Safety Net

Google can render JavaScript… *usually*. But it uses a two-phase indexing process: crawl → render queue → index. The render queue can take **days**.

A `<noscript>` fallback gives crawlers your **full content immediately**:

```html
<noscript>
  <header>
    <h1>Your Name — Fullstack Developer</h1>
    <nav>
      <a href="#about">About</a> |
      <a href="#portfolio">Portfolio</a> |
      <a href="#contact">Contact</a>
    </nav>
  </header>
  
  <main>
    <section id="about">
      <h2>About Me</h2>
      <p>Your Name is a Full-Stack Developer based in Your City,
         specializing in React, .NET Core, and AI integration.
         9+ projects shipped to production.</p>
    </section>
    
    <section id="portfolio">
      <h2>Projects</h2>
      <article>
        <h3>Project Name</h3>
        <p>Description. Technologies: React, .NET Core, SQL Server.</p>
        <a href="https://project-url.com">Visit Site</a>
      </article>
      <!-- Repeat for ALL projects -->
    </section>
    
    <section id="contact">
      <h2>Contact</h2>
      <ul>
        <li>Email: <a href="mailto:you@email.com">you@email.com</a></li>
        <li>LinkedIn: <a href="https://linkedin.com/in/you">linkedin.com/in/you</a></li>
        <li>GitHub: <a href="https://github.com/you">github.com/you</a></li>
      </ul>
    </section>
  </main>
</noscript>
```

**Important:** This must contain your **complete portfolio content** — not just "Enable JavaScript to view this site." Every section, every project, every link.

### 7. Image Alt Texts — Small Change, Big Impact

Every `<img>` tag needs a **descriptive** alt text. Not just the filename or project name:

```text
// Bad — meaningless to search engines
<img src="screenshot.png" alt="screenshot" />
<img src="project-img.png" alt="Project Title" />

// Good — descriptive, includes technology keywords
<img 
  src="project-img.png" 
  alt="Great Link Mai House — ASP.NET Core, SQL Server, C# project screenshot" 
/>
```

In React/JSX, you can dynamically generate descriptive alt text:

```javascript
// Dynamic alt text with project name + technologies
const altText = `${project.title} — ${project.technologies.join(', ')} project screenshot`;
// Output: "Great Link Mai House — ASP.NET Core, SQL Server, C# project screenshot"
```

This small change has **two benefits**:
1. Google Image Search can now index your project screenshots
2. Visually impaired users using screen readers get useful descriptions

### 8. Performance: Preload & Preconnect

Slow sites rank lower. These `<link>` tags in `<head>` make critical resources load faster:

```html
<!-- Preconnect to CDNs you depend on -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://res.cloudinary.com">

<!-- Preload your hero/LCP image -->
<link rel="preload" as="image" href="/images/hero.webp">

<!-- Defer non-critical CSS (like icon fonts) -->
<link rel="stylesheet" 
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      media="print" 
      onload="this.media='all'" />
```

The `media="print" onload="this.media='all'"` trick defers CSS loading without blocking the initial render. This technique alone improved my LCP by **0.8 seconds**.

### 9. Bilingual hreflang Tags

If your portfolio targets multiple language audiences (like mine — Vietnamese + English):

```html
<link rel="alternate" hreflang="en" href="https://yourdomain.com/" />
<link rel="alternate" hreflang="vi" href="https://yourdomain.com/" />
<link rel="alternate" hreflang="x-default" href="https://yourdomain.com/" />
```

This tells Google: "This page serves both English and Vietnamese speakers." Without it, Google might only index your page for one language.

### 10. AI-Extractable Content Blocks

This is my personal addition based on the [Princeton GEO study](https://arxiv.org/abs/2311.09735). Write key content blocks in **third person** and **self-contained**:

```text
Bad — First person, AI can't extract without context:
"I build production web apps with React and .NET Core."

Good — Third person, self-contained, AI can cite this standalone:
"Nguyễn Xuân Hải is a Full-Stack Developer based in Ho Chi Minh City, 
Vietnam, specializing in React, .NET Core, and AI integration. 
He has shipped 9+ production projects, including 3 commercial platforms."
```

Why third person? When ChatGPT or Perplexity extracts your content, they need text that makes sense **without** your page context. "I build apps" means nothing out of context. "Nguyễn Xuân Hải builds apps" is instantly citable.

## My Results After 48 Hours

| Test | Before | After |
|------|--------|-------|
| Google Rich Results Test | Fail | 6 schemas valid |
| Lighthouse SEO Score | 82 | 100 |
| Structured Data Schemas | 0 | 6 (Person, WebSite, FAQ, etc.) |
| AI Bot Access (robots.txt) | 0 bots | 7 bots explicitly allowed |
| Noscript Fallback | None | Full content (8 projects, bio, contact) |
| Image Alt Coverage | ~60% | 100% |
| OG/Twitter Preview | Broken | Rich preview on all platforms |
| hreflang Tags | None | 3 (en, vi, x-default) |

## The Order Matters

If you're starting from scratch, do these in order:

```
1. Meta tags + OG tags        → 30 minutes
2. JSON-LD Person schema      → 30 minutes  
3. FAQPage schema             → 20 minutes
4. robots.txt (with AI bots)  → 10 minutes
5. XML sitemap                → 15 minutes
6. Noscript fallback          → 45 minutes (longest, most tedious)
7. Image alt texts            → 20 minutes
8. Preload/preconnect         → 10 minutes
9. hreflang                   → 5 minutes
10. AI-extractable blocks     → 30 minutes
═══════════════════════════════════════
Total:                        ~3.5 hours
```

You can do this in a single afternoon. No excuses.

## Tools to Validate

After implementing, test with these free tools:

| Tool | What It Tests | URL |
|------|--------------|-----|
| **Google Rich Results Test** | Structured data validity | [search.google.com/test/rich-results](https://search.google.com/test/rich-results) |
| **PageSpeed Insights** | Core Web Vitals | [pagespeed.web.dev](https://pagespeed.web.dev) |
| **Google Search Console** | Indexing status | [search.google.com/search-console](https://search.google.com/search-console) |
| **Meta Tags Debugger** | OG/Twitter preview | [metatags.io](https://metatags.io) |
| **Schema Markup Validator** | JSON-LD syntax | [validator.schema.org](https://validator.schema.org) |

## FAQ

**Q: Does Google actually index React single-page applications?**

A: Yes, Googlebot can render JavaScript since 2019. However, it uses a two-phase indexing process — crawl first, then queue for rendering, then index. This render queue can delay indexing by hours or days. Adding a noscript fallback with full content gives crawlers your content immediately without waiting, resulting in faster indexing and more reliable coverage.

**Q: How many JSON-LD schemas should a developer portfolio have?**

A: For a developer portfolio, I recommend 5-6 schemas: Person (your identity), WebSite (site metadata), ProfilePage (page type signal), ItemList (your projects as a structured list), FAQPage (common questions for AI search extraction), and optionally BreadcrumbList for navigation. Each schema helps both Google and AI search engines understand different aspects of your portfolio content.

**Q: Do AI search engines like ChatGPT actually use robots.txt?**

A: Yes. OpenAI's GPTBot, Perplexity's PerplexityBot, and Anthropic's ClaudeBot all respect robots.txt directives. If your robots.txt blocks these bots (which some default configurations do), AI search engines cannot crawl your content and will never cite your work in their generated answers. Explicitly allowing AI bots is one of the highest-impact, lowest-effort SEO changes you can make in 2025.

**Q: Is the noscript fallback really necessary if Google can render JavaScript?**

A: The noscript fallback serves three purposes: faster initial indexing (no render queue delay), a safety net for rendering failures (Googlebot's renderer occasionally fails on complex JavaScript), and content for non-Google crawlers that may not render JavaScript at all (including some AI bots). It takes 45 minutes to implement and eliminates an entire category of indexing risk.

---

*I'm Nguyễn Xuân Hải, a Fullstack Developer building production web apps with React, .NET Core & AI in Ho Chi Minh City.  
Check out my [portfolio](https://www.hailamdev.space) or connect on [LinkedIn](https://www.linkedin.com/in/xuanhai0913/).*

**See this checklist in action:** [hailamdev.space](https://www.hailamdev.space)  
**My other articles:**
- [How I Architected a B2B Real Estate Platform with .NET Core + React](https://dev.to/xuanhai0913)
- [I Built an AI Portfolio Assistant with Google Gemini 2.0](https://dev.to/xuanhai0913)

import { getRouteMeta } from './utils/metaTags';

describe('route metadata', () => {
  test('uses Vietnamese metadata and canonical URLs for localized tool pages', () => {
    const meta = getRouteMeta('/vi/tools/testforge');

    expect(meta.locale).toBe('vi');
    expect(meta.title).toBe('TestForge AI - Công cụ tạo Unit Test | Nguyễn Xuân Hải');
    expect(meta.url).toBe('https://my-portfolio-nxh.vercel.app/vi/tools/testforge');
    expect(meta.englishUrl).toBe('https://my-portfolio-nxh.vercel.app/tools/testforge');
    expect(meta.vietnameseUrl).toBe('https://my-portfolio-nxh.vercel.app/vi/tools/testforge');
  });

  test('keeps experimental 3D pages out of the index', () => {
    expect(getRouteMeta('/3d').robots).toBe('noindex, follow');
  });

  test.each(['en', 'vi'])('serves matching client and prerender metadata for the %s security case study', (locale) => {
    const { routes } = require('../scripts/prerender-route-metadata');
    const pathname = `${locale === 'vi' ? '/vi' : ''}/projects/security-lab`;
    const meta = getRouteMeta(pathname);
    const shell = routes.find(route => route.path === pathname);
    expect(meta.title).toBe(shell.title);
    expect(meta.description).toBe(shell.description);
    expect(meta.locale).toBe(locale);
    expect(meta.vietnameseUrl).toBe('https://my-portfolio-nxh.vercel.app/vi/projects/security-lab');
    expect(meta.englishUrl).toBe('https://my-portfolio-nxh.vercel.app/projects/security-lab');
  });
});

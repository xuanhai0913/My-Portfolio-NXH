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
});

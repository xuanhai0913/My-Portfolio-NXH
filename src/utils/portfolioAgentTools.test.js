import { PORTFOLIO_AGENT_TOOLS, RECRUITER_BRIEF_STATS, getPortfolioToolDefinition } from './portfolioAgentTools';
import { WORK_EXPERIENCE } from './constants';
import enTimeline from '../i18n/locales/en/experience.json';
import viTimeline from '../i18n/locales/vi/experience.json';

const { executePortfolioTool, executeToolCalls } = require('../../api/portfolio-tools');
const { buildPortfolioSystemPrompt } = require('../../api/portfolio-context');

describe('portfolio agent tools', () => {
  test('publishes the same five read-only capabilities to the interface', () => {
    expect(PORTFOLIO_AGENT_TOOLS).toHaveLength(5);
    expect(getPortfolioToolDefinition('search_portfolio_projects')?.icon).toBe('projects');
    expect(getPortfolioToolDefinition('unknown_tool')).toBeNull();
  });

  test('returns structured evidence cards and caps result counts', () => {
    const output = executePortfolioTool('search_portfolio_projects', { query: '', limit: 99 }, 'vi');

    expect(output.card.type).toBe('projects');
    expect(output.result.items.length).toBeLessThanOrEqual(6);
    expect(output.result.items[0]).toHaveProperty('evidence');
  });

  test('rejects tools outside the allowlist without executing them', () => {
    const output = executeToolCalls([{ name: 'fetch_arbitrary_url', args: { url: 'https://example.com' } }], 'en');

    expect(output.executions).toEqual([
      expect.objectContaining({ name: 'fetch_arbitrary_url', status: 'rejected', resultCount: 0 }),
    ]);
    expect(output.cards).toHaveLength(0);
  });

  test.each(['security', 'RAT-HAILAMDEV', 'bảo mật'])('finds the security lab for %s without claiming production readiness', (query) => {
    const { result } = executePortfolioTool('search_portfolio_projects', { query, limit: 6 });
    const project = result.items.find(item => item.id === 'security-lab');
    expect(project.url).toBe('https://my-portfolio-nxh.vercel.app/projects/security-lab');
    expect(project.evidence).toContain('not a production security product');
  });

  test('keeps the AI Power end month consistent across the localized timeline and assistant', () => {
    const { result } = executePortfolioTool('get_work_experience', { query: 'AI Power' });
    expect(result.items[0].period).toBe('May 2026 – Sep 2026');
    expect(enTimeline.records.aiPower.period).toBe('May 2026 – Sep 2026');
    expect(viTimeline.records.aiPower.period).toBe('05/2026 – 09/2026');
  });

  test('keeps all four companies in the timeline and both profile counts', () => {
    const timeline = executePortfolioTool('get_work_experience', {});
    const snapshot = executePortfolioTool('get_candidate_snapshot');

    expect(WORK_EXPERIENCE.map(job => job.id)).toEqual(['fptIs', 'betodemy', 'aiPower', 'oakMindGroup']);
    expect(Object.keys(enTimeline.records)).toEqual(Object.keys(viTimeline.records));
    expect(timeline.result.items.map(item => item.company)).toEqual(['FPT IS', 'Betodemy', 'AI Power', 'OakMind Group']);
    expect(snapshot.card.stats.companies).toBe(WORK_EXPERIENCE.length);
    expect(RECRUITER_BRIEF_STATS).toContainEqual({ key: 'companies', value: WORK_EXPERIENCE.length });
  });

  test.each([
    ['en', '.NET Developer', 'Oct 2026 – Present', enTimeline.records.fptIs],
    ['vi', 'Lập trình viên .NET', '10/2026 – Hiện tại', viTimeline.records.fptIs],
  ])('returns FPT IS evidence in %s from the same record as the timeline', (locale, role, period, record) => {
    const { result, card } = executePortfolioTool('get_work_experience', { query: 'FPT IS' }, locale);

    expect(result.count).toBe(1);
    expect(card.items).toEqual(result.items);
    expect(result.items[0]).toMatchObject({
      company: 'FPT IS', role, period, summary: record.description, evidence: record.achievement, url: record.link,
    });
    expect(buildPortfolioSystemPrompt(locale)).toContain('Current role: .NET Developer at FPT IS');
  });
});

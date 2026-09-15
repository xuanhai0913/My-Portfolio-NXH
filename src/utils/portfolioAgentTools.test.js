import { PORTFOLIO_AGENT_TOOLS, getPortfolioToolDefinition } from './portfolioAgentTools';

const { executePortfolioTool, executeToolCalls } = require('../../api/portfolio-tools');

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
    const { result } = executePortfolioTool('search_portfolio_projects', { query });
    const project = result.items.find(item => item.id === 'security-lab');
    expect(project.url).toBe('https://my-portfolio-nxh.vercel.app/projects/security-lab');
    expect(project.evidence).toContain('not a production security product');
  });

  test('keeps the AI Power end month consistent across timeline, profile and assistant', () => {
    const enTimeline = require('../i18n/locales/en/experience.json');
    const viTimeline = require('../i18n/locales/vi/experience.json');
    const enProfile = require('../i18n/locales/en/home.json');
    const viProfile = require('../i18n/locales/vi/home.json');
    const { result } = executePortfolioTool('get_work_experience', { query: 'AI Power' });
    expect(result.items[0].period).toBe('May 2026 – Sep 2026');
    expect(enTimeline.records.aiPower.period).toBe('May 2026 – Sep 2026');
    expect(viTimeline.records.aiPower.period).toBe('05/2026 – 09/2026');
    expect(JSON.stringify(enProfile)).toContain('September 2026');
    expect(JSON.stringify(viProfile)).toContain('05/2026 – 09/2026');
  });
});

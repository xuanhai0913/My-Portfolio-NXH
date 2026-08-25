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
});

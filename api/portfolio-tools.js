const { PORTFOLIO_DATA } = require('./portfolio-data');

const MAX_QUERY_LENGTH = 120;
const MAX_RESULT_ITEMS = 6;

const FUNCTION_DECLARATIONS = [
  {
    name: 'get_candidate_snapshot',
    description: 'Get verified headline facts, core skills and portfolio totals for Nguyen Xuan Hai. Use for recruiter summaries and general profile questions.',
    parameters: { type: 'OBJECT', properties: {} },
  },
  {
    name: 'search_portfolio_projects',
    description: 'Search verified portfolio projects by project name, technology, category, role or evidence. Use whenever the user asks about projects, stacks, ownership or production proof.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: { type: 'STRING', description: 'Short search phrase such as React, Odoo, production, testing or blockchain.' },
        limit: { type: 'INTEGER', description: 'Maximum number of projects to return, from 1 to 6.' },
      },
    },
  },
  {
    name: 'get_work_experience',
    description: 'Get verified work experience. Optionally filter by company, role, technology or date phrase.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: { type: 'STRING', description: 'Optional company, role, technology or date phrase.' },
      },
    },
  },
  {
    name: 'search_credentials',
    description: 'Search selected verified credentials by title, issuer or topic. Use for certification, cloud, AWS, Google or AI credential questions.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: { type: 'STRING', description: 'Optional credential, issuer or topic phrase.' },
        limit: { type: 'INTEGER', description: 'Maximum number of credentials to return, from 1 to 6.' },
      },
    },
  },
  {
    name: 'get_contact_channels',
    description: 'Get public contact, CV and professional profile links. This tool only reads approved public channels and never sends a message.',
    parameters: {
      type: 'OBJECT',
      properties: {
        channel: { type: 'STRING', description: 'Optional channel such as email, phone, LinkedIn, GitHub, Upwork or CV.' },
      },
    },
  },
];

function sanitizeQuery(value) {
  return typeof value === 'string' ? value.trim().slice(0, MAX_QUERY_LENGTH) : '';
}

function normalizeLimit(value, fallback = 3) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? Math.min(MAX_RESULT_ITEMS, Math.max(1, parsed)) : fallback;
}

function searchableText(item) {
  return Object.values(item)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((value) => typeof value === 'string')
    .join(' ')
    .toLowerCase();
}

function searchItems(items, query, limit) {
  const normalizedQuery = sanitizeQuery(query).toLowerCase();
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);
  const matches = terms.length === 0
    ? items
    : items.filter((item) => {
      const haystack = searchableText(item);
      return terms.every((term) => haystack.includes(term));
    });

  return matches.slice(0, normalizeLimit(limit));
}

function getLocalizedCopy(locale, en, vi) {
  return locale === 'vi' ? vi : en;
}

function executePortfolioTool(name, rawArgs = {}, locale = 'en') {
  const args = rawArgs && typeof rawArgs === 'object' && !Array.isArray(rawArgs) ? rawArgs : {};

  if (name === 'get_candidate_snapshot') {
    const result = {
      profile: PORTFOLIO_DATA.profile,
      stats: PORTFOLIO_DATA.stats,
    };
    return {
      result,
      card: {
        type: 'profile',
        eyebrow: getLocalizedCopy(locale, 'Verified profile', 'Hồ sơ đã xác minh'),
        title: PORTFOLIO_DATA.profile.name,
        subtitle: `${PORTFOLIO_DATA.profile.title} · ${PORTFOLIO_DATA.profile.location}`,
        summary: PORTFOLIO_DATA.profile.summary,
        stats: PORTFOLIO_DATA.stats,
        tags: PORTFOLIO_DATA.profile.coreSkills.slice(0, 8),
      },
    };
  }

  if (name === 'search_portfolio_projects') {
    const query = sanitizeQuery(args.query);
    const items = searchItems(PORTFOLIO_DATA.projects, query, args.limit);
    return {
      result: { query, count: items.length, items },
      card: {
        type: 'projects',
        eyebrow: getLocalizedCopy(locale, 'Project evidence', 'Dẫn chứng dự án'),
        title: query
          ? getLocalizedCopy(locale, `Results for “${query}”`, `Kết quả cho “${query}”`)
          : getLocalizedCopy(locale, 'Selected project evidence', 'Dự án tiêu biểu'),
        items,
      },
    };
  }

  if (name === 'get_work_experience') {
    const query = sanitizeQuery(args.query);
    const items = searchItems(PORTFOLIO_DATA.experience, query, 3);
    return {
      result: { query, count: items.length, items },
      card: {
        type: 'experience',
        eyebrow: getLocalizedCopy(locale, 'Verified experience', 'Kinh nghiệm đã xác minh'),
        title: getLocalizedCopy(locale, 'Work timeline', 'Dòng thời gian công việc'),
        items,
      },
    };
  }

  if (name === 'search_credentials') {
    const query = sanitizeQuery(args.query);
    const items = searchItems(PORTFOLIO_DATA.credentials, query, args.limit);
    return {
      result: {
        query,
        count: items.length,
        portfolioTotals: PORTFOLIO_DATA.stats,
        items,
      },
      card: {
        type: 'credentials',
        eyebrow: getLocalizedCopy(locale, 'Verified credentials', 'Chứng chỉ đã xác minh'),
        title: query
          ? getLocalizedCopy(locale, `Credential matches for “${query}”`, `Chứng chỉ phù hợp “${query}”`)
          : getLocalizedCopy(locale, 'Selected credentials', 'Chứng chỉ tiêu biểu'),
        items,
      },
    };
  }

  if (name === 'get_contact_channels') {
    const channel = sanitizeQuery(args.channel);
    const items = searchItems(PORTFOLIO_DATA.contacts, channel, MAX_RESULT_ITEMS);
    return {
      result: { channel, count: items.length, items },
      card: {
        type: 'contacts',
        eyebrow: getLocalizedCopy(locale, 'Public channels', 'Kênh công khai'),
        title: getLocalizedCopy(locale, 'Continue the conversation', 'Tiếp tục trao đổi'),
        items,
      },
    };
  }

  throw new Error('TOOL_NOT_ALLOWED');
}

function executeToolCalls(functionCalls, locale = 'en') {
  if (!Array.isArray(functionCalls)) return { responses: [], executions: [], cards: [] };

  const responses = [];
  const executions = [];
  const cards = [];

  functionCalls.slice(0, 5).forEach((call) => {
    const name = typeof call?.name === 'string' ? call.name : '';
    try {
      const output = executePortfolioTool(name, call?.args, locale);
      responses.push({
        name,
        id: typeof call?.id === 'string' ? call.id : '',
        response: output.result,
      });
      executions.push({ name, status: 'success', resultCount: output.result?.count ?? 1 });
      if (output.card) cards.push(output.card);
    } catch (error) {
      responses.push({
        name: name || 'unknown_tool',
        id: typeof call?.id === 'string' ? call.id : '',
        response: { error: 'Tool unavailable or not allowed.' },
      });
      executions.push({ name: name || 'unknown_tool', status: 'rejected', resultCount: 0 });
    }
  });

  return { responses, executions, cards };
}

module.exports = {
  FUNCTION_DECLARATIONS,
  executePortfolioTool,
  executeToolCalls,
};

export const PORTFOLIO_AGENT_TOOLS = [
  {
    id: 'get_candidate_snapshot',
    icon: 'profile',
    titleKey: 'chat.tools.catalog.snapshot.title',
    descriptionKey: 'chat.tools.catalog.snapshot.description',
  },
  {
    id: 'search_portfolio_projects',
    icon: 'projects',
    titleKey: 'chat.tools.catalog.projects.title',
    descriptionKey: 'chat.tools.catalog.projects.description',
  },
  {
    id: 'get_work_experience',
    icon: 'experience',
    titleKey: 'chat.tools.catalog.experience.title',
    descriptionKey: 'chat.tools.catalog.experience.description',
  },
  {
    id: 'search_credentials',
    icon: 'credentials',
    titleKey: 'chat.tools.catalog.credentials.title',
    descriptionKey: 'chat.tools.catalog.credentials.description',
  },
  {
    id: 'get_contact_channels',
    icon: 'contacts',
    titleKey: 'chat.tools.catalog.contacts.title',
    descriptionKey: 'chat.tools.catalog.contacts.description',
  },
];

export const RECRUITER_BRIEF_STATS = [
  { key: 'productionProjects', value: 7 },
  { key: 'companies', value: 3 },
  { key: 'certifications', value: 45 },
];

export function getPortfolioToolDefinition(toolId) {
  return PORTFOLIO_AGENT_TOOLS.find((tool) => tool.id === toolId) || null;
}

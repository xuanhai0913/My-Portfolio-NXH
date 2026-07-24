export const TOOL_STATUS = {
  LIVE: 'LIVE',
  PLANNED: 'PLANNED'
};

export const tools = [
  {
    slug: 'testforge',
    index: '01',
    name: 'TestForge AI',
    type: 'ENGINEERING',
    status: TOOL_STATUS.LIVE,
    description: 'Drafts coverage-focused unit tests, edge cases, and dependency-mocking notes from source code.',
    input: 'Source code + test framework',
    output: 'Test draft + review checklist',
    stack: ['Gemini', 'Structured JSON', 'Jest', 'Pytest', 'xUnit'],
    accent: 'lime',
    fields: [
      {
        name: 'language',
        label: 'LANGUAGE',
        type: 'select',
        options: ['TypeScript', 'JavaScript', 'Python', 'C#'],
        defaultValue: 'TypeScript'
      },
      {
        name: 'framework',
        label: 'TEST FRAMEWORK',
        type: 'select',
        options: ['Jest', 'Vitest', 'Pytest', 'xUnit'],
        defaultValue: 'Jest'
      },
      {
        name: 'sourceCode',
        label: 'SOURCE CODE',
        type: 'code',
        required: true,
        placeholder: 'Paste the function or class you want to test...',
        defaultValue: `export function calculateDiscount(total: number, member: boolean) {
  if (total < 0) throw new Error('Invalid total');
  if (member && total >= 100) return total * 0.85;
  if (total >= 100) return total * 0.9;
  return total;
}`
      }
    ]
  },
  {
    slug: 'repolens',
    index: '02',
    name: 'RepoLens AI',
    type: 'CODE ANALYSIS',
    status: TOOL_STATUS.LIVE,
    description: 'Turns repository context into an architecture map, dependency risks, and an actionable change plan.',
    input: 'README + file tree + task',
    output: 'System map + risk report',
    stack: ['Gemini', 'Repository Context', 'Architecture', 'Risk Analysis'],
    accent: 'cyan',
    fields: [
      {
        name: 'goal',
        label: 'ANALYSIS GOAL',
        type: 'text',
        required: true,
        placeholder: 'Example: Add payment retries without breaking order processing',
        defaultValue: 'Identify the safest path to add audit logging.'
      },
      {
        name: 'repositoryContext',
        label: 'REPOSITORY CONTEXT',
        type: 'textarea',
        required: true,
        placeholder: 'Paste a README, file tree, architecture notes, or selected source files...',
        defaultValue: `src/
  modules/orders/order.service.ts
  modules/orders/order.controller.ts
  modules/users/user.service.ts
  common/database.ts

The app is a NestJS API using PostgreSQL and TypeORM. Controllers call services directly. Authentication is handled by a global JWT guard.`
      }
    ]
  },
  {
    slug: 'incidentlens',
    index: '03',
    name: 'IncidentLens',
    type: 'DEBUGGING',
    status: TOOL_STATUS.LIVE,
    description: 'Organizes logs and stack traces into likely causes, evidence, verification steps, and a recovery checklist.',
    input: 'Logs + recent change context',
    output: 'Root-cause hypotheses + actions',
    stack: ['Gemini', 'Log Analysis', 'Observability', 'Incident Response'],
    accent: 'orange',
    fields: [
      {
        name: 'recentChange',
        label: 'RECENT CHANGE',
        type: 'text',
        placeholder: 'What changed before the incident?',
        defaultValue: 'Deployed a new database connection pool configuration.'
      },
      {
        name: 'logs',
        label: 'LOGS / STACK TRACE',
        type: 'code',
        required: true,
        placeholder: 'Remove secrets, then paste logs or a stack trace...',
        defaultValue: `2026-07-24T10:41:03Z ERROR request_id=8f21 route=/orders
QueryFailedError: remaining connection slots are reserved
pool active=20 idle=0 waiting=47
p95 latency=8420ms error_rate=31%`
      }
    ]
  },
  {
    slug: 'agentflow',
    index: '04',
    name: 'AgentFlow Studio',
    type: 'AGENTIC SYSTEMS',
    status: TOOL_STATUS.LIVE,
    description: 'Designs a reviewable multi-agent workflow with explicit roles, dependencies, handoffs, and quality gates.',
    input: 'Objective + stack + constraints',
    output: 'Agent graph + delivery gates',
    stack: ['Gemini', 'Agent Orchestration', 'DAG', 'Quality Gates'],
    accent: 'violet',
    fields: [
      {
        name: 'objective',
        label: 'PROJECT OBJECTIVE',
        type: 'textarea',
        required: true,
        placeholder: 'Describe what the agent team should deliver...',
        defaultValue: 'Build and release a customer-support assistant that answers from approved product documentation, cites sources, and safely escalates uncertain requests.'
      },
      {
        name: 'techStack',
        label: 'TECH STACK',
        type: 'text',
        required: true,
        placeholder: 'Example: React, NestJS, PostgreSQL, Gemini, Docker',
        defaultValue: 'React, NestJS, PostgreSQL, Gemini, Docker, GitLab CI'
      },
      {
        name: 'constraints',
        label: 'CONSTRAINTS / DEFINITION OF DONE',
        type: 'textarea',
        placeholder: 'Security, time, quality, deployment, or review constraints...',
        defaultValue: 'No unverified answers; PII must not be stored; every response needs a source; include automated tests, human review, rollback, and production monitoring.'
      }
    ]
  },
  {
    slug: 'sqldoctor',
    index: '05',
    name: 'SQL Doctor',
    type: 'DATABASE',
    status: TOOL_STATUS.PLANNED,
    description: 'Reviews schema and query plans to suggest indexes, safer rewrites, and measurements to validate improvements.',
    input: 'Schema + query plan',
    output: 'Optimization plan',
    stack: ['PostgreSQL', 'EXPLAIN', 'Indexing', 'Gemini'],
    accent: 'blue'
  },
  {
    slug: 'scamsignal',
    index: '06',
    name: 'ScamSignal AI',
    type: 'TRUST & SAFETY',
    status: TOOL_STATUS.PLANNED,
    description: 'Structures transaction evidence and suspicious signals into a timeline for human verification.',
    input: 'Messages + evidence',
    output: 'Signals + evidence timeline',
    stack: ['NLP', 'Entity Matching', 'Risk Rules', 'PostgreSQL'],
    accent: 'red'
  },
  {
    slug: 'healthreport',
    index: '07',
    name: 'Health Report Companion',
    type: 'RESPONSIBLE AI',
    status: TOOL_STATUS.PLANNED,
    description: 'Explains report terminology and prepares questions for a clinician without diagnosing or replacing medical advice.',
    input: 'De-identified report text',
    output: 'Plain-language explanation',
    stack: ['OCR', 'Safety Rules', 'Structured Output', 'Gemini'],
    accent: 'mint'
  }
];

export const getToolBySlug = (slug) => tools.find((tool) => tool.slug === slug);

export const getInitialToolInputs = (tool) => (
  (tool?.fields || []).reduce((values, field) => ({
    ...values,
    [field.name]: field.defaultValue || ''
  }), {})
);

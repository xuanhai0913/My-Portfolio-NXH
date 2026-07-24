import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Tools.css';

const tools = [
  {
    index: '01',
    name: 'TestLab AI',
    type: 'ENGINEERING',
    status: 'LIVE DEMO',
    description: 'Turns source context into coverage-focused unit-test drafts, edge cases, and dependency-mocking suggestions.',
    input: 'Source code + test framework',
    output: 'Test cases + review checklist',
    stack: ['React', 'Node.js', 'DeepSeek', 'AST'],
    href: '/videos',
    action: 'OPEN DEMO'
  },
  {
    index: '02',
    name: 'RepoLens AI',
    type: 'CODE ANALYSIS',
    status: 'PROTOTYPE',
    description: 'Maps an unfamiliar repository into architecture notes, dependency risks, change plans, and review priorities.',
    input: 'Repository + task context',
    output: 'System map + risk report',
    stack: ['Git', 'RAG', 'LLM', 'Static Analysis']
  },
  {
    index: '03',
    name: 'Health Report Companion',
    type: 'RESPONSIBLE AI',
    status: 'CONCEPT',
    description: 'Explains medical-report terminology in plain language and prepares questions for a qualified clinician. It never diagnoses or replaces medical advice.',
    input: 'Lab report or clinical note',
    output: 'Plain-language summary',
    stack: ['OCR', 'Structured Output', 'Safety Rules', 'RAG']
  },
  {
    index: '04',
    name: 'ScamSignal AI',
    type: 'TRUST & SAFETY',
    status: 'CONCEPT',
    description: 'Organizes transaction evidence, detects suspicious patterns, and drafts a structured risk brief for human verification.',
    input: 'Messages + transaction evidence',
    output: 'Signals + evidence timeline',
    stack: ['NLP', 'Entity Matching', 'Risk Rules', 'PostgreSQL']
  }
];

const Tools = () => (
  <main className="tools-page">
    <section className="tools-hero" aria-labelledby="tools-title">
      <div className="tools-eyebrow">
        <span>NXH / AI UTILITY BENCH</span>
        <span className="tools-signal">04 EXPERIMENTS</span>
      </div>
      <div className="tools-hero-grid">
        <div>
          <p className="tools-kicker">SMALL TOOLS. CLEAR OUTPUTS.</p>
          <h1 id="tools-title">TOOLS<span>_</span></h1>
        </div>
        <p className="tools-intro">
          Focused AI utilities that turn messy context into something a person can
          review, verify, and use. No magic button, no hidden decision-making.
        </p>
      </div>
    </section>

    <section className="tools-ledger" aria-label="AI tool experiments">
      {tools.map((tool) => (
        <article className="tool-row" key={tool.name}>
          <div className="tool-index" aria-hidden="true">{tool.index}</div>
          <div className="tool-main">
            <div className="tool-meta">
              <span>{tool.type}</span>
              <span className={`tool-status tool-status--${tool.status.toLowerCase().replace(' ', '-')}`}>
                {tool.status}
              </span>
            </div>
            <h2>{tool.name}</h2>
            <p>{tool.description}</p>
            <div className="tool-stack" aria-label={`${tool.name} technology stack`}>
              {tool.stack.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
          <dl className="tool-io">
            <div>
              <dt>INPUT</dt>
              <dd>{tool.input}</dd>
            </div>
            <div>
              <dt>OUTPUT</dt>
              <dd>{tool.output}</dd>
            </div>
          </dl>
          <div className="tool-action">
            {tool.href ? (
              <Link to={tool.href}>{tool.action}<span aria-hidden="true">↗</span></Link>
            ) : (
              <span>BUILD QUEUE</span>
            )}
          </div>
        </article>
      ))}
    </section>

    <aside className="tools-note">
      <span>BUILD PRINCIPLE 001</span>
      <p>AI proposes. Evidence stays visible. A human makes the final decision.</p>
    </aside>
  </main>
);

export default Tools;

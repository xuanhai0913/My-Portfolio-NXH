import React from 'react';
import { Link } from 'react-router-dom';
import { TOOL_STATUS, tools } from '../../data/tools';
import './styles/Tools.css';

const liveToolCount = tools.filter((tool) => tool.status === TOOL_STATUS.LIVE).length;

const Tools = () => (
  <main className="tools-page">
    <section className="tools-hero" aria-labelledby="tools-title">
      <div className="tools-eyebrow">
        <span>NXH / AI UTILITY BENCH</span>
        <span className="tools-signal">{String(liveToolCount).padStart(2, '0')} LIVE / {String(tools.length).padStart(2, '0')} TOTAL</span>
      </div>
      <div className="tools-hero-grid">
        <div>
          <p className="tools-kicker">SMALL TOOLS. CLEAR OUTPUTS.</p>
          <h1 id="tools-title">TOOLS<span>_</span></h1>
        </div>
        <p className="tools-intro">
          Focused AI utilities that turn messy context into something a person can
          review, verify, and use. Every live tool exposes evidence and limitations.
        </p>
      </div>
    </section>

    <section className="tools-ledger" aria-label="AI mini applications">
      {tools.map((tool) => {
        const isLive = tool.status === TOOL_STATUS.LIVE;

        return (
          <article className={`tool-row tool-row--${tool.accent}`} key={tool.slug}>
            <div className="tool-index" aria-hidden="true">{tool.index}</div>
            <div className="tool-main">
              <div className="tool-meta">
                <span>{tool.type}</span>
                <span className={`tool-status ${isLive ? 'tool-status--live' : ''}`}>
                  {isLive ? 'LIVE APP' : 'BUILD QUEUE'}
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
              {isLive ? (
                <Link to={`/tools/${tool.slug}`}>RUN TOOL<span aria-hidden="true">↗</span></Link>
              ) : (
                <span>PLANNED</span>
              )}
            </div>
          </article>
        );
      })}
    </section>

    <aside className="tools-note">
      <span>BUILD PRINCIPLE 001</span>
      <p>AI proposes. Evidence stays visible. A human makes the final decision.</p>
    </aside>
  </main>
);

export default Tools;

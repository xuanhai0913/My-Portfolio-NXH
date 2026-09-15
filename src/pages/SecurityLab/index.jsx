import React, { useEffect, useRef, useState } from 'react';
import useLocaleNavigation from '../../hooks/useLocaleNavigation';
import { securityLabCopy, SECURITY_LAB_REPO } from './content';
import './SecurityLab.css';

const LayerIcon = ({ type }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    {type === 'client' ? <><rect x="4" y="6" width="24" height="17" rx="2" /><path d="m9 12 4 3-4 3m8 0h5M11 27h10m-5-4v4" /></>
      : type === 'transport' ? <><path d="m16 3 11 5v8c0 6-7 11-11 13C12 27 5 22 5 16V8Z" /><path d="m11 16 3 3 7-7" /></>
        : <><rect x="5" y="4" width="22" height="10" rx="2" /><rect x="5" y="18" width="22" height="10" rx="2" /><path d="M10 9h1m5 0h6M10 23h1m5 0h6" /></>}
  </svg>
);

const SecurityLab = () => {
  const { locale, localizePath } = useLocaleNavigation();
  const copy = securityLabCopy[locale];
  const [activeLayer, setActiveLayer] = useState(1);
  const tabRefs = useRef([]);
  const layer = copy.layers[activeLayer];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleTabKey = (event, index) => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % copy.layers.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + copy.layers.length - 1) % copy.layers.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = copy.layers.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActiveLayer(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <article className="security-lab" aria-labelledby="security-lab-title">
      <div className="sl-shell">
        <a className="sl-back" href={localizePath('/#portfolio')}>{copy.back}</a>
        <header className="sl-hero">
          <div className="sl-hero-copy">
            <p className="sl-eyebrow">{copy.eyebrow}</p>
            <h1 id="security-lab-title">{copy.title}{' '}<br /><span>{copy.titleAccent}</span></h1>
            <p className="sl-intro">{copy.intro}</p>
            <div className="sl-actions">
              <a className="sl-button" href="#lab-architecture">{copy.inspect}</a>
              <a className="sl-source" href={SECURITY_LAB_REPO} target="_blank" rel="noopener noreferrer">{copy.source}<span aria-hidden="true"> ↗</span></a>
            </div>
          </div>
          <div className="sl-cover" aria-hidden="true">
            <div className="sl-cover-top"><span>RESEARCH FILE / 01</span><span>PYTHON</span></div>
            <div className="sl-orbit"><div className="sl-orbit-inner"><LayerIcon type="transport" /></div></div>
            <div className="sl-cover-bottom"><strong>RAT<span> / </span>HAILAMDEV</strong><span>TLS · SOCKETS · JSON</span></div>
          </div>
        </header>

        <section className="sl-brief" aria-labelledby="sl-brief-title">
          <div><p className="sl-eyebrow">{copy.status}</p><h2 id="sl-brief-title">{copy.brief}</h2><p>{copy.summary}</p></div>
          <dl className="sl-facts">{copy.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
        </section>

        <section id="lab-architecture" className="sl-architecture" aria-labelledby="sl-architecture-title">
          <div className="sl-section-heading"><span className="sl-section-number" aria-hidden="true">01</span><div><h2 id="sl-architecture-title">{copy.architecture}</h2><p>{copy.architectureIntro}</p></div></div>
          <div className="sl-workbench">
            <div className="sl-workbench-label"><span>{copy.project}</span><span>{copy.diagramLabel}</span></div>
            <div className="sl-layers" role="tablist" aria-label={copy.modelLabel}>
              {copy.layers.map((item, index) => (
                <button type="button" role="tab" id={`sl-tab-${item.id}`} aria-controls={`sl-panel-${item.id}`}
                  aria-selected={activeLayer === index} tabIndex={activeLayer === index ? 0 : -1}
                  ref={element => { tabRefs.current[index] = element; }} key={item.id}
                  onKeyDown={event => handleTabKey(event, index)} onClick={() => setActiveLayer(index)}
                  className={`sl-layer ${activeLayer === index ? 'is-active' : ''}`}>
                  <span className="sl-layer-tag">{item.tag}</span><LayerIcon type={item.id} /><strong>{item.title}</strong><span className="sl-layer-short">{item.short}</span>
                </button>
              ))}
            </div>
            {copy.layers.map((item, index) => (
              <div role="tabpanel" id={`sl-panel-${item.id}`} aria-labelledby={`sl-tab-${item.id}`} hidden={activeLayer !== index} tabIndex="0" key={item.id}>
                {activeLayer === index ? <div className="sl-inspector" key={layer.id}>
                  <div><p className="sl-eyebrow">{layer.tag}</p><h3>{layer.heading}</h3><p>{layer.body}</p><a className="sl-source" href={`${SECURITY_LAB_REPO}${layer.anchor}`} target="_blank" rel="noopener noreferrer">{layer.evidence}<span aria-hidden="true"> ↗</span></a></div>
                  <aside className="sl-observation"><span>{layer.noteLabel}</span><p>{layer.note}</p></aside>
                </div> : null}
              </div>
            ))}
          </div>
        </section>

        <section className="sl-lessons" aria-labelledby="sl-lessons-title">
          <div className="sl-section-heading"><span className="sl-section-number" aria-hidden="true">02</span><div><h2 id="sl-lessons-title">{copy.lessonsTitle}</h2><p>{copy.lessonsIntro}</p></div></div>
          <div className="sl-review-list">{copy.lessons.map((lesson, index) => (
            <details className="sl-review" key={lesson.title}>
              <summary><span className="sl-review-number">0{index + 1}</span><h3>{lesson.title}</h3><span className="sl-disclosure" aria-hidden="true" /></summary>
              <div className="sl-review-body"><div><span>{copy.current}</span><p>{lesson.current}</p></div><div><span>{copy.next}</span><p>{lesson.next}</p></div></div>
            </details>
          ))}</div>
        </section>

        <footer className="sl-takeaway"><p className="sl-eyebrow">{copy.takeawayLabel}</p><h2>{copy.takeaway}</h2><p>{copy.takeawayBody}</p><a className="sl-source" href={`${SECURITY_LAB_REPO}#security-notes`} target="_blank" rel="noopener noreferrer">{copy.sourceNote}<span aria-hidden="true"> ↗</span></a><small>{copy.footerNote}</small></footer>
      </div>
    </article>
  );
};

export default SecurityLab;

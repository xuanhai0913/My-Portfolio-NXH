import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useLocaleNavigation from '../../hooks/useLocaleNavigation';
import { hubCopy, repositoryUrl, securityTopics } from './content';
import './SecurityHub.css';

const NodeIcon = ({ index }) => (
  <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    {index === 0 ? <><rect x="6" y="7" width="28" height="21" rx="3" /><path d="m12 14 5 4-5 4m10 0h6M13 34h14m-7-6v6" /></>
      : index === 1 ? <><path d="m20 3 13 5v11c0 8-8 14-13 18C15 33 7 27 7 19V8Z" /><path d="m13 20 5 5 10-11" /></>
        : <><ellipse cx="20" cy="9" rx="13" ry="5" /><path d="M7 9v22c0 7 26 7 26 0V9M7 20c0 7 26 7 26 0" /></>}
  </svg>
);

export default function SecurityHub() {
  const { locale, localizePath } = useLocaleNavigation();
  const [params, setParams] = useSearchParams();
  const selected = securityTopics.find(topic => topic.id === params.get('topic')) || securityTopics[0];
  const copy = hubCopy[locale];
  const topic = selected[locale];
  const [defended, setDefended] = useState(false);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tabRefs = useRef([]);
  const steps = defended ? topic.defended : topic.steps;

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);
  useEffect(() => { setStep(0); setPlaying(false); }, [selected.id]);
  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setTimeout(() => {
      if (step === 2) setPlaying(false);
      else setStep(current => current + 1);
    }, 2400);
    return () => window.clearTimeout(timer);
  }, [playing, step]);

  const selectTopic = id => {
    setPlaying(false);
    setStep(0);
    setParams(previous => { const next = new URLSearchParams(previous); next.set('topic', id); return next; }, { replace: true, preventScrollReset: true });
  };
  const handleTopicKey = (event, index) => {
    const keys = { ArrowRight: (index + 1) % securityTopics.length, ArrowLeft: (index + securityTopics.length - 1) % securityTopics.length, Home: 0, End: securityTopics.length - 1 };
    if (keys[event.key] === undefined) return;
    event.preventDefault();
    selectTopic(securityTopics[keys[event.key]].id);
    tabRefs.current[keys[event.key]]?.focus();
  };

  return (
    <article className="security-hub" aria-labelledby="sh-title">
      <div className="sh-shell">
        <header className="sh-hero">
          <div>
            <p className="sh-kicker">{copy.eyebrow}</p>
            <h1 id="sh-title">{copy.title}<br /><span>{copy.accent}</span></h1>
            <p className="sh-intro">{copy.intro}</p>
            <div className="sh-actions"><a className="sh-primary" href="#threat-map">{copy.explore}<span aria-hidden="true">↗</span></a><a href="#research">{copy.projects}</a></div>
          </div>
          <div className="sh-index" aria-label={copy.projects}>
            <p className="sh-kicker">01—05 / RESEARCH INDEX</p>
            <div className="sh-index-grid" aria-hidden="true">{securityTopics.map(item => <span key={item.id}>{item.code}<i /></span>)}</div>
            <div className="sh-stats"><p><strong>05</strong>{copy.labCount}</p><p><strong>02</strong>{copy.newCount}</p></div>
          </div>
        </header>

        <section id="threat-map" className="sh-map" aria-labelledby="sh-map-title">
          <div className="sh-section-heading"><p className="sh-kicker">01 / {copy.mode}</p><h2 id="sh-map-title">{copy.mapTitle}</h2><p>{copy.mapIntro}</p></div>
          <div className="sh-tabs" role="tablist" aria-label={copy.topics}>
            {securityTopics.map((item, index) => <button type="button" role="tab" key={item.id} id={`sh-tab-${item.id}`} aria-selected={selected.id === item.id}
              aria-controls={`sh-panel-${item.id}`} tabIndex={selected.id === item.id ? 0 : -1} ref={element => { tabRefs.current[index] = element; }}
              onKeyDown={event => handleTopicKey(event, index)} onClick={() => selectTopic(item.id)}>
              <span className="sh-tab-number">0{index + 1}</span><strong>{item.code}</strong><span className="sh-tab-name">{item[locale].area}</span>{item.fresh ? <small>{copy.fresh}</small> : null}
            </button>)}
          </div>
          {securityTopics.map(item => <div key={item.id} id={`sh-panel-${item.id}`} role="tabpanel" aria-labelledby={`sh-tab-${item.id}`} hidden={selected.id !== item.id}>
            {selected.id === item.id ? <div className={`sh-workbench ${defended ? 'is-defended' : ''} ${playing ? 'is-playing' : ''}`}>
              <div className="sh-workbench-top"><div><p className="sh-kicker">{topic.area}</p><h3>{topic.name}</h3><p>{topic.summary}</p></div>
                <button className="sh-switch" type="button" role="switch" aria-checked={defended} aria-label={copy.switch} onClick={() => { setDefended(value => !value); setStep(0); setPlaying(false); }}><span className="sh-switch-track" aria-hidden="true"><i /></span>{defended ? copy.protected : copy.risk}</button>
              </div>
              <div className="sh-diagram" aria-label={topic.nodes.join(' → ')}>
                {topic.nodes.map((node, index) => <React.Fragment key={node}>
                  {index > 0 ? <div className={`sh-connector ${step >= index ? 'is-reached' : ''}`} aria-hidden="true"><i /><span>→</span></div> : null}
                  <div className={`sh-node ${step === index ? 'is-current' : ''} ${index === 1 ? 'sh-boundary' : ''}`}><span className="sh-node-number">0{index + 1}</span><NodeIcon index={index} /><strong>{node}</strong><span>{index === 1 && defended ? topic.control : ['INPUT', 'TRUST BOUNDARY', 'OUTCOME'][index]}</span></div>
                </React.Fragment>)}
              </div>
              <div className="sh-playback">
                <div className="sh-step-copy" aria-live="polite" aria-atomic="true"><span>{copy.stage} 0{step + 1} / 03</span><p>{steps[step]}</p></div>
                <div className="sh-controls"><button type="button" onClick={() => { if (step === 2 && !playing) setStep(0); setPlaying(value => !value); }}><span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span>{playing ? copy.pause : step === 2 ? copy.replay : copy.play}</button><button type="button" disabled={step === 2} onClick={() => { setPlaying(false); setStep(current => Math.min(2, current + 1)); }}>{copy.next}<span aria-hidden="true">→</span></button></div>
              </div>
              <p className="sh-model-note">{copy.model}</p>
              <div className="sh-explanation">
                <div className="sh-impact"><p className="sh-kicker">{copy.impact}</p><p>{topic.impact}</p><span>{copy.related}</span><a href={repositoryUrl(selected)} target="_blank" rel="noopener noreferrer">{selected.repo} ↗</a></div>
                <div><p className="sh-kicker">{copy.defense}</p><ol>{topic.defenses.map(defense => <li key={defense}>{defense}</li>)}</ol><a className="sh-reference" href={selected.source} target="_blank" rel="noopener noreferrer">{selected.sourceName} ↗</a></div>
              </div>
              <div className="sh-lesson"><span>{copy.takeaway}</span><p>{topic.lesson}</p></div>
            </div> : null}
          </div>)}
        </section>

        <section id="research" className="sh-research" aria-labelledby="sh-research-title">
          <div className="sh-section-heading"><p className="sh-kicker">02 / {copy.projects}</p><h2 id="sh-research-title">{copy.shelfTitle}</h2><p>{copy.shelfIntro}</p></div>
          <div className="sh-repo-list">{securityTopics.map((item, index) => <article className="sh-repo" key={item.id}>
            <div className="sh-repo-code" aria-hidden="true"><span>0{index + 1}</span><strong>{item.code}</strong></div>
            <div className="sh-repo-body"><p className="sh-repo-status">{copy.prototype}{item.fresh ? <span>{copy.fresh}</span> : null}</p><h3>{item.repo}</h3><p>{item[locale].evidence}</p><details><summary>{locale === 'vi' ? 'Phạm vi & giới hạn' : 'Scope & limitations'}</summary><p>{item[locale].limit}</p></details><small>{item.stack}</small></div>
            <div className="sh-repo-actions"><a href={repositoryUrl(item)} target="_blank" rel="noopener noreferrer" aria-label={`${copy.source}: ${item.repo}`}>{copy.source} ↗</a>{item.id === 'rat' ? <Link to={localizePath('/projects/security-lab')}>{copy.study}</Link> : null}</div>
          </article>)}</div>
          <p className="sh-scope-note">{copy.note}</p>
        </section>
        <footer className="sh-footer"><p>{copy.footer}</p><Link to={localizePath('/#portfolio')}>{copy.back} ↗</Link></footer>
      </div>
    </article>
  );
}

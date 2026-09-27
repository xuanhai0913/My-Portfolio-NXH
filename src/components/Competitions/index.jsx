import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useLocaleNavigation from '../../hooks/useLocaleNavigation';
import { copy, entries } from './content';
import './styles.css';

function Entry({ entry, locale, text, compact }) {
  const [playing, setPlaying] = useState(false);
  const videoButton = useRef(null);
  const { localizePath } = useLocaleNavigation();
  const content = entry[locale];
  const EntryHeading = compact ? 'h3' : 'h2';
  return <article className="competition-entry" id={entry.id} aria-labelledby={`competition-${entry.id}`}>
    <div className="competition-product">
      <div className="competition-window"><span aria-hidden="true">● ● ●</span><span>{entry.name} / {text.preview}</span></div>
      <div className="competition-screen">
        {playing ? <iframe src={entry.embed} title={`${entry.name} — ${text.watch}`} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          : <button ref={videoButton} type="button" className="competition-poster" onClick={() => setPlaying(true)} aria-label={`${text.watch}: ${entry.name}`}>
            <img src={entry.image} alt={`${text.preview}: ${entry.name}`} loading="lazy" decoding="async" />
            <span className="competition-play"><span aria-hidden="true">▷</span>{text.watch}</span>
          </button>}
      </div>
      <div className="competition-caption"><span>{content.evidence}</span>{playing ? <button type="button" onClick={() => { setPlaying(false); requestAnimationFrame(() => videoButton.current?.focus()); }}>{text.stop}</button> : null}<a href={entry.youtube} target="_blank" rel="noopener noreferrer">{text.youtube} ↗</a></div>
    </div>
    <div className="competition-description">
      <p className="competition-status">{content.status}</p>
      <p className="competition-event">{entry.event}</p>
      <EntryHeading id={`competition-${entry.id}`}>{entry.name}</EntryHeading>
      <p className="competition-tagline">{content.tagline}</p>
      <p className="competition-summary">{content.summary}</p>
      <p className="competition-role">{content.role}</p>
      <ul className="competition-stack" aria-label={locale === 'vi' ? 'Công nghệ' : 'Technologies'}>{entry.stack.map(item => <li key={item}>{item}</li>)}</ul>
      <div className="competition-links">
        {compact ? <Link className="competition-primary" to={localizePath(`/competitions#${entry.id}`)}>{text.story}</Link> : <a className="competition-primary" href={entry.source} target="_blank" rel="noopener noreferrer">{text.source} ↗</a>}
        {entry.submission ? <a href={entry.submission} target="_blank" rel="noopener noreferrer">{text.submission} ↗</a> : null}
      </div>
    </div>
    {!compact ? <div className="competition-story">
      {[['problem', content.problem], ['contribution', content.contribution], ['decision', content.decision], ['lesson', content.lesson]].map(([key, value], index) => <div key={key}><span>0{index + 1} / {text[key]}</span><p>{value}</p></div>)}
      <div className="competition-evidence">
        {entry.demo ? <a href={entry.demo} target="_blank" rel="noopener noreferrer">{text.demo} ↗</a> : null}
        {entry.certificate ? <><a href={entry.certificate} target="_blank" rel="noopener noreferrer">{text.certificate} ↗</a><Link to={localizePath('/#community')}>{text.event}</Link></> : null}
      </div>
    </div> : null}
  </article>;
}

export default function Competitions({ compact = false }) {
  const { locale, localizePath } = useLocaleNavigation();
  const text = copy[locale];
  useEffect(() => {
    if (compact) return;
    const target = document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView({ block: 'start', behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [compact]);
  const Heading = compact ? 'h2' : 'h1';
  return <section id="competitions" className={`competitions ${compact ? 'competitions-compact' : 'competitions-page'}`} aria-labelledby="competitions-title">
    <div className="competitions-shell">
      {!compact ? <Link className="competitions-back" to={localizePath('/#competitions')}>{text.back}</Link> : null}
      <header className="competitions-heading"><div><p className="competitions-eyebrow">{text.eyebrow}</p><Heading id="competitions-title">{text.title}</Heading><p>{text.intro}</p></div><span className="competitions-count" aria-hidden="true">02<span>SELECTED BUILDS</span></span></header>
      {(compact ? entries.slice(0, 1) : entries).map(entry => <Entry key={entry.id} entry={entry} locale={locale} text={text} compact={compact} />)}
      {compact ? <div className="competitions-more"><div><span>{text.next}</span><strong>ScamSignal AI <small>AI Riser Vietnam 2026</small></strong></div><Link to={localizePath('/competitions')}>{text.all}<span aria-hidden="true"> ↗</span></Link></div> : <footer className="competitions-footer">{text.footer}</footer>}
    </div>
  </section>;
}

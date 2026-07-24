import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TOOL_STATUS, tools } from '../../data/tools';
import useLocaleNavigation from '../../hooks/useLocaleNavigation';
import './styles/Tools.css';

const liveToolCount = tools.filter((tool) => tool.status === TOOL_STATUS.LIVE).length;

const Tools = () => {
  const { t } = useTranslation();
  const { locale, localizePath } = useLocaleNavigation();

  return (
    <main className={`tools-page tools-page--${locale}`}>
    <section className="tools-hero" aria-labelledby="tools-title">
      <div className="tools-eyebrow">
        <span>{t('tools.eyebrow')}</span>
        <span className="tools-signal">
          {t('tools.count', {
            live: String(liveToolCount).padStart(2, '0'),
            total: String(tools.length).padStart(2, '0')
          })}
        </span>
      </div>
      <div className="tools-hero-grid">
        <div>
          <p className="tools-kicker">{t('tools.kicker')}</p>
          <h1 id="tools-title">{t('tools.title')}<span>_</span></h1>
        </div>
        <p className="tools-intro">
          {t('tools.intro')}
        </p>
      </div>
    </section>

    <section className="tools-ledger" aria-label={t('tools.applicationsAria')}>
      {tools.map((tool) => {
        const isLive = tool.status === TOOL_STATUS.LIVE;

        return (
          <article className={`tool-row tool-row--${tool.accent}`} key={tool.slug}>
            <div className="tool-index" aria-hidden="true">{tool.index}</div>
            <div className="tool-main">
              <div className="tool-meta">
                <span>{t(`tools.items.${tool.slug}.type`, { defaultValue: tool.type })}</span>
                <span className={`tool-status ${isLive ? 'tool-status--live' : ''}`}>
                  {isLive ? t('tools.liveApp') : t('tools.buildQueue')}
                </span>
              </div>
              <h2>{tool.name}</h2>
              <p>{t(`tools.items.${tool.slug}.description`, { defaultValue: tool.description })}</p>
              <div className="tool-stack" aria-label={t('tools.stackAria', { name: tool.name })}>
                {tool.stack.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>
            <dl className="tool-io">
              <div>
                <dt>{t('tools.input')}</dt>
                <dd>{t(`tools.items.${tool.slug}.input`, { defaultValue: tool.input })}</dd>
              </div>
              <div>
                <dt>{t('tools.output')}</dt>
                <dd>{t(`tools.items.${tool.slug}.output`, { defaultValue: tool.output })}</dd>
              </div>
            </dl>
            <div className="tool-action">
              {isLive ? (
                <Link to={localizePath(`/tools/${tool.slug}`)}>{t('tools.runTool')}<span aria-hidden="true">↗</span></Link>
              ) : (
                <span>{t('tools.planned')}</span>
              )}
            </div>
          </article>
        );
      })}
    </section>

    <aside className="tools-note">
      <span>{t('tools.principleLabel')}</span>
      <p>{t('tools.principle')}</p>
    </aside>
    </main>
  );
};

export default Tools;

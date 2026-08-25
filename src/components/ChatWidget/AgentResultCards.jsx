import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SAFE_LINK_PROTOCOLS = new Set(['https:', 'mailto:', 'tel:']);
const INITIAL_VISIBLE_ITEMS = 2;

function RevealMoreButton({ expanded, hiddenCount, onToggle }) {
  const { t } = useTranslation('content');
  if (hiddenCount <= 0 && !expanded) return null;

  return (
    <button
      type="button"
      className="agent-show-more"
      onClick={onToggle}
      aria-expanded={expanded}
    >
      {expanded
        ? t('chat.progressive.showFewerRecords')
        : t('chat.progressive.showMoreRecords', { count: hiddenCount })}
    </button>
  );
}

export function getSafeAgentLink(value) {
  const raw = typeof value === 'string' ? value.trim() : '';
  if (!raw) return '';

  try {
    const base = typeof window === 'undefined' ? 'https://portfolio.invalid' : window.location.origin;
    const parsed = new URL(raw, base);
    return SAFE_LINK_PROTOCOLS.has(parsed.protocol) ? raw : '';
  } catch (error) {
    return '';
  }
}

function ResultLink({ href, children, label }) {
  const safeHref = getSafeAgentLink(href);
  if (!safeHref) return null;

  const isWebLink = safeHref.startsWith('https://');
  return (
    <a
      className="agent-result-link"
      href={safeHref}
      target={isWebLink ? '_blank' : undefined}
      rel={isWebLink ? 'noopener noreferrer' : undefined}
      aria-label={label}
    >
      <span>{children}</span>
      <span className="agent-result-link-icon" aria-hidden="true">↗</span>
    </a>
  );
}

function CardHeading({ card }) {
  return (
    <header className="agent-result-heading">
      {card.eyebrow ? <span>{card.eyebrow}</span> : null}
      {card.title ? <h5>{card.title}</h5> : null}
      {card.subtitle ? <p>{card.subtitle}</p> : null}
    </header>
  );
}

function ProfileCard({ card }) {
  const { t } = useTranslation('content');
  const statsObject = card.stats && typeof card.stats === 'object' ? card.stats : {};
  const priorityStats = ['productionProjects', 'companies', 'certifications'];
  const stats = priorityStats
    .filter((key) => Object.prototype.hasOwnProperty.call(statsObject, key))
    .map((key) => [key, statsObject[key]]);

  return (
    <section className="agent-result-card agent-profile-card">
      <CardHeading card={card} />
      {card.summary ? <p className="agent-result-summary">{card.summary}</p> : null}
      {stats.length > 0 ? (
        <dl className="agent-stat-grid">
          {stats.map(([key, value]) => (
            <div key={key}>
              <dt>{t(`chat.dataCards.stats.${key}`, { defaultValue: key })}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {Array.isArray(card.tags) && card.tags.length > 0 ? (
        <div className="agent-tag-list" aria-label={t('chat.dataCards.coreSkills')}>
          {card.tags.slice(0, 6).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      ) : null}
    </section>
  );
}

function ProjectCards({ card }) {
  const { t } = useTranslation('content');
  const [expanded, setExpanded] = useState(false);
  const items = Array.isArray(card.items) ? card.items : [];
  const visibleItems = expanded ? items : items.slice(0, INITIAL_VISIBLE_ITEMS);
  return (
    <section className="agent-result-card">
      <CardHeading card={card} />
      <div className="agent-project-list">
        {visibleItems.map((item, index) => (
          <article key={item.id || `${item.name}-${index}`} className="agent-project-item">
            <div className="agent-item-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
            <div className="agent-project-copy">
              <div className="agent-project-title-row">
                <h6>{item.name}</h6>
                {item.category ? <span>{item.category}</span> : null}
              </div>
              {item.role ? <p><strong>{t('chat.dataCards.role')}</strong> {item.role}</p> : null}
              {item.evidence ? <p className="agent-evidence"><strong>{t('chat.dataCards.evidence')}</strong> {item.evidence}</p> : null}
              {Array.isArray(item.stack) ? (
                <div className="agent-tag-list agent-tag-list-compact">
                  {item.stack.map((tech) => <span key={tech}>{tech}</span>)}
                </div>
              ) : null}
              <ResultLink href={item.url} label={t('chat.dataCards.openProjectAria', { name: item.name })}>
                {t('chat.dataCards.viewProject')}
              </ResultLink>
            </div>
          </article>
        ))}
      </div>
      <RevealMoreButton
        expanded={expanded}
        hiddenCount={Math.max(0, items.length - INITIAL_VISIBLE_ITEMS)}
        onToggle={() => setExpanded((current) => !current)}
      />
    </section>
  );
}

function ExperienceCard({ card }) {
  const { t } = useTranslation('content');
  const [expanded, setExpanded] = useState(false);
  const items = Array.isArray(card.items) ? card.items : [];
  const visibleItems = expanded ? items : items.slice(0, INITIAL_VISIBLE_ITEMS);
  return (
    <section className="agent-result-card">
      <CardHeading card={card} />
      <div className="agent-experience-list">
        {visibleItems.map((item) => (
          <article key={item.id || `${item.company}-${item.period}`} className="agent-experience-item">
            <div className="agent-experience-marker" aria-hidden="true"><i /></div>
            <div>
              <span className="agent-period">{item.period}</span>
              <h6>{item.role}</h6>
              <p className="agent-company">{item.company}</p>
              {item.summary ? <p>{item.summary}</p> : null}
              {item.evidence ? <p className="agent-evidence"><strong>{t('chat.dataCards.evidence')}</strong> {item.evidence}</p> : null}
              {Array.isArray(item.stack) ? (
                <div className="agent-tag-list agent-tag-list-compact">
                  {item.stack.map((tech) => <span key={tech}>{tech}</span>)}
                </div>
              ) : null}
              <ResultLink href={item.url} label={t('chat.dataCards.openExperienceAria', { company: item.company })}>
                {t('chat.dataCards.verifySource')}
              </ResultLink>
            </div>
          </article>
        ))}
      </div>
      <RevealMoreButton
        expanded={expanded}
        hiddenCount={Math.max(0, items.length - INITIAL_VISIBLE_ITEMS)}
        onToggle={() => setExpanded((current) => !current)}
      />
    </section>
  );
}

function CredentialCards({ card }) {
  const { t } = useTranslation('content');
  const [expanded, setExpanded] = useState(false);
  const items = Array.isArray(card.items) ? card.items : [];
  const visibleItems = expanded ? items : items.slice(0, INITIAL_VISIBLE_ITEMS);
  return (
    <section className="agent-result-card">
      <CardHeading card={card} />
      <div className="agent-credential-grid">
        {visibleItems.map((item) => (
          <article key={item.id || item.name} className="agent-credential-item">
            <span className="agent-credential-mark" aria-hidden="true">✓</span>
            <div>
              <span className="agent-period">{item.date}</span>
              <h6>{item.name}</h6>
              <p className="agent-company">{item.issuer}</p>
              {item.proof ? <p>{item.proof}</p> : null}
              {Array.isArray(item.topics) ? (
                <div className="agent-tag-list agent-tag-list-compact">
                  {item.topics.map((topic) => <span key={topic}>{topic}</span>)}
                </div>
              ) : null}
              <ResultLink href={item.url} label={t('chat.dataCards.openCredentialAria', { name: item.name })}>
                {t('chat.dataCards.verifyCredential')}
              </ResultLink>
            </div>
          </article>
        ))}
      </div>
      <RevealMoreButton
        expanded={expanded}
        hiddenCount={Math.max(0, items.length - INITIAL_VISIBLE_ITEMS)}
        onToggle={() => setExpanded((current) => !current)}
      />
    </section>
  );
}

function ContactCards({ card }) {
  const { t } = useTranslation('content');
  const [expanded, setExpanded] = useState(false);
  const items = Array.isArray(card.items) ? card.items : [];
  const visibleItems = expanded ? items : items.slice(0, 4);
  return (
    <section className="agent-result-card agent-contact-card">
      <CardHeading card={card} />
      <div className="agent-contact-grid">
        {visibleItems.map((item) => (
          <ResultLink key={item.id || item.label} href={item.url} label={t('chat.dataCards.openContactAria', { label: item.label })}>
            <strong>{item.label}</strong>
            <small>{item.value}</small>
          </ResultLink>
        ))}
      </div>
      <RevealMoreButton
        expanded={expanded}
        hiddenCount={Math.max(0, items.length - 4)}
        onToggle={() => setExpanded((current) => !current)}
      />
      <p className="agent-readonly-note"><span aria-hidden="true">◎</span>{t('chat.dataCards.contactSafety')}</p>
    </section>
  );
}

function EmptyResultCard({ card }) {
  const { t } = useTranslation('content');
  return (
    <section className="agent-result-card agent-empty-card">
      <CardHeading card={card} />
      <p>{t('chat.dataCards.noResults')}</p>
    </section>
  );
}

function AgentResultCard({ card }) {
  if (!card || typeof card !== 'object') return null;
  if (Array.isArray(card.items) && card.items.length === 0) return <EmptyResultCard card={card} />;
  if (card.type === 'profile') return <ProfileCard card={card} />;
  if (card.type === 'projects') return <ProjectCards card={card} />;
  if (card.type === 'experience') return <ExperienceCard card={card} />;
  if (card.type === 'credentials') return <CredentialCards card={card} />;
  if (card.type === 'contacts') return <ContactCards card={card} />;
  return null;
}

export default function AgentResultCards({ cards }) {
  const [expanded, setExpanded] = useState(false);
  if (!Array.isArray(cards) || cards.length === 0) return null;

  const visibleCards = expanded ? cards.slice(0, 5) : cards.slice(0, 2);

  return (
    <div className="agent-result-stack">
      {visibleCards.map((card, index) => (
        <AgentResultCard key={`${card?.type || 'result'}-${index}`} card={card} />
      ))}
      <RevealMoreButton
        expanded={expanded}
        hiddenCount={Math.max(0, Math.min(cards.length, 5) - 2)}
        onToggle={() => setExpanded((current) => !current)}
      />
    </div>
  );
}

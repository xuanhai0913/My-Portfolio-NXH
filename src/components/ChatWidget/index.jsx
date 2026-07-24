import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18nInstance from '../../i18n';
import { API } from '../../utils/constants';
import useChatSession from '../../hooks/useChatSession';
import {
  buildPortfolioSystemPrompt,
  PROFILE_CONTEXT,
} from '../../utils/chatProfileContext';
import {
  buildIntentResponse,
  detectIntent,
  suggestionsByIntent,
} from '../../utils/chatIntents';
import {
  ensureStructuredActionDefaults,
  resolveStructuredAction,
} from '../../utils/chatActions';
import { getTrackedChatEvents, trackChatEvent } from '../../utils/chatTelemetry';
import './ChatWidget.css';

const MAX_CONTEXT_MESSAGES = 16;
const CHAT_LANGUAGE_KEY = 'nxh_chat_language_v1';
const CHAT_INTRO_DISMISSED_KEY = 'nxh_chat_intro_dismissed_v1';
const CHAT_FULLSCREEN_KEY = 'nxh_chat_fullscreen_v1';
const CHAT_RESPONSE_STYLE_KEY = 'nxh_chat_response_style_v1';
const TOAST_DURATION_MS = 2600;
const TELEMETRY_EVENT_LIMIT = 30;
const SUPPORTED_TEXT_TYPES = new Set(['text/plain', 'text/markdown', 'application/json']);
const CONTACT_TRIGGER_REGEX = /(liên hệ|lien he|contact|email|mail|linkedin|cv|resume|kết nối|ket noi|phone|sđt|sdt)/i;
const WELCOME_MESSAGES = new Set([
  i18nInstance.getFixedT('en', 'content')('chat.welcome'),
  i18nInstance.getFixedT('vi', 'content')('chat.welcome'),
  'Welcome to Nguyen Xuan Hai portfolio. You can ask me about CV, projects, experience, certifications, or contact links.',
]);

function createMessage(role, content, extra = {}) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    timestamp: Date.now(),
    action: extra.action || null,
    modelUsed: extra.modelUsed || null,
  };
}

function getCaseInsensitiveField(obj, fieldName) {
  if (!obj || typeof obj !== 'object') return undefined;
  const target = String(fieldName || '').toLowerCase();
  const key = Object.keys(obj).find((item) => item.toLowerCase() === target);
  return key ? obj[key] : undefined;
}

function parseJsonLikeAssistantContent(content, t) {
  if (!content || typeof content !== 'string') return null;
  const trimmed = content.trim();
  if (!trimmed.startsWith('{')) return null;

  let parsed = null;
  try {
    parsed = JSON.parse(trimmed);
  } catch (error) {
    const answerMatch = trimmed.match(/"(?:answer|ANSWER|Answer)"\s*:\s*"([\s\S]*?)"\s*,/);
    const highlightsMatch = trimmed.match(/"(?:highlights|HIGHLIGHTS|Highlights)"\s*:\s*\[([\s\S]*?)\]/m);
    const fallbackHighlights = [];

    if (highlightsMatch?.[1]) {
      const itemRegex = /"([^"]+)"/g;
      let m;
      while ((m = itemRegex.exec(highlightsMatch[1])) !== null) {
        fallbackHighlights.push(m[1]);
      }
    }

    const answer = answerMatch?.[1]?.trim();
    if (!answer && fallbackHighlights.length === 0) return null;

    return {
      displayText: answer || t('chat.structuredFallbackParsed'),
      action: {
        type: 'rich',
        answer: answer || '',
        highlights: fallbackHighlights,
        links: [],
        quickFacts: [],
        insights: [],
        timeline: [],
        skillsMatrix: [],
        hrSummary: null,
        riskFlags: [],
        interviewQuestions: [],
        nextActions: [],
        fitSummary: null,
        suggestions: [],
      },
    };
  }

  const answer = getCaseInsensitiveField(parsed, 'answer');
  const highlights = getCaseInsensitiveField(parsed, 'highlights');
  const links = getCaseInsensitiveField(parsed, 'links');
  const quickFacts = getCaseInsensitiveField(parsed, 'quickFacts');
  const insights = getCaseInsensitiveField(parsed, 'insights');
  const timeline = getCaseInsensitiveField(parsed, 'timeline');
  const skillsMatrix = getCaseInsensitiveField(parsed, 'skillsMatrix');
  const hrSummary = getCaseInsensitiveField(parsed, 'hrSummary');
  const riskFlags = getCaseInsensitiveField(parsed, 'riskFlags');
  const interviewQuestions = getCaseInsensitiveField(parsed, 'interviewQuestions');
  const nextActions = getCaseInsensitiveField(parsed, 'nextActions');
  const fitSummary = getCaseInsensitiveField(parsed, 'fitSummary');

  if (
    !answer
    && !Array.isArray(highlights)
    && !Array.isArray(links)
    && !Array.isArray(quickFacts)
    && !Array.isArray(insights)
    && !Array.isArray(timeline)
    && !Array.isArray(skillsMatrix)
    && !hrSummary
    && !Array.isArray(riskFlags)
    && !Array.isArray(interviewQuestions)
    && !Array.isArray(nextActions)
    && !fitSummary
  ) {
    return null;
  }

  return {
    displayText: typeof answer === 'string' ? answer : t('chat.structuredResponse'),
    action: {
      type: 'rich',
      answer: typeof answer === 'string' ? answer : '',
      highlights: Array.isArray(highlights) ? highlights : [],
      links: Array.isArray(links) ? links : [],
      quickFacts: Array.isArray(quickFacts) ? quickFacts : [],
      insights: Array.isArray(insights) ? insights : [],
      timeline: Array.isArray(timeline) ? timeline : [],
      skillsMatrix: Array.isArray(skillsMatrix) ? skillsMatrix : [],
      hrSummary: hrSummary && typeof hrSummary === 'object' ? hrSummary : null,
      riskFlags: Array.isArray(riskFlags) ? riskFlags : [],
      interviewQuestions: Array.isArray(interviewQuestions) ? interviewQuestions : [],
      nextActions: Array.isArray(nextActions) ? nextActions : [],
      fitSummary: fitSummary && typeof fitSummary === 'object' ? fitSummary : null,
      suggestions: [],
    },
  };
}

function ActionCard({ action, onRunNextAction, onAskInterviewQuestion }) {
  const { t } = useTranslation('content');

  if (!action) return null;

  if (action.type === 'rich') {
    const hasQuickFacts = Array.isArray(action.quickFacts) && action.quickFacts.length > 0;
    const hasInsights = Array.isArray(action.insights) && action.insights.length > 0;
    const hasTimeline = Array.isArray(action.timeline) && action.timeline.length > 0;
    const hasSkillsMatrix = Array.isArray(action.skillsMatrix) && action.skillsMatrix.length > 0;
    const hasRiskFlags = Array.isArray(action.riskFlags) && action.riskFlags.length > 0;
    const hasInterviewQuestions = Array.isArray(action.interviewQuestions) && action.interviewQuestions.length > 0;
    const hasNextActions = Array.isArray(action.nextActions) && action.nextActions.length > 0;

    return (
      <div className="chat-action-card chat-rich-card">
        {hasQuickFacts ? (
          <div className="chat-facts-grid">
            {action.quickFacts.map((item, index) => (
              <div key={`fact-${index}`} className="chat-fact-item">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        ) : null}

        {Array.isArray(action.highlights) && action.highlights.length > 0 ? (
          <ul>
            {action.highlights.map((item, index) => (
              <li key={`highlight-${index}`}>{item}</li>
            ))}
          </ul>
        ) : null}

        {hasInsights ? (
          <div className="chat-insights-list">
            {action.insights.map((item, index) => (
              <article key={`insight-${index}`} className={`chat-insight-item priority-${item.priority || 'medium'}`}>
                {item.title ? <h5>{item.title}</h5> : null}
                {item.detail ? <p>{item.detail}</p> : null}
              </article>
            ))}
          </div>
        ) : null}

        {hasTimeline ? (
          <div className="chat-timeline">
            {action.timeline.map((item, index) => (
              <div key={`timeline-${index}`} className="chat-timeline-item">
                <strong>{item.phase || t('chat.structured.step', { count: index + 1 })}</strong>
                <span>{item.detail}</span>
              </div>
            ))}
          </div>
        ) : null}

        {hasSkillsMatrix ? (
          <div className="chat-skills-matrix">
            {action.skillsMatrix.map((item, index) => (
              <div key={`skill-${index}`} className="chat-skill-row">
                <span className="chat-skill-name">{item.skill}</span>
                <span className={`chat-skill-level level-${item.level || 'medium'}`}>{item.level || t('chat.structured.medium')}</span>
                {item.evidence ? <small>{item.evidence}</small> : null}
              </div>
            ))}
          </div>
        ) : null}

        {action.hrSummary ? (
          <div className="chat-hr-summary">
            {action.hrSummary.fit ? <p><strong>{t('chat.structured.fit')}</strong> {action.hrSummary.fit}</p> : null}
            {action.hrSummary.seniority ? <p><strong>{t('chat.structured.seniority')}</strong> {action.hrSummary.seniority}</p> : null}
            {action.hrSummary.noticePeriod ? <p><strong>{t('chat.structured.notice')}</strong> {action.hrSummary.noticePeriod}</p> : null}
            {action.hrSummary.salaryRange ? <p><strong>{t('chat.structured.salary')}</strong> {action.hrSummary.salaryRange}</p> : null}
            {action.hrSummary.workMode ? <p><strong>{t('chat.structured.workMode')}</strong> {action.hrSummary.workMode}</p> : null}
          </div>
        ) : null}

        {hasRiskFlags ? (
          <div className="chat-risk-flags">
            {action.riskFlags.map((item, index) => (
              <article key={`risk-${index}`} className={`chat-risk-item severity-${item.severity || 'medium'}`}>
                <h6>{item.title || t('chat.structured.risk')}</h6>
                {item.detail ? <p>{item.detail}</p> : null}
              </article>
            ))}
          </div>
        ) : null}

        {hasInterviewQuestions ? (
          <div className="chat-interview-questions">
            <p><strong>{t('chat.structured.interviewQuestions')}</strong></p>
            <ol>
              {action.interviewQuestions.map((item, index) => (
                <li key={`question-${index}`}>
                  <button type="button" onClick={() => onAskInterviewQuestion?.(item)}>{item}</button>
                </li>
              ))}
            </ol>
          </div>
        ) : null}

        {hasNextActions ? (
          <div className="chat-next-actions">
            {action.nextActions.map((item, index) => {
              return (
                <button
                  key={`next-${index}`}
                  type="button"
                  onClick={() => onRunNextAction?.(item)}
                >
                  {item?.label || t('chat.structured.action')}
                </button>
              );
            })}
          </div>
        ) : null}

        {Array.isArray(action.links) && action.links.length > 0 ? (
          <div className="chat-action-list">
            {action.links.map((item, index) => (
              <a key={`${item.url}-${index}`} href={item.url} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            ))}
          </div>
        ) : null}

        {action.fitSummary ? (
          <div className="chat-fit-summary">
            <p><strong>{t('chat.structured.match')}</strong> {action.fitSummary.matchLevel || t('chat.structured.unknown')}</p>

            {Array.isArray(action.fitSummary.strongMatches) && action.fitSummary.strongMatches.length > 0 ? (
              <>
                <p><strong>{t('chat.structured.strongMatches')}</strong></p>
                <ul>
                  {action.fitSummary.strongMatches.map((item, index) => (
                    <li key={`strong-${index}`}>{item}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {Array.isArray(action.fitSummary.gaps) && action.fitSummary.gaps.length > 0 ? (
              <>
                <p><strong>{t('chat.structured.gaps')}</strong></p>
                <ul>
                  {action.fitSummary.gaps.map((item, index) => (
                    <li key={`gap-${index}`}>{item}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {action.fitSummary.recommendation ? (
              <p><strong>{t('chat.structured.recommendation')}</strong> {action.fitSummary.recommendation}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  if (action.type === 'cv') {
    return (
      <div className="chat-action-card">
        <p>{action.title}</p>
        <a href={action.url} target="_blank" rel="noopener noreferrer">
          {action.buttonLabel}
        </a>
      </div>
    );
  }

  if (action.type === 'links') {
    return (
      <div className="chat-action-card">
        <div className="chat-action-list">
          {action.links.map((item) => (
            <a key={item.label} href={item.url} target="_blank" rel="noopener noreferrer">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    );
  }

  if (action.type === 'projects' || action.type === 'experience' || action.type === 'certifications') {
    return (
      <div className="chat-action-card">
        <ul>
          {action.items.map((item, index) => (
            <li key={`${item.title || 'item'}-${index}`}>
              <div className="chat-item-title">{item.title}</div>
              {item.subtitle ? <div className="chat-item-sub">{item.subtitle}</div> : null}
              {item.detail ? <div className="chat-item-detail">{item.detail}</div> : null}
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {t('chat.structured.openLink')}
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}

const ChatWidget = ({ mode = 'floating' }) => {
  const { t, i18n } = useTranslation('content');
  const isStandalonePage = mode === 'page';
  const uiLanguage = i18n.resolvedLanguage === 'vi' ? 'vi' : 'en';
  const initialMessages = useMemo(
    () => [
      createMessage(
        'assistant',
        t('chat.welcome')
      ),
    ],
    [t]
  );

  const { messages, setMessages, clearSession, meta } = useChatSession(initialMessages);
  const [open, setOpen] = useState(isStandalonePage);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(() => {
    if (isStandalonePage) return true;
    return localStorage.getItem(CHAT_FULLSCREEN_KEY) === '1';
  });
  const [lastModelUsed, setLastModelUsed] = useState(null);
  const [preferredLanguage, setPreferredLanguage] = useState(() => localStorage.getItem(CHAT_LANGUAGE_KEY) || uiLanguage);
  const [showIntroSpotlight, setShowIntroSpotlight] = useState(() => !sessionStorage.getItem(CHAT_INTRO_DISMISSED_KEY));
  const [jobDescription, setJobDescription] = useState('');
  const [jobDescriptionFile, setJobDescriptionFile] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [responseStyle, setResponseStyle] = useState(() => localStorage.getItem(CHAT_RESPONSE_STYLE_KEY) || 'brief');
  const [toast, setToast] = useState(null);
  const [activeHeaderAction, setActiveHeaderAction] = useState('');
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showTelemetryPanel, setShowTelemetryPanel] = useState(false);
  const [telemetryEvents, setTelemetryEvents] = useState([]);
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  const toastQueueRef = useRef([]);
  const toastRef = useRef(null);
  const showToastRef = useRef(null);
  const actionsMenuRef = useRef(null);
  const language = preferredLanguage || 'en';
  const isDevMode = process.env.NODE_ENV !== 'production';

  useEffect(() => {
    setPreferredLanguage(uiLanguage);
  }, [uiLanguage]);

  useEffect(() => {
    setMessages((currentMessages) => {
      if (
        currentMessages.length !== 1
        || currentMessages[0].role !== 'assistant'
        || !WELCOME_MESSAGES.has(currentMessages[0].content)
        || currentMessages[0].content === t('chat.welcome')
      ) {
        return currentMessages;
      }

      return [{ ...currentMessages[0], content: t('chat.welcome') }];
    });
  }, [setMessages, t]);

  useEffect(() => {
    if (!showIntroSpotlight) return;
    const timer = setTimeout(() => setShowIntroSpotlight(false), 12000);
    return () => clearTimeout(timer);
  }, [showIntroSpotlight]);

  useEffect(() => {
    if (isStandalonePage) {
      setOpen(true);
      setShowIntroSpotlight(false);
      setIsFullscreen(true);
    }
  }, [isStandalonePage]);

  useEffect(() => {
    if (!preferredLanguage) return;
    localStorage.setItem(CHAT_LANGUAGE_KEY, preferredLanguage);
  }, [preferredLanguage]);

  useEffect(() => {
    localStorage.setItem(CHAT_RESPONSE_STYLE_KEY, responseStyle);
  }, [responseStyle]);

  useEffect(() => {
    if (isStandalonePage) return;
    localStorage.setItem(CHAT_FULLSCREEN_KEY, isFullscreen ? '1' : '0');
  }, [isFullscreen, isStandalonePage]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 60);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || !chatBodyRef.current) return;
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    if (!showActionsMenu) return undefined;

    const onOutsideClick = (event) => {
      if (!actionsMenuRef.current?.contains(event.target)) {
        setShowActionsMenu(false);
      }
    };

    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, [showActionsMenu]);

  useEffect(() => {
    if (meta.persistHealthy) return;
    showToastRef.current?.(t('chat.persistWarning'), 'error');
  }, [meta.persistHealthy, t]);

  useEffect(() => {
    if (!isDevMode || typeof window === 'undefined') return undefined;

    const prime = getTrackedChatEvents().slice(-TELEMETRY_EVENT_LIMIT).reverse();
    setTelemetryEvents(prime);

    const onTelemetryEvent = (event) => {
      const latest = event?.detail;
      if (!latest) return;
      setTelemetryEvents((prev) => [latest, ...prev].slice(0, TELEMETRY_EVENT_LIMIT));
    };

    window.addEventListener('nxh-assistant-event', onTelemetryEvent);
    return () => window.removeEventListener('nxh-assistant-event', onTelemetryEvent);
  }, [isDevMode]);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastQueueRef.current = [];
  }, []);

  const fallbackSuggestions = useMemo(() => suggestionsByIntent(language), [language]);
  const suggestions = aiSuggestions.length > 0 ? aiSuggestions : fallbackSuggestions;
  const isHeaderActionBusy = Boolean(activeHeaderAction);
  const commandPrefixInput = input.trimStart();
  const isCommandMode = commandPrefixInput.startsWith('/');
  const shouldShowContactActions = useMemo(() => {
    const recentUserText = messages
      .filter((item) => item.role === 'user')
      .slice(-3)
      .map((item) => item.content)
      .join(' ');

    return CONTACT_TRIGGER_REGEX.test(recentUserText);
  }, [messages]);

  const handleClear = () => {
    clearSession(initialMessages);
    setLastModelUsed(null);
    setAiSuggestions([]);
  };

  const handleOpenChat = () => {
    setOpen(true);
    setShowIntroSpotlight(false);
    sessionStorage.setItem(CHAT_INTRO_DISMISSED_KEY, '1');
    // GA4 analytics tracking
    try {
      const { trackAssistantOpen } = require('../../utils/analytics');
      trackAssistantOpen('widget');
    } catch { /* analytics not critical */ }
  };

  const handleToggleFullscreen = () => {
    if (isStandalonePage) return;
    setIsFullscreen((prev) => !prev);
  };

  const handleQuickMail = () => {
    const recipient = PROFILE_CONTEXT.contacts.email;
    if (!recipient) {
      showToast(t('chat.missingEmail'), 'error');
      return;
    }

    const subjectRaw = t('chat.emailSubject');
    const bodyRaw = t('chat.emailBody');
    const encodedRecipient = encodeURIComponent(recipient);
    const encodedSubject = encodeURIComponent(subjectRaw);
    const encodedBody = encodeURIComponent(bodyRaw);
    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedRecipient}&su=${encodedSubject}&body=${encodedBody}`;
    const mailtoUrl = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;

    const popup = window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
    if (!popup) {
      window.location.href = mailtoUrl;
    }
  };

  const handleQuickLinkedIn = () => {
    window.open(PROFILE_CONTEXT.socials.linkedin, '_blank', 'noopener,noreferrer');
  };

  const handleQuickCV = () => {
    window.open(PROFILE_CONTEXT.cvUrl, '_blank', 'noopener,noreferrer');
  };

  const handleChangeResponseStyle = (nextStyle) => {
    setResponseStyle(nextStyle);
    showToast(t('chat.responseStyleChanged', { style: t(`chat.styles.${nextStyle}`) }));
  };

  const handleRunStructuredAction = (item) => {
    trackChatEvent('structured_action_clicked', {
      label: item?.label || '',
      actionId: item?.actionId || '',
      hasQuestion: Boolean(item?.question),
      hasUrl: Boolean(item?.url),
    });

    const resolved = resolveStructuredAction(item, {
      language,
      hasJobDescription: Boolean(jobDescription),
    });

    if (resolved.type === 'open_cv') {
      handleQuickCV();
      trackChatEvent('structured_action_executed', { type: 'open_cv' });
      return;
    }

    if (resolved.type === 'open_linkedin') {
      handleQuickLinkedIn();
      trackChatEvent('structured_action_executed', { type: 'open_linkedin' });
      return;
    }

    if (resolved.type === 'send_email') {
      handleQuickMail();
      trackChatEvent('structured_action_executed', { type: 'send_email' });
      return;
    }

    if (resolved.type === 'question') {
      trackChatEvent('structured_action_executed', {
        type: 'question',
        source: item?.actionId || 'inline_question',
      });
      handleSend(resolved.question);
      return;
    }

    if (resolved.type === 'url') {
      window.open(resolved.url, '_blank', 'noopener,noreferrer');
      trackChatEvent('structured_action_executed', { type: 'url' });
      return;
    }

    trackChatEvent('structured_action_failed', {
      actionId: item?.actionId || '',
      reason: 'no_available_resolution',
    });
    showToast(resolved.message, 'error');
  };

  const handleAskInterviewQuestion = (question) => {
    if (!question) return;
    trackChatEvent('interview_question_clicked', {
      questionLength: question.length,
    });
    handleSend(question);
  };

  const handleSelectLanguage = (lang) => {
    setPreferredLanguage(lang);
    const fixedT = i18n.getFixedT(lang, 'content');
    appendMessage(createMessage('assistant', fixedT(lang === 'vi'
      ? 'chat.onboardingVietnamese'
      : 'chat.onboardingEnglish'),
    { modelUsed: 'local-onboarding' }));
  };

  const handleJDUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleJDFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isTextByType = SUPPORTED_TEXT_TYPES.has(file.type);
    const isTextByExtension = /\.(txt|md|json)$/i.test(file.name);

    if (!isTextByType && !isTextByExtension) {
      showToast(t('chat.unsupportedJdFile'), 'error');
      event.target.value = '';
      return;
    }

    try {
      const content = await file.text();
      const normalized = content.trim().slice(0, 7000);
      if (!normalized) {
        showToast(t('chat.emptyJdFile'), 'error');
      } else {
        setJobDescription(normalized);
        setJobDescriptionFile(file.name);
        showToast(t('chat.jdLoadSuccess', { file: file.name }));
      }
    } catch (error) {
      showToast(t('chat.jdReadError'), 'error');
    }

    event.target.value = '';
  };

  const clearJDContext = () => {
    setJobDescription('');
    setJobDescriptionFile('');
    showToast(t('chat.jdRemoved'));
  };

  const appendMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const scheduleToastDismiss = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      if (toastQueueRef.current.length > 0) {
        const nextToast = toastQueueRef.current.shift();
        toastRef.current = nextToast;
        setToast(nextToast);
        scheduleToastDismiss();
        return;
      }

      toastRef.current = null;
      setToast(null);
    }, TOAST_DURATION_MS);
  };

  const dismissToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }

    if (toastQueueRef.current.length > 0) {
      const nextToast = toastQueueRef.current.shift();
      toastRef.current = nextToast;
      setToast(nextToast);
      scheduleToastDismiss();
      return;
    }

    toastRef.current = null;
    setToast(null);
  };

  const showToast = (text, type = 'info') => {
    if (!text) return;
    const nextToast = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      type,
    };

    if (!toastRef.current) {
      toastRef.current = nextToast;
      setToast(nextToast);
      scheduleToastDismiss();
      return;
    }

    toastQueueRef.current.push(nextToast);
  };
  showToastRef.current = showToast;

  const runHeaderAction = async (actionKey, actionRunner) => {
    if (!actionKey || typeof actionRunner !== 'function') return;
    if (activeHeaderAction) return;

    setActiveHeaderAction(actionKey);
    try {
      await actionRunner();
    } finally {
      setActiveHeaderAction('');
    }
  };

  const handleMenuAction = (runner) => {
    setShowActionsMenu(false);
    runner();
  };

  const executeSlashCommand = (rawInput) => {
    const normalized = (rawInput || '').trim();
    if (!normalized.startsWith('/')) return false;

    const parts = normalized.slice(1).split(/\s+/).filter(Boolean);
    const command = (parts[0] || '').toLowerCase();
    const args = parts.slice(1);

    if (!command) {
      showToast(t('chat.enterCommand'), 'error');
      return true;
    }

    trackChatEvent('slash_command_used', { command, argsCount: args.length });

    if (command === 'copy') {
      handleCopyTranscript();
      return true;
    }

    if (command === 'txt') {
      handleExportTranscriptTxt();
      return true;
    }

    if (command === 'pdf') {
      handleExportTranscriptPdf();
      return true;
    }

    if (command === 'clear') {
      handleClear();
      return true;
    }

    if (command === 'regen' || command === 'regenerate') {
      handleRegenerateLastAnswer();
      return true;
    }

    if (command === 'jd') {
      handleJDUploadClick();
      return true;
    }

    if (command === 'style') {
      const nextStyle = (args[0] || '').toLowerCase();
      if (['brief', 'detailed', 'fit'].includes(nextStyle)) {
        handleChangeResponseStyle(nextStyle);
      } else {
        showToast(t('chat.validStyles'), 'error');
      }
      return true;
    }

    if (command === 'debug' && isDevMode) {
      setShowTelemetryPanel((prev) => !prev);
      return true;
    }

    if (command === 'help') {
      const helpText = t('chat.quickCommands');
      appendMessage(createMessage('assistant', helpText, { modelUsed: 'slash-help' }));
      return true;
    }

    showToast(t('chat.unsupportedCommand', { command }), 'error');
    return true;
  };

  const slashCommands = useMemo(() => {
    const base = [
      { key: '/copy', hint: t('chat.commandHints.copy') },
      { key: '/txt', hint: t('chat.commandHints.txt') },
      { key: '/pdf', hint: t('chat.commandHints.pdf') },
      { key: '/regen', hint: t('chat.commandHints.regenerate') },
      { key: '/clear', hint: t('chat.commandHints.clear') },
      { key: '/jd', hint: t('chat.commandHints.jd') },
      { key: '/style brief', hint: t('chat.commandHints.brief') },
      { key: '/style detailed', hint: t('chat.commandHints.detailed') },
      { key: '/style fit', hint: t('chat.commandHints.fit') },
      { key: '/help', hint: t('chat.commandHints.help') },
    ];

    if (isDevMode) {
      base.push({ key: '/debug', hint: t(showTelemetryPanel ? 'chat.commandHints.hideDebug' : 'chat.commandHints.showDebug') });
    }

    return base;
  }, [isDevMode, showTelemetryPanel, t]);

  const filteredSlashCommands = useMemo(() => {
    if (!isCommandMode) return [];
    const query = commandPrefixInput.slice(1).toLowerCase();
    if (!query) return slashCommands;

    return slashCommands.filter((item) => item.key.slice(1).toLowerCase().includes(query));
  }, [commandPrefixInput, isCommandMode, slashCommands]);

  useEffect(() => {
    if (!isCommandMode || filteredSlashCommands.length === 0) {
      setActiveCommandIndex(0);
      return;
    }

    setActiveCommandIndex((prev) => {
      if (prev < filteredSlashCommands.length) return prev;
      return 0;
    });
  }, [filteredSlashCommands, isCommandMode]);

  const runCommandAtIndex = (index) => {
    if (!filteredSlashCommands[index]) return false;
    const commandText = filteredSlashCommands[index].key;
    const executed = executeSlashCommand(commandText);
    if (executed) {
      setInput('');
      setActiveCommandIndex(0);
    }
    return executed;
  };

  const handleInputKeyDown = (event) => {
    if (!isCommandMode || filteredSlashCommands.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveCommandIndex((prev) => (prev + 1) % filteredSlashCommands.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveCommandIndex((prev) => (prev - 1 + filteredSlashCommands.length) % filteredSlashCommands.length);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setInput('');
      setActiveCommandIndex(0);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      runCommandAtIndex(activeCommandIndex);
    }
  };

  const sendToModel = async (text, baseMessages = messages) => {
    const requestMessages = baseMessages
      .slice(-MAX_CONTEXT_MESSAGES)
      .map((item) => ({ role: item.role, content: item.content }));

    const response = await fetch(API.GEMINI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: text,
        history: requestMessages,
        profileContext: PROFILE_CONTEXT,
        systemPrompt: buildPortfolioSystemPrompt(language, Boolean(jobDescription), responseStyle),
        jobDescription,
      }),
    });

    const payload = await response.json();

    if (!response.ok || !payload.success) {
      const fallbackText = payload?.message || payload?.error || t('chat.serviceUnavailable');
      return {
        content: fallbackText,
        modelUsed: payload?.modelUsed || null,
      };
    }

    const rawAction = payload.structuredResponse
      ? {
        type: 'rich',
        ...payload.structuredResponse,
      }
      : null;

    const ensuredAction = ensureStructuredActionDefaults(rawAction, {
      language,
      hasJobDescription: Boolean(jobDescription),
    });

    const rawActionCount = Array.isArray(rawAction?.nextActions) ? rawAction.nextActions.length : 0;
    const ensuredActionCount = Array.isArray(ensuredAction?.nextActions) ? ensuredAction.nextActions.length : 0;
    const usedDefaultActions = rawActionCount === 0 && ensuredActionCount > 0;

    trackChatEvent('model_response_received', {
      modelUsed: payload.modelUsed || null,
      hasStructured: Boolean(payload.structuredResponse),
      rawActionCount,
      ensuredActionCount,
      usedDefaultActions,
      suggestionsCount: Array.isArray(payload?.structuredResponse?.suggestions)
        ? payload.structuredResponse.suggestions.length
        : 0,
    });

    return {
      content: payload.responseText || t('chat.emptyResponse'),
      modelUsed: payload.modelUsed,
      action: ensuredAction,
      suggestions: payload?.structuredResponse?.suggestions || [],
    };
  };

  const handleSend = async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || loading) return;

    trackChatEvent('message_send', {
      length: trimmed.length,
      hasJobDescription: Boolean(jobDescription),
      responseStyle,
    });

    setInput('');
    const userMessage = createMessage('user', trimmed);
    appendMessage(userMessage);

    const intent = detectIntent(trimmed);
    if (intent) {
      const deterministic = buildIntentResponse(intent, language);
      if (deterministic) {
        appendMessage(createMessage('assistant', deterministic.text, { action: deterministic.action, modelUsed: 'local-intent' }));
        return;
      }
    }

    setLoading(true);
    try {
      const modelReply = await sendToModel(trimmed);
      setLastModelUsed(modelReply.modelUsed || null);
      setAiSuggestions(Array.isArray(modelReply.suggestions) ? modelReply.suggestions : []);
      appendMessage(createMessage('assistant', modelReply.content, {
        modelUsed: modelReply.modelUsed,
        action: modelReply.action,
      }));
    } catch (error) {
      trackChatEvent('message_send_failed', {
        reason: 'model_request_failed',
      });
      appendMessage(
        createMessage(
          'assistant',
          t('chat.responseError'),
          { modelUsed: 'error-fallback' }
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const formatTranscript = () => {
    const date = new Date().toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US');
    const header = `${t('chat.transcript.title')}\n${t('chat.transcript.generated', { date })}\n\n`;
    const body = messages
      .map((message) => {
        const role = message.role === 'user' ? t('chat.transcript.user') : t('chat.transcript.assistant');
        return `[${role}] ${message.content}`;
      })
      .join('\n\n');
    return `${header}${body}`;
  };

  const handleCopyTranscript = async () => {
    await runHeaderAction('copy', async () => {
      const transcript = formatTranscript();

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(transcript);
          showToast(t('chat.transcriptCopied'));
        } else {
          showToast(t('chat.clipboardUnavailable'), 'error');
        }
      } catch (error) {
        showToast(t('chat.transcriptCopyError'), 'error');
      }
    });
  };

  const handleExportTranscriptTxt = async () => {
    await runHeaderAction('txt', async () => {
      const transcript = formatTranscript();
      const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `chat-session-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(t('chat.txtExported'));
    });
  };

  const handleExportTranscriptPdf = async () => {
    await runHeaderAction('pdf', async () => {
      const transcript = formatTranscript();
      const escaped = transcript
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      const printHtml = `
      <html>
        <head>
          <title>${t('chat.transcript.printTitle')}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; line-height: 1.5; }
            h1 { font-size: 20px; margin-bottom: 16px; }
            pre { white-space: pre-wrap; word-break: break-word; border: 1px solid #ddd; padding: 16px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>${t('chat.transcript.sessionTitle')}</h1>
          <pre>${escaped}</pre>
        </body>
      </html>
    `;

      const printViaIframe = () => new Promise((resolve, reject) => {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.setAttribute('aria-hidden', 'true');

        const cleanup = () => {
          setTimeout(() => {
            if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
          }, 1200);
        };

        iframe.onload = () => {
          try {
            const targetWindow = iframe.contentWindow;
            if (!targetWindow) {
              cleanup();
              reject(new Error('IFRAME_WINDOW_UNAVAILABLE'));
              return;
            }

            targetWindow.focus();
            targetWindow.print();
            cleanup();
            resolve();
          } catch (error) {
            cleanup();
            reject(error);
          }
        };

        document.body.appendChild(iframe);
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) {
          cleanup();
          reject(new Error('IFRAME_DOCUMENT_UNAVAILABLE'));
          return;
        }

        doc.open();
        doc.write(printHtml);
        doc.close();
      });

      try {
        await printViaIframe();
        showToast(t('chat.pdfDialogOpened'));
      } catch (error) {
        const popup = window.open('', '_blank', 'width=900,height=700');
        if (!popup) {
          showToast(t('chat.pdfDialogError'), 'error');
          return;
        }

        popup.document.write(printHtml);
        popup.document.close();
        setTimeout(() => {
          popup.focus();
          popup.print();
        }, 120);
        showToast(t('chat.pdfDialogOpened'));
      }
    });
  };

  const handleRegenerateLastAnswer = async () => {
    if (loading || activeHeaderAction) return;

    await runHeaderAction('regenerate', async () => {
      const lastUserIndex = [...messages].map((item) => item.role).lastIndexOf('user');
      if (lastUserIndex === -1) {
        showToast(t('chat.nothingToRegenerate'), 'error');
        return;
      }

      const lastUserMessage = messages[lastUserIndex];
      const contextMessages = messages.slice(0, lastUserIndex + 1);
      setMessages(contextMessages);

      setLoading(true);
      try {
        const modelReply = await sendToModel(lastUserMessage.content, contextMessages);
        setLastModelUsed(modelReply.modelUsed || null);
        setAiSuggestions(Array.isArray(modelReply.suggestions) ? modelReply.suggestions : []);
        appendMessage(createMessage('assistant', modelReply.content, {
          modelUsed: modelReply.modelUsed,
          action: modelReply.action,
        }));
      } catch (error) {
        appendMessage(
          createMessage(
            'assistant',
            t('chat.regenerateError'),
            { modelUsed: 'error-fallback' }
          )
        );
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <>
      {!isStandalonePage && !open ? (
        <button
          type="button"
          className="chat-launcher"
          onClick={handleOpenChat}
          aria-label={t('chat.openAssistantAria')}
        >
          <span>{t('chat.launcher')}</span>
        </button>
      ) : null}

      {showIntroSpotlight && !open && !isStandalonePage ? (
        <button
          type="button"
          className="chat-intro-spotlight"
          onClick={handleOpenChat}
          aria-label={t('chat.introAria')}
        >
          <strong>{t('chat.introTitle')}</strong>
          <span>{t('chat.introBody')}</span>
        </button>
      ) : null}

      <section className={`chat-panel ${open ? 'open' : ''} ${isFullscreen ? 'fullscreen' : ''} ${isStandalonePage ? 'page-mode' : ''}`} aria-hidden={!open}>
        {toast ? (
          <div className={`chat-toast ${toast.type === 'error' ? 'error' : ''}`} role="status" aria-live="polite">
            <span>{toast.text}</span>
            <button type="button" onClick={dismissToast} aria-label={t('chat.dismissNotification')}>x</button>
          </div>
        ) : null}

        <header className="chat-header">
          <div>
            <h3>{t('chat.headerTitle')}</h3>
            <p>{t('chat.headerSubtitle')}</p>
            {lastModelUsed ? <small className="chat-model-meta">{t('chat.model', { model: lastModelUsed })}</small> : null}
          </div>
          <div className="chat-header-actions">
            {!isStandalonePage ? (
              <div className="chat-window-controls">
                <button
                  type="button"
                  className="chat-icon-btn"
                  onClick={handleToggleFullscreen}
                  aria-label={t(isFullscreen ? 'chat.exitFullscreen' : 'chat.enterFullscreen')}
                  title={t(isFullscreen ? 'chat.exitFullscreen' : 'chat.enterFullscreen')}
                >
                  <span className={`chat-icon ${isFullscreen ? 'icon-window' : 'icon-fullscreen'}`} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="chat-icon-btn"
                  onClick={() => setOpen(false)}
                  aria-label={t('chat.hideChat')}
                  title={t('chat.hideChat')}
                >
                  <span className="chat-icon icon-hide" aria-hidden="true" />
                </button>
              </div>
            ) : null}

            <div className="chat-utility-controls" ref={actionsMenuRef}>
              <button
                type="button"
                className="chat-actions-toggle"
                onClick={() => setShowActionsMenu((prev) => !prev)}
                aria-label={t('chat.openActionsMenu')}
                aria-expanded={showActionsMenu}
              >
                {t('chat.actions')}
              </button>

              {showActionsMenu ? (
                <div className="chat-actions-menu" role="menu" aria-label={t('chat.actionsMenuAria')}>
                  <button type="button" role="menuitem" onClick={() => handleMenuAction(handleCopyTranscript)} disabled={isHeaderActionBusy || loading}>
                    {activeHeaderAction === 'copy' ? t('chat.copying') : t('chat.copyTranscript')}
                  </button>
                  <button type="button" role="menuitem" onClick={() => handleMenuAction(handleExportTranscriptTxt)} disabled={isHeaderActionBusy || loading}>
                    {activeHeaderAction === 'txt' ? t('chat.exporting') : t('chat.exportTxt')}
                  </button>
                  <button type="button" role="menuitem" onClick={() => handleMenuAction(handleExportTranscriptPdf)} disabled={isHeaderActionBusy || loading}>
                    {activeHeaderAction === 'pdf' ? t('chat.preparing') : t('chat.exportPdf')}
                  </button>
                  <button type="button" role="menuitem" onClick={() => handleMenuAction(handleRegenerateLastAnswer)} disabled={loading || isHeaderActionBusy}>
                    {activeHeaderAction === 'regenerate' ? t('chat.regenerating') : t('chat.regenerateAnswer')}
                  </button>
                  <button type="button" role="menuitem" onClick={() => handleMenuAction(handleClear)} disabled={isHeaderActionBusy || loading}>
                    {t('chat.clearSession')}
                  </button>
                  {isDevMode ? (
                    <button type="button" role="menuitem" onClick={() => handleMenuAction(() => setShowTelemetryPanel((prev) => !prev))}>
                      {t(showTelemetryPanel ? 'chat.debugOff' : 'chat.debugOn')}
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        {isDevMode && showTelemetryPanel ? (
          <div className="chat-telemetry-panel" role="status" aria-live="polite">
            <div className="chat-telemetry-head">
              <strong>{t('chat.telemetry', { count: TELEMETRY_EVENT_LIMIT })}</strong>
              <button type="button" onClick={() => setTelemetryEvents([])}>{t('chat.clearLog')}</button>
            </div>
            <div className="chat-telemetry-body">
              {telemetryEvents.map((item, index) => (
                <article key={`${item.event}-${item.timestamp}-${index}`}>
                  <p>{item.event}</p>
                  <small>{new Date(item.timestamp).toLocaleTimeString()}</small>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        <div className="chat-body" role="log" aria-live="polite" ref={chatBodyRef}>
          {messages.map((message) => {
            const parsedAssistantContent = message.role === 'assistant' && !message.action
              ? parseJsonLikeAssistantContent(message.content, t)
              : null;

            const displayText = parsedAssistantContent?.displayText || message.content;
            const displayAction = ensureStructuredActionDefaults(
              message.action || parsedAssistantContent?.action || null,
              {
                language,
                hasJobDescription: Boolean(jobDescription),
              }
            );

            return (
              <article key={message.id} className={`chat-message ${message.role}`}>
                <p>{displayText}</p>
                {displayAction ? (
                  <ActionCard
                    action={displayAction}
                    onRunNextAction={handleRunStructuredAction}
                    onAskInterviewQuestion={handleAskInterviewQuestion}
                  />
                ) : null}
              </article>
            );
          })}

          {loading ? (
            <article className="chat-message assistant">
              <p>{t('chat.thinking')}</p>
            </article>
          ) : null}
        </div>

        {!preferredLanguage ? (
          <div className="chat-language-gate">
            <p>{t('chat.languagePrompt')}</p>
            <div className="chat-language-actions">
              <button type="button" onClick={() => handleSelectLanguage('vi')}>{t('chat.vietnamese')}</button>
              <button type="button" onClick={() => handleSelectLanguage('en')}>{t('chat.english')}</button>
            </div>
          </div>
        ) : null}

        <div className="chat-input-wrap">
          <div className="chat-style-row">
            <span>{t('chat.responseStyle')}</span>
            <div className="chat-style-actions">
              {['brief', 'detailed', 'fit'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={responseStyle === item ? 'active' : ''}
                  onClick={() => handleChangeResponseStyle(item)}
                >
                  {t(`chat.styles.${item}`)}
                </button>
              ))}
            </div>
          </div>

          {shouldShowContactActions ? (
            <div className="chat-quick-actions">
              <button type="button" onClick={handleQuickMail}>{t('chat.quickEmail')}</button>
              <button type="button" onClick={handleQuickLinkedIn}>LinkedIn</button>
              <button type="button" onClick={handleQuickCV}>CV</button>
            </div>
          ) : null}

          <div className="chat-context-row">
            <button type="button" className="chat-context-btn" onClick={handleJDUploadClick}>
              {t('chat.uploadJd')}
            </button>
            {jobDescription ? (
              <div className="chat-jd-pill" role="status" aria-live="polite">
                <span>{jobDescriptionFile || t('chat.jdLoaded')}</span>
                <button type="button" onClick={clearJDContext} aria-label={t('chat.removeJdAria')}>x</button>
              </div>
            ) : null}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.json"
              onChange={handleJDFileChange}
              className="chat-file-input"
            />
          </div>

          <div className="chat-suggestions" aria-label={t('chat.suggestionsAria')}>
            {suggestions.map((item) => (
              <button key={item} type="button" onClick={() => handleSend(item)}>
                {item}
              </button>
            ))}
          </div>

          {filteredSlashCommands.length > 0 ? (
            <div className="chat-command-palette" aria-label={t('chat.slashCommandsAria')}>
              {filteredSlashCommands.map((item, index) => (
                <button
                  key={item.key}
                  type="button"
                  className={index === activeCommandIndex ? 'active' : ''}
                  onClick={() => {
                    executeSlashCommand(item.key);
                    setInput('');
                    setActiveCommandIndex(0);
                  }}
                >
                  <strong>{item.key}</strong>
                  <span>{item.hint}</span>
                </button>
              ))}
            </div>
          ) : null}

          <form
            className="chat-input-row"
            onSubmit={(event) => {
              event.preventDefault();
              if (executeSlashCommand(input)) {
                setInput('');
                return;
              }
              handleSend(input);
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={t('chat.inputPlaceholder')}
              maxLength={600}
              disabled={!preferredLanguage}
            />
            <button type="submit" disabled={loading || !input.trim() || !preferredLanguage}>
              {t('chat.send')}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default ChatWidget;

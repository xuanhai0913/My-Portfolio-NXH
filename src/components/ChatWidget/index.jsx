import React, { useEffect, useMemo, useRef, useState } from 'react';
import { API } from '../../utils/constants';
import useChatSession from '../../hooks/useChatSession';
import {
  buildPortfolioSystemPrompt,
  PROFILE_CONTEXT,
  WELCOME_MESSAGE,
} from '../../utils/chatProfileContext';
import {
  buildIntentResponse,
  detectIntent,
  suggestionsByIntent,
} from '../../utils/chatIntents';
import './ChatWidget.css';

const MAX_CONTEXT_MESSAGES = 16;
const CHAT_LANGUAGE_KEY = 'nxh_chat_language_v1';
const CHAT_INTRO_DISMISSED_KEY = 'nxh_chat_intro_dismissed_v1';

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

function ActionCard({ action }) {
  if (!action) return null;

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
                  Open link
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

const ChatWidget = () => {
  const initialMessages = useMemo(
    () => [
      createMessage('assistant', WELCOME_MESSAGE),
    ],
    []
  );

  const { messages, setMessages, clearSession } = useChatSession(initialMessages);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastModelUsed, setLastModelUsed] = useState(null);
  const [preferredLanguage, setPreferredLanguage] = useState(() => localStorage.getItem(CHAT_LANGUAGE_KEY) || '');
  const [showIntroSpotlight, setShowIntroSpotlight] = useState(() => !sessionStorage.getItem(CHAT_INTRO_DISMISSED_KEY));
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!showIntroSpotlight) return;
    const timer = setTimeout(() => setShowIntroSpotlight(false), 12000);
    return () => clearTimeout(timer);
  }, [showIntroSpotlight]);

  useEffect(() => {
    if (!preferredLanguage) return;
    localStorage.setItem(CHAT_LANGUAGE_KEY, preferredLanguage);
  }, [preferredLanguage]);

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

  const lastIntent = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      const text = messages[i]?.content || '';
      const intent = detectIntent(text);
      if (intent) return intent;
    }
    return null;
  }, [messages]);

  const language = preferredLanguage || 'en';

  const suggestions = useMemo(() => suggestionsByIntent(lastIntent, language), [lastIntent, language]);

  const handleClear = () => {
    clearSession(initialMessages);
    setLastModelUsed(null);
  };

  const handleOpenChat = () => {
    setOpen(true);
    setShowIntroSpotlight(false);
    sessionStorage.setItem(CHAT_INTRO_DISMISSED_KEY, '1');
  };

  const handleSelectLanguage = (lang) => {
    setPreferredLanguage(lang);
    appendMessage(createMessage('assistant', lang === 'vi'
      ? 'Da chon tieng Viet. Ban co the hoi ve CV, du an, kinh nghiem hoac lien he.'
      : 'English selected. You can ask about CV, projects, experience, or contact links.',
    { modelUsed: 'local-onboarding' }));
  };

  const appendMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const sendToModel = async (text) => {
    const requestMessages = messages
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
        systemPrompt: buildPortfolioSystemPrompt(language),
      }),
    });

    const payload = await response.json();

    if (!response.ok || !payload.success) {
      const fallbackText = payload?.message || payload?.error || 'Chat service is temporarily unavailable.';
      return {
        content: fallbackText,
        modelUsed: payload?.modelUsed || null,
      };
    }

    return {
      content: payload.responseText || 'The assistant returned an empty response. Please try asking again.',
      modelUsed: payload.modelUsed,
    };
  };

  const handleSend = async (text) => {
    const trimmed = (text || '').trim();
    if (!trimmed || loading) return;

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
      appendMessage(createMessage('assistant', modelReply.content, { modelUsed: modelReply.modelUsed }));
    } catch (error) {
      appendMessage(
        createMessage(
          'assistant',
          'I am having trouble responding right now. Please try again in a moment.',
          { modelUsed: 'error-fallback' }
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open ? (
        <button
          type="button"
          className="chat-launcher"
          onClick={handleOpenChat}
          aria-label="Open AI portfolio assistant"
        >
          <span>AI Assistant</span>
        </button>
      ) : null}

      {showIntroSpotlight && !open ? (
        <button
          type="button"
          className="chat-intro-spotlight"
          onClick={handleOpenChat}
          aria-label="Open chat intro"
        >
          <strong>Hello, welcome to Hai portfolio.</strong>
          <span>Click AI Assistant to ask quickly about CV, projects, and contact info.</span>
        </button>
      ) : null}

      <section className={`chat-panel ${open ? 'open' : ''}`} aria-hidden={!open}>
        <header className="chat-header">
          <div>
            <h3>Portfolio Assistant</h3>
            <p>Ask about CV, projects, and experience.</p>
            {lastModelUsed ? <small className="chat-model-meta">Model: {lastModelUsed}</small> : null}
          </div>
          <div className="chat-header-actions">
            <button type="button" onClick={handleClear}>Clear</button>
            <button type="button" onClick={() => setOpen(false)}>Close</button>
          </div>
        </header>

        <div className="chat-body" role="log" aria-live="polite" ref={chatBodyRef}>
          {messages.map((message) => (
            <article key={message.id} className={`chat-message ${message.role}`}>
              <p>{message.content}</p>
              {message.action ? <ActionCard action={message.action} /> : null}
            </article>
          ))}

          {loading ? (
            <article className="chat-message assistant">
              <p>Thinking...</p>
            </article>
          ) : null}
        </div>

        {!preferredLanguage ? (
          <div className="chat-language-gate">
            <p>Choose your chat language / Chon ngon ngu tro chuyen</p>
            <div className="chat-language-actions">
              <button type="button" onClick={() => handleSelectLanguage('vi')}>Tieng Viet</button>
              <button type="button" onClick={() => handleSelectLanguage('en')}>English</button>
            </div>
          </div>
        ) : null}

        <div className="chat-input-wrap">
          <div className="chat-suggestions" aria-label="Suggested follow-up questions">
            {suggestions.map((item) => (
              <button key={item} type="button" onClick={() => handleSend(item)}>
                {item}
              </button>
            ))}
          </div>

          <form
            className="chat-input-row"
            onSubmit={(event) => {
              event.preventDefault();
              handleSend(input);
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={language === 'vi' ? 'Dat cau hoi cho Nguyen Xuan Hai...' : 'Ask about Nguyen Xuan Hai...'}
              maxLength={600}
              disabled={!preferredLanguage}
            />
            <button type="submit" disabled={loading || !input.trim() || !preferredLanguage}>
              Send
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default ChatWidget;

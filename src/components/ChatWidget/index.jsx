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
const CHAT_FULLSCREEN_KEY = 'nxh_chat_fullscreen_v1';
const SUPPORTED_TEXT_TYPES = new Set(['text/plain', 'text/markdown', 'application/json']);

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

  if (action.type === 'rich') {
    return (
      <div className="chat-action-card chat-rich-card">
        {Array.isArray(action.highlights) && action.highlights.length > 0 ? (
          <ul>
            {action.highlights.map((item, index) => (
              <li key={`highlight-${index}`}>{item}</li>
            ))}
          </ul>
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
            <p><strong>Match:</strong> {action.fitSummary.matchLevel || 'unknown'}</p>

            {Array.isArray(action.fitSummary.strongMatches) && action.fitSummary.strongMatches.length > 0 ? (
              <>
                <p><strong>Strong matches</strong></p>
                <ul>
                  {action.fitSummary.strongMatches.map((item, index) => (
                    <li key={`strong-${index}`}>{item}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {Array.isArray(action.fitSummary.gaps) && action.fitSummary.gaps.length > 0 ? (
              <>
                <p><strong>Gaps</strong></p>
                <ul>
                  {action.fitSummary.gaps.map((item, index) => (
                    <li key={`gap-${index}`}>{item}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {action.fitSummary.recommendation ? (
              <p><strong>Recommendation:</strong> {action.fitSummary.recommendation}</p>
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

const ChatWidget = ({ mode = 'floating' }) => {
  const isStandalonePage = mode === 'page';
  const initialMessages = useMemo(
    () => [
      createMessage('assistant', WELCOME_MESSAGE),
    ],
    []
  );

  const { messages, setMessages, clearSession } = useChatSession(initialMessages);
  const [open, setOpen] = useState(isStandalonePage);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(() => {
    if (isStandalonePage) return true;
    return localStorage.getItem(CHAT_FULLSCREEN_KEY) === '1';
  });
  const [lastModelUsed, setLastModelUsed] = useState(null);
  const [preferredLanguage, setPreferredLanguage] = useState(() => localStorage.getItem(CHAT_LANGUAGE_KEY) || '');
  const [showIntroSpotlight, setShowIntroSpotlight] = useState(() => !sessionStorage.getItem(CHAT_INTRO_DISMISSED_KEY));
  const [jobDescription, setJobDescription] = useState('');
  const [jobDescriptionFile, setJobDescriptionFile] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const language = preferredLanguage || 'en';

  const fallbackSuggestions = useMemo(() => suggestionsByIntent(language), [language]);
  const suggestions = aiSuggestions.length > 0 ? aiSuggestions : fallbackSuggestions;

  const handleClear = () => {
    clearSession(initialMessages);
    setLastModelUsed(null);
    setAiSuggestions([]);
  };

  const handleOpenChat = () => {
    setOpen(true);
    setShowIntroSpotlight(false);
    sessionStorage.setItem(CHAT_INTRO_DISMISSED_KEY, '1');
  };

  const handleToggleFullscreen = () => {
    if (isStandalonePage) return;
    setIsFullscreen((prev) => !prev);
  };

  const handleOpenInNewTab = () => {
    window.open('/assistant', '_blank', 'noopener,noreferrer');
  };

  const handleQuickMail = () => {
    const subject = encodeURIComponent('Portfolio Inquiry - Nguyen Xuan Hai');
    const body = encodeURIComponent('Hello Hai,\n\nI would like to discuss an opportunity.');
    window.location.href = `mailto:${PROFILE_CONTEXT.contacts.email}?subject=${subject}&body=${body}`;
  };

  const handleQuickLinkedIn = () => {
    window.open(PROFILE_CONTEXT.socials.linkedin, '_blank', 'noopener,noreferrer');
  };

  const handleQuickCV = () => {
    window.open(PROFILE_CONTEXT.cvUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSelectLanguage = (lang) => {
    setPreferredLanguage(lang);
    appendMessage(createMessage('assistant', lang === 'vi'
      ? 'Đã chọn tiếng Việt. Bạn có thể hỏi về CV, dự án, kinh nghiệm hoặc liên hệ.'
      : 'English selected. You can ask about CV, projects, experience, or contact links.',
    { modelUsed: 'local-onboarding' }));
  };

  const handleJDUploadClick = () => {
    fileInputRef.current?.click();
  };

  const appendSystemNotice = (text) => {
    appendMessage(createMessage('assistant', text, { modelUsed: 'local-system' }));
  };

  const handleJDFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isTextByType = SUPPORTED_TEXT_TYPES.has(file.type);
    const isTextByExtension = /\.(txt|md|json)$/i.test(file.name);

    if (!isTextByType && !isTextByExtension) {
      appendSystemNotice(
        language === 'vi'
          ? 'Hiện tại chỉ hỗ trợ đọc file JD dạng text (.txt, .md). Bạn có thể dán nội dung JD trực tiếp vào chat.'
          : 'Currently only text JD files (.txt, .md) are supported. Please paste JD content directly in chat.'
      );
      event.target.value = '';
      return;
    }

    try {
      const content = await file.text();
      const normalized = content.trim().slice(0, 7000);
      if (!normalized) {
        appendSystemNotice(language === 'vi' ? 'File JD trong.' : 'The uploaded JD file is empty.');
      } else {
        setJobDescription(normalized);
        setJobDescriptionFile(file.name);
        appendSystemNotice(
          language === 'vi'
            ? `Đã nạp JD: ${file.name}. Bây giờ bạn có thể hỏi độ phù hợp với vị trí.`
            : `JD loaded: ${file.name}. You can now ask about role fit.`
        );
      }
    } catch (error) {
      appendSystemNotice(language === 'vi' ? 'Không thể đọc file JD.' : 'Unable to read the JD file.');
    }

    event.target.value = '';
  };

  const clearJDContext = () => {
    setJobDescription('');
    setJobDescriptionFile('');
  };

  const appendMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
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
        systemPrompt: buildPortfolioSystemPrompt(language, Boolean(jobDescription)),
        jobDescription,
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
      action: payload.structuredResponse
        ? {
          type: 'rich',
          ...payload.structuredResponse,
        }
        : null,
      suggestions: payload?.structuredResponse?.suggestions || [],
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
      setAiSuggestions(Array.isArray(modelReply.suggestions) ? modelReply.suggestions : []);
      appendMessage(createMessage('assistant', modelReply.content, {
        modelUsed: modelReply.modelUsed,
        action: modelReply.action,
      }));
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

  const formatTranscript = () => {
    const header = `Portfolio Assistant Transcript\nGenerated: ${new Date().toLocaleString()}\n\n`;
    const body = messages
      .map((message) => {
        const role = message.role === 'user' ? 'User' : 'Assistant';
        return `[${role}] ${message.content}`;
      })
      .join('\n\n');
    return `${header}${body}`;
  };

  const handleCopyTranscript = async () => {
    const transcript = formatTranscript();

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(transcript);
        appendSystemNotice(language === 'vi' ? 'Đã sao chép transcript.' : 'Transcript copied.');
      } else {
        appendSystemNotice(language === 'vi' ? 'Trình duyệt không hỗ trợ clipboard API.' : 'Clipboard API is not available.');
      }
    } catch (error) {
      appendSystemNotice(language === 'vi' ? 'Không thể sao chép transcript.' : 'Unable to copy transcript.');
    }
  };

  const handleExportTranscriptTxt = () => {
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
  };

  const handleRegenerateLastAnswer = async () => {
    if (loading) return;

    const lastUserIndex = [...messages].map((item) => item.role).lastIndexOf('user');
    if (lastUserIndex === -1) {
      appendSystemNotice(language === 'vi' ? 'Chưa có câu hỏi để tạo lại câu trả lời.' : 'No user question to regenerate from.');
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
          language === 'vi'
            ? 'Không thể tạo lại câu trả lời lúc này. Vui lòng thử lại sau.'
            : 'Unable to regenerate the answer right now. Please try again later.',
          { modelUsed: 'error-fallback' }
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isStandalonePage && !open ? (
        <button
          type="button"
          className="chat-launcher"
          onClick={handleOpenChat}
          aria-label="Open AI portfolio assistant"
        >
          <span>AI Assistant</span>
        </button>
      ) : null}

      {showIntroSpotlight && !open && !isStandalonePage ? (
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

      <section className={`chat-panel ${open ? 'open' : ''} ${isFullscreen ? 'fullscreen' : ''} ${isStandalonePage ? 'page-mode' : ''}`} aria-hidden={!open}>
        <header className="chat-header">
          <div>
            <h3>Portfolio Assistant</h3>
            <p>Ask about CV, projects, and experience.</p>
            {lastModelUsed ? <small className="chat-model-meta">Model: {lastModelUsed}</small> : null}
          </div>
          <div className="chat-header-actions">
            {!isStandalonePage ? (
              <button type="button" onClick={handleToggleFullscreen}>
                {isFullscreen ? 'Window' : 'Fullscreen'}
              </button>
            ) : null}
            {!isStandalonePage ? (
              <button type="button" onClick={handleOpenInNewTab}>Open Tab</button>
            ) : null}
            <button type="button" onClick={handleCopyTranscript}>Copy</button>
            <button type="button" onClick={handleExportTranscriptTxt}>TXT</button>
            <button type="button" onClick={handleRegenerateLastAnswer} disabled={loading}>Regenerate</button>
            <button type="button" onClick={handleClear}>Clear</button>
            {!isStandalonePage ? <button type="button" onClick={() => setOpen(false)}>Close</button> : null}
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
            <p>Choose your chat language / Chọn ngôn ngữ trò chuyện</p>
            <div className="chat-language-actions">
              <button type="button" onClick={() => handleSelectLanguage('vi')}>Tiếng Việt</button>
              <button type="button" onClick={() => handleSelectLanguage('en')}>English</button>
            </div>
          </div>
        ) : null}

        <div className="chat-input-wrap">
          <div className="chat-quick-actions">
            <button type="button" onClick={handleQuickMail}>{language === 'vi' ? 'Gửi mail nhanh' : 'Quick Email'}</button>
            <button type="button" onClick={handleQuickLinkedIn}>LinkedIn</button>
            <button type="button" onClick={handleQuickCV}>CV</button>
          </div>

          <div className="chat-context-row">
            <button type="button" className="chat-context-btn" onClick={handleJDUploadClick}>
              {language === 'vi' ? 'Tải JD (.txt/.md)' : 'Upload JD (.txt/.md)'}
            </button>
            {jobDescription ? (
              <div className="chat-jd-pill" role="status" aria-live="polite">
                <span>{jobDescriptionFile || (language === 'vi' ? 'JD đã nạp' : 'JD loaded')}</span>
                <button type="button" onClick={clearJDContext}>x</button>
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
              placeholder={language === 'vi' ? 'Đặt câu hỏi cho Nguyễn Xuân Hải...' : 'Ask about Nguyen Xuan Hai...'}
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

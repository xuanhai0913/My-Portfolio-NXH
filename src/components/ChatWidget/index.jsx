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
const CHAT_RESPONSE_STYLE_KEY = 'nxh_chat_response_style_v1';
const SUPPORTED_TEXT_TYPES = new Set(['text/plain', 'text/markdown', 'application/json']);
const CONTACT_TRIGGER_REGEX = /(liên hệ|lien he|contact|email|mail|linkedin|cv|resume|kết nối|ket noi|phone|sđt|sdt)/i;

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

function parseJsonLikeAssistantContent(content) {
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
      displayText: answer || 'Structured response parsed from fallback.',
      action: {
        type: 'rich',
        answer: answer || '',
        highlights: fallbackHighlights,
        links: [],
        fitSummary: null,
        suggestions: [],
      },
    };
  }

  const answer = getCaseInsensitiveField(parsed, 'answer');
  const highlights = getCaseInsensitiveField(parsed, 'highlights');
  const links = getCaseInsensitiveField(parsed, 'links');
  const fitSummary = getCaseInsensitiveField(parsed, 'fitSummary');

  if (!answer && !Array.isArray(highlights) && !Array.isArray(links) && !fitSummary) {
    return null;
  }

  return {
    displayText: typeof answer === 'string' ? answer : 'Structured response',
    action: {
      type: 'rich',
      answer: typeof answer === 'string' ? answer : '',
      highlights: Array.isArray(highlights) ? highlights : [],
      links: Array.isArray(links) ? links : [],
      fitSummary: fitSummary && typeof fitSummary === 'object' ? fitSummary : null,
      suggestions: [],
    },
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
  const [responseStyle, setResponseStyle] = useState(() => localStorage.getItem(CHAT_RESPONSE_STYLE_KEY) || 'brief');
  const [toast, setToast] = useState(null);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const toastTimeoutRef = useRef(null);

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

  useEffect(() => () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
  }, []);

  const language = preferredLanguage || 'en';

  const fallbackSuggestions = useMemo(() => suggestionsByIntent(language), [language]);
  const suggestions = aiSuggestions.length > 0 ? aiSuggestions : fallbackSuggestions;
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

  const handleChangeResponseStyle = (nextStyle) => {
    setResponseStyle(nextStyle);
    showToast(
      language === 'vi'
        ? `Đã chuyển style trả lời: ${nextStyle}.`
        : `Response style switched to: ${nextStyle}.`
    );
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

  const handleJDFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isTextByType = SUPPORTED_TEXT_TYPES.has(file.type);
    const isTextByExtension = /\.(txt|md|json)$/i.test(file.name);

    if (!isTextByType && !isTextByExtension) {
      showToast(
        language === 'vi'
          ? 'Hiện tại chỉ hỗ trợ đọc file JD dạng text (.txt, .md). Bạn có thể dán nội dung JD trực tiếp vào chat.'
          : 'Currently only text JD files (.txt, .md) are supported. Please paste JD content directly in chat.',
        'error'
      );
      event.target.value = '';
      return;
    }

    try {
      const content = await file.text();
      const normalized = content.trim().slice(0, 7000);
      if (!normalized) {
        showToast(language === 'vi' ? 'File JD trống.' : 'The uploaded JD file is empty.', 'error');
      } else {
        setJobDescription(normalized);
        setJobDescriptionFile(file.name);
        showToast(
          language === 'vi'
            ? `Đã nạp JD: ${file.name}. Bây giờ bạn có thể hỏi độ phù hợp với vị trí.`
            : `JD loaded: ${file.name}. You can now ask about role fit.`
        );
      }
    } catch (error) {
      showToast(language === 'vi' ? 'Không thể đọc file JD.' : 'Unable to read the JD file.', 'error');
    }

    event.target.value = '';
  };

  const clearJDContext = () => {
    setJobDescription('');
    setJobDescriptionFile('');
    showToast(language === 'vi' ? 'Đã xoá ngữ cảnh JD.' : 'JD context removed.');
  };

  const appendMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const showToast = (text, type = 'info') => {
    if (!text) return;
    setToast({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      type,
    });

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2600);
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
        showToast(language === 'vi' ? 'Đã sao chép transcript.' : 'Transcript copied.');
      } else {
        showToast(language === 'vi' ? 'Trình duyệt không hỗ trợ clipboard API.' : 'Clipboard API is not available.', 'error');
      }
    } catch (error) {
      showToast(language === 'vi' ? 'Không thể sao chép transcript.' : 'Unable to copy transcript.', 'error');
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
    showToast(language === 'vi' ? 'Đã xuất file TXT.' : 'TXT export completed.');
  };

  const handleExportTranscriptPdf = () => {
    const transcript = formatTranscript();
    const escaped = transcript
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
    if (!printWindow) {
      showToast(language === 'vi' ? 'Không thể mở cửa sổ in PDF.' : 'Unable to open print window for PDF.', 'error');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Chat Session Export</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; line-height: 1.5; }
            h1 { font-size: 20px; margin-bottom: 16px; }
            pre { white-space: pre-wrap; word-break: break-word; border: 1px solid #ddd; padding: 16px; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>Portfolio Assistant Session</h1>
          <pre>${escaped}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    showToast(language === 'vi' ? 'Đã mở hộp thoại in PDF.' : 'PDF print dialog opened.');
  };

  const handleRegenerateLastAnswer = async () => {
    if (loading) return;

    const lastUserIndex = [...messages].map((item) => item.role).lastIndexOf('user');
    if (lastUserIndex === -1) {
      showToast(language === 'vi' ? 'Chưa có câu hỏi để tạo lại câu trả lời.' : 'No user question to regenerate from.', 'error');
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
        {toast ? (
          <div className={`chat-toast ${toast.type === 'error' ? 'error' : ''}`} role="status" aria-live="polite">
            {toast.text}
          </div>
        ) : null}

        <header className="chat-header">
          <div>
            <h3>Portfolio Assistant</h3>
            <p>Ask about CV, projects, and experience.</p>
            {lastModelUsed ? <small className="chat-model-meta">Model: {lastModelUsed}</small> : null}
          </div>
          <div className="chat-header-actions">
            {!isStandalonePage ? (
              <div className="chat-window-controls">
                <button type="button" onClick={handleToggleFullscreen}>
                  {isFullscreen ? 'Window' : 'Fullscreen'}
                </button>
                <button type="button" onClick={handleOpenInNewTab}>Open Tab</button>
                <button type="button" onClick={() => setOpen(false)}>Hide</button>
              </div>
            ) : null}

            <div className="chat-utility-controls">
              <button type="button" onClick={handleCopyTranscript}>Copy</button>
              <button type="button" onClick={handleExportTranscriptTxt}>TXT</button>
              <button type="button" onClick={handleExportTranscriptPdf}>PDF</button>
              <button type="button" onClick={handleRegenerateLastAnswer} disabled={loading}>Regenerate</button>
              <button type="button" onClick={handleClear}>Clear</button>
            </div>
          </div>
        </header>

        <div className="chat-body" role="log" aria-live="polite" ref={chatBodyRef}>
          {messages.map((message) => {
            const parsedAssistantContent = message.role === 'assistant' && !message.action
              ? parseJsonLikeAssistantContent(message.content)
              : null;

            const displayText = parsedAssistantContent?.displayText || message.content;
            const displayAction = message.action || parsedAssistantContent?.action || null;

            return (
              <article key={message.id} className={`chat-message ${message.role}`}>
                <p>{displayText}</p>
                {displayAction ? <ActionCard action={displayAction} /> : null}
              </article>
            );
          })}

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
          <div className="chat-style-row">
            <span>{language === 'vi' ? 'Style:' : 'Style:'}</span>
            <div className="chat-style-actions">
              {['brief', 'detailed', 'fit'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className={responseStyle === item ? 'active' : ''}
                  onClick={() => handleChangeResponseStyle(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {shouldShowContactActions ? (
            <div className="chat-quick-actions">
              <button type="button" onClick={handleQuickMail}>{language === 'vi' ? 'Gửi mail nhanh' : 'Quick Email'}</button>
              <button type="button" onClick={handleQuickLinkedIn}>LinkedIn</button>
              <button type="button" onClick={handleQuickCV}>CV</button>
            </div>
          ) : null}

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

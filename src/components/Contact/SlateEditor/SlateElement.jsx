import React from 'react';
import { Transforms } from 'slate';
import { useSlateStatic, ReactEditor } from 'slate-react';

const SlateElement = ({ attributes, children, element }) => {
  const editor = useSlateStatic();

  const toggleChecklist = (e) => {
    e.preventDefault();
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(
      editor,
      { checked: !element.checked },
      { at: path }
    );
  };

  switch (element.type) {
    case 'heading-one':
      return <h1 {...attributes} className="slate-h1">{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes} className="slate-h2">{children}</h2>;
    case 'heading-three':
      return <h3 {...attributes} className="slate-h3">{children}</h3>;
    case 'block-quote':
      return <blockquote {...attributes} className="slate-blockquote">{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes} className="slate-ul">{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes} className="slate-ol">{children}</ol>;
    case 'list-item':
      return <li {...attributes} className="slate-li">{children}</li>;
    case 'code-block':
      return <pre {...attributes} className="slate-code-block"><code>{children}</code></pre>;
    case 'image':
      return (
        <div {...attributes} className="slate-image-block" contentEditable={false}>
          <img
            src={element.url}
            alt=""
            className="slate-image"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="slate-image-url">{element.url}</span>
          {children}
        </div>
      );
    case 'divider':
      return (
        <div {...attributes} contentEditable={false} className="slate-divider-wrapper">
          <hr className="slate-divider" />
          {children}
        </div>
      );
    case 'callout':
      return (
        <div {...attributes} className="slate-callout">
          <span className="slate-callout-icon" contentEditable={false}>{'\u26A1'}</span>
          <div className="slate-callout-content">{children}</div>
        </div>
      );
    case 'checklist-item':
      return (
        <div {...attributes} className="slate-checklist-item">
          <button
            type="button"
            contentEditable={false}
            className={`slate-checklist-toggle ${element.checked ? 'checked' : ''}`}
            onMouseDown={toggleChecklist}
            aria-label="Toggle checklist item"
          >
            {element.checked ? '\u2611' : '\u2610'}
          </button>
          <span className={`slate-checklist-text ${element.checked ? 'done' : ''}`}>{children}</span>
        </div>
      );
    case 'cta-button': {
      const label = element.label || 'View details';
      return (
        <div {...attributes} contentEditable={false} className="slate-cta-wrapper">
          <a
            href={element.url}
            className="slate-cta-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            {label}
          </a>
          {children}
        </div>
      );
    }
    case 'two-columns':
      return (
        <div {...attributes} className="slate-two-columns">
          {children}
        </div>
      );
    case 'column':
      return (
        <div {...attributes} className="slate-column">
          {children}
        </div>
      );
    default:
      return <p {...attributes} className="slate-paragraph">{children}</p>;
  }
};

export default SlateElement;

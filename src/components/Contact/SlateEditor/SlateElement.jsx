import React from 'react';

const SlateElement = ({ attributes, children, element }) => {
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
    default:
      return <p {...attributes} className="slate-paragraph">{children}</p>;
  }
};

export default SlateElement;

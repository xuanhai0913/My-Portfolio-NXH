import { Editor, Transforms, Element as SlateElement } from 'slate';
import { BLOCK_TYPES, LIST_TYPES, VOID_TYPES, generateId } from './slateConstants';

// ── Mark helpers ──

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export const toggleMark = (editor, format) => {
  if (isMarkActive(editor, format)) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

// ── Link helpers (mark-based) ──

export const isLinkActive = (editor) => {
  const marks = Editor.marks(editor);
  return marks ? marks.link === true : false;
};

export const insertLink = (editor, url) => {
  if (isLinkActive(editor)) {
    Editor.removeMark(editor, 'link');
    Editor.removeMark(editor, 'linkUrl');
  } else {
    Editor.addMark(editor, 'link', true);
    Editor.addMark(editor, 'linkUrl', url);
  }
};

// ── Block helpers ──

export const isBlockActive = (editor, format) => {
  const { selection } = editor;
  if (!selection) return false;
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    })
  );
  return !!match;
};

export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive
      ? BLOCK_TYPES.PARAGRAPH
      : isList
      ? BLOCK_TYPES.LIST_ITEM
      : format,
  });

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, {
      type: format,
      children: [],
    });
  }
};

// ── Void insert helpers ──

export const insertImage = (editor, url) => {
  const imageNode = {
    id: generateId(),
    type: BLOCK_TYPES.IMAGE,
    url,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, imageNode);
  Transforms.insertNodes(editor, {
    id: generateId(),
    type: BLOCK_TYPES.PARAGRAPH,
    children: [{ text: '' }],
  });
};

export const insertDivider = (editor) => {
  const dividerNode = {
    id: generateId(),
    type: BLOCK_TYPES.DIVIDER,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, dividerNode);
  Transforms.insertNodes(editor, {
    id: generateId(),
    type: BLOCK_TYPES.PARAGRAPH,
    children: [{ text: '' }],
  });
};

// ── Slate plugins ──

export const withNodeId = (editor) => {
  const { apply } = editor;

  editor.apply = (operation) => {
    if (
      (operation.type === 'insert_node' || operation.type === 'split_node') &&
      operation.node &&
      operation.node.type &&
      !operation.node.id
    ) {
      return apply({
        ...operation,
        node: { ...operation.node, id: generateId() },
      });
    }
    return apply(operation);
  };

  return editor;
};

export const withVoids = (editor) => {
  const { isVoid } = editor;
  editor.isVoid = (element) =>
    VOID_TYPES.includes(element.type) ? true : isVoid(element);
  return editor;
};

// ── Serialization (EmailJS-friendly HTML) ──

const escapeHtml = (value = '') => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const sanitizeUrl = (url = '') => {
  const trimmed = String(url).trim();
  if (!trimmed) return '';
  if (/^(https?:|mailto:)/i.test(trimmed)) return trimmed;
  return '';
};

const serializeInlineNodeToHtml = (node) => {
  if (!('text' in node)) return '';

  let text = escapeHtml(node.text || '');
  if (!text && !node.link) return '';

  if (node.code) text = `<code>${text}</code>`;
  if (node.bold) text = `<strong>${text}</strong>`;
  if (node.italic) text = `<em>${text}</em>`;
  if (node.underline) text = `<u>${text}</u>`;
  if (node.strikethrough) text = `<del>${text}</del>`;

  if (node.link && node.linkUrl) {
    const href = sanitizeUrl(node.linkUrl);
    if (href) {
      text = `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${text || escapeHtml(href)}</a>`;
    }
  }

  return text;
};

const serializeNodeToHtml = (node) => {
  if ('text' in node) {
    return serializeInlineNodeToHtml(node);
  }

  const children = (node.children || []).map((n) => serializeNodeToHtml(n)).join('');

  switch (node.type) {
    case BLOCK_TYPES.HEADING_ONE:
      return children ? `<h1>${children}</h1>` : '';
    case BLOCK_TYPES.HEADING_TWO:
      return children ? `<h2>${children}</h2>` : '';
    case BLOCK_TYPES.HEADING_THREE:
      return children ? `<h3>${children}</h3>` : '';
    case BLOCK_TYPES.BLOCK_QUOTE:
      return children ? `<blockquote>${children}</blockquote>` : '';
    case BLOCK_TYPES.BULLETED_LIST:
      return children ? `<ul>${children}</ul>` : '';
    case BLOCK_TYPES.NUMBERED_LIST:
      return children ? `<ol>${children}</ol>` : '';
    case BLOCK_TYPES.LIST_ITEM:
      return children ? `<li>${children}</li>` : '';
    case BLOCK_TYPES.CODE_BLOCK:
      return children ? `<pre><code>${children}</code></pre>` : '';
    case BLOCK_TYPES.IMAGE: {
      const src = sanitizeUrl(node.url);
      if (!src) return '';
      return `<img src="${escapeHtml(src)}" alt="User uploaded image" style="max-width:100%;height:auto;display:block;" />`;
    }
    case BLOCK_TYPES.DIVIDER:
      return '<hr />';
    case BLOCK_TYPES.CALLOUT:
      return children
        ? `<blockquote><strong>&#9889; Note:</strong> ${children}</blockquote>`
        : '';
    default:
      return children ? `<p>${children}</p>` : '';
  }
};

export const serializeToEmailHtml = (nodes) => {
  return nodes
    .map((n) => serializeNodeToHtml(n))
    .filter(Boolean)
    .join('');
};

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

// ── Serialization (Markdown-like plain text for EmailJS) ──

const serializeNode = (node) => {
  if ('text' in node) {
    let text = node.text;
    if (!text && !node.link) return '';
    if (node.bold) text = `**${text}**`;
    if (node.italic) text = `_${text}_`;
    if (node.code) text = `\`${text}\``;
    if (node.strikethrough) text = `~~${text}~~`;
    if (node.link && node.linkUrl) text = `[${text}](${node.linkUrl})`;
    return text;
  }

  const children = (node.children || []).map(n => serializeNode(n)).join('');

  switch (node.type) {
    case BLOCK_TYPES.HEADING_ONE:
      return `# ${children}`;
    case BLOCK_TYPES.HEADING_TWO:
      return `## ${children}`;
    case BLOCK_TYPES.HEADING_THREE:
      return `### ${children}`;
    case BLOCK_TYPES.BLOCK_QUOTE:
      return `> ${children}`;
    case BLOCK_TYPES.BULLETED_LIST:
    case BLOCK_TYPES.NUMBERED_LIST:
      return children;
    case BLOCK_TYPES.LIST_ITEM:
      return `- ${children}`;
    case BLOCK_TYPES.CODE_BLOCK:
      return `\`\`\`\n${children}\n\`\`\``;
    case BLOCK_TYPES.IMAGE:
      return `[Image: ${node.url || ''}]`;
    case BLOCK_TYPES.DIVIDER:
      return '---';
    case BLOCK_TYPES.CALLOUT:
      return `> \u26A1 ${children}`;
    default:
      return children;
  }
};

export const serializeToPlainText = (nodes) => {
  return nodes.map(n => serializeNode(n)).join('\n');
};

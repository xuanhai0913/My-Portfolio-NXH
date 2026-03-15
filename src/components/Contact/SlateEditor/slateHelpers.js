import { Editor, Transforms, Element as SlateElement } from 'slate';
import { BLOCK_TYPES, LIST_TYPES, generateId } from './slateConstants';

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

// ── Slate plugin: auto-assign IDs to new element nodes ──

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

// ── Serialization (Markdown-like plain text for EmailJS) ──

const serializeNode = (node) => {
  if ('text' in node) {
    let text = node.text;
    if (!text) return '';
    if (node.bold) text = `**${text}**`;
    if (node.italic) text = `_${text}_`;
    if (node.code) text = `\`${text}\``;
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
    default:
      return children;
  }
};

export const serializeToPlainText = (nodes) => {
  return nodes.map(n => serializeNode(n)).join('\n');
};

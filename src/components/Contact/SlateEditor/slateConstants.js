export const BLOCK_TYPES = {
  PARAGRAPH: 'paragraph',
  HEADING_ONE: 'heading-one',
  HEADING_TWO: 'heading-two',
  HEADING_THREE: 'heading-three',
  BLOCK_QUOTE: 'block-quote',
  BULLETED_LIST: 'bulleted-list',
  NUMBERED_LIST: 'numbered-list',
  LIST_ITEM: 'list-item',
  CODE_BLOCK: 'code-block',
  IMAGE: 'image',
  DIVIDER: 'divider',
  CALLOUT: 'callout',
  CHECKLIST_ITEM: 'checklist-item',
  CTA_BUTTON: 'cta-button',
  TWO_COLUMNS: 'two-columns',
  COLUMN: 'column',
};

export const MARK_TYPES = {
  BOLD: 'bold',
  ITALIC: 'italic',
  UNDERLINE: 'underline',
  CODE: 'code',
  STRIKETHROUGH: 'strikethrough',
};

export const HOTKEYS = {
  'mod+b': MARK_TYPES.BOLD,
  'mod+i': MARK_TYPES.ITALIC,
  'mod+u': MARK_TYPES.UNDERLINE,
  'mod+`': MARK_TYPES.CODE,
  'mod+shift+x': MARK_TYPES.STRIKETHROUGH,
};

export const LIST_TYPES = [BLOCK_TYPES.BULLETED_LIST, BLOCK_TYPES.NUMBERED_LIST];

export const VOID_TYPES = [
  BLOCK_TYPES.IMAGE,
  BLOCK_TYPES.DIVIDER,
  BLOCK_TYPES.CTA_BUTTON,
];

export const SLASH_MENU_ITEMS = [
  { label: 'Paragraph', type: BLOCK_TYPES.PARAGRAPH, icon: 'P', description: 'Plain text' },
  { label: 'Heading 1', type: BLOCK_TYPES.HEADING_ONE, icon: 'H1', description: 'Large heading' },
  { label: 'Heading 2', type: BLOCK_TYPES.HEADING_TWO, icon: 'H2', description: 'Medium heading' },
  { label: 'Heading 3', type: BLOCK_TYPES.HEADING_THREE, icon: 'H3', description: 'Small heading' },
  { label: 'Blockquote', type: BLOCK_TYPES.BLOCK_QUOTE, icon: '>', description: 'Quote block' },
  { label: 'Bulleted List', type: BLOCK_TYPES.BULLETED_LIST, icon: '\u2022', description: 'Unordered list' },
  { label: 'Numbered List', type: BLOCK_TYPES.NUMBERED_LIST, icon: '1.', description: 'Ordered list' },
  { label: 'Code Block', type: BLOCK_TYPES.CODE_BLOCK, icon: '</>', description: 'Code snippet' },
  { label: 'Image', type: BLOCK_TYPES.IMAGE, icon: '\uD83D\uDDBC', description: 'Search Unsplash or paste URL', action: 'prompt-image' },
  { label: 'Divider', type: BLOCK_TYPES.DIVIDER, icon: '\u2014', description: 'Horizontal separator', action: 'insert-void' },
  { label: 'Callout', type: BLOCK_TYPES.CALLOUT, icon: '\u26A1', description: 'Highlighted tip or note' },
  { label: 'Checklist', type: BLOCK_TYPES.CHECKLIST_ITEM, icon: '\u2611', description: 'Task list item', action: 'insert-checklist' },
  { label: 'Button CTA', type: BLOCK_TYPES.CTA_BUTTON, icon: 'CTA', description: 'Stylish call-to-action button', action: 'insert-cta' },
  { label: 'Two Columns', type: BLOCK_TYPES.TWO_COLUMNS, icon: '2C', description: 'Side-by-side content blocks', action: 'insert-two-columns' },
];

let _nextId = 0;
export const generateId = () => `sblock-${Date.now()}-${++_nextId}`;

export const INITIAL_VALUE = [
  { id: generateId(), type: BLOCK_TYPES.PARAGRAPH, children: [{ text: '' }] },
];

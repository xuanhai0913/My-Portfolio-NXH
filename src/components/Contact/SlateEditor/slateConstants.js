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
  { key: 'paragraph', type: BLOCK_TYPES.PARAGRAPH, icon: 'P' },
  { key: 'headingOne', type: BLOCK_TYPES.HEADING_ONE, icon: 'H1' },
  { key: 'headingTwo', type: BLOCK_TYPES.HEADING_TWO, icon: 'H2' },
  { key: 'headingThree', type: BLOCK_TYPES.HEADING_THREE, icon: 'H3' },
  { key: 'blockquote', type: BLOCK_TYPES.BLOCK_QUOTE, icon: '>' },
  { key: 'bulletedList', type: BLOCK_TYPES.BULLETED_LIST, icon: '\u2022' },
  { key: 'numberedList', type: BLOCK_TYPES.NUMBERED_LIST, icon: '1.' },
  { key: 'codeBlock', type: BLOCK_TYPES.CODE_BLOCK, icon: '</>' },
  { key: 'image', type: BLOCK_TYPES.IMAGE, icon: '\uD83D\uDDBC', action: 'prompt-image' },
  { key: 'divider', type: BLOCK_TYPES.DIVIDER, icon: '\u2014', action: 'insert-void' },
  { key: 'callout', type: BLOCK_TYPES.CALLOUT, icon: '\u26A1' },
  { key: 'checklist', type: BLOCK_TYPES.CHECKLIST_ITEM, icon: '\u2611', action: 'insert-checklist' },
  { key: 'cta', type: BLOCK_TYPES.CTA_BUTTON, icon: 'CTA', action: 'insert-cta' },
  { key: 'twoColumns', type: BLOCK_TYPES.TWO_COLUMNS, icon: '2C', action: 'insert-two-columns' },
];

let _nextId = 0;
export const generateId = () => `sblock-${Date.now()}-${++_nextId}`;

export const INITIAL_VALUE = [
  { id: generateId(), type: BLOCK_TYPES.PARAGRAPH, children: [{ text: '' }] },
];

import React from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import {
  isMarkActive,
  toggleMark,
  isBlockActive,
  toggleBlock,
  insertDivider,
  insertLink,
  isLinkActive,
  insertChecklistItem,
  insertCtaButton,
  insertTwoColumns,
} from './slateHelpers';
import { MARK_TYPES, BLOCK_TYPES } from './slateConstants';

const MarkButton = ({ format, icon }) => {
  const editor = useSlate();
  const isActive = isMarkActive(editor, format);
  return (
    <button
      type="button"
      className={`slate-toolbar-btn ${isActive ? 'active' : ''}`}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
      title={format}
    >
      {icon}
    </button>
  );
};

const BlockButton = ({ format, icon }) => {
  const editor = useSlate();
  const isActive = isBlockActive(editor, format);
  return (
    <button
      type="button"
      className={`slate-toolbar-btn ${isActive ? 'active' : ''}`}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
      title={format}
    >
      {icon}
    </button>
  );
};

const LinkButton = () => {
  const editor = useSlate();
  const isActive = isLinkActive(editor);
  return (
    <button
      type="button"
      className={`slate-toolbar-btn ${isActive ? 'active' : ''}`}
      onMouseDown={(e) => {
        e.preventDefault();
        if (isActive) {
          Editor.removeMark(editor, 'link');
          Editor.removeMark(editor, 'linkUrl');
        } else {
          const url = window.prompt('Enter URL:');
          if (url) {
            insertLink(editor, url);
          }
        }
      }}
      title="Link"
    >
      {'\uD83D\uDD17'}
    </button>
  );
};

const DividerButton = () => {
  const editor = useSlate();
  return (
    <button
      type="button"
      className="slate-toolbar-btn"
      onMouseDown={(e) => {
        e.preventDefault();
        insertDivider(editor);
      }}
      title="Divider"
    >
      {'\u2014'}
    </button>
  );
};

const ImageButton = ({ onRequestImage }) => {
  return (
    <button
      type="button"
      className="slate-toolbar-btn"
      onMouseDown={(e) => {
        e.preventDefault();
        if (onRequestImage) onRequestImage();
      }}
      title="Image"
    >
      {'\uD83D\uDDBC'}
    </button>
  );
};

const ChecklistButton = () => {
  const editor = useSlate();
  return (
    <button
      type="button"
      className="slate-toolbar-btn"
      onMouseDown={(e) => {
        e.preventDefault();
        insertChecklistItem(editor);
      }}
      title="Checklist"
    >
      {'\u2611'}
    </button>
  );
};

const CtaButton = () => {
  const editor = useSlate();
  return (
    <button
      type="button"
      className="slate-toolbar-btn"
      onMouseDown={(e) => {
        e.preventDefault();
        const label = window.prompt('Button text:', 'Reply now');
        if (label === null) return;
        const url = window.prompt('Button URL:', 'https://');
        if (!url) return;
        insertCtaButton(editor, label, url);
      }}
      title="Button CTA"
    >
      CTA
    </button>
  );
};

const TwoColumnsButton = () => {
  const editor = useSlate();
  return (
    <button
      type="button"
      className="slate-toolbar-btn"
      onMouseDown={(e) => {
        e.preventDefault();
        insertTwoColumns(editor);
      }}
      title="Two Columns"
    >
      2C
    </button>
  );
};

const SlateToolbar = ({ onRequestImage }) => (
  <div className="slate-toolbar">
    <div className="slate-toolbar-group">
      <MarkButton format={MARK_TYPES.BOLD} icon="B" />
      <MarkButton format={MARK_TYPES.ITALIC} icon="I" />
      <MarkButton format={MARK_TYPES.UNDERLINE} icon="U" />
      <MarkButton format={MARK_TYPES.STRIKETHROUGH} icon="S" />
      <MarkButton format={MARK_TYPES.CODE} icon="<>" />
      <LinkButton />
    </div>
    <div className="slate-toolbar-separator" />
    <div className="slate-toolbar-group">
      <BlockButton format={BLOCK_TYPES.HEADING_ONE} icon="H1" />
      <BlockButton format={BLOCK_TYPES.HEADING_TWO} icon="H2" />
      <BlockButton format={BLOCK_TYPES.HEADING_THREE} icon="H3" />
      <BlockButton format={BLOCK_TYPES.BLOCK_QUOTE} icon="Q" />
      <BlockButton format={BLOCK_TYPES.BULLETED_LIST} icon="UL" />
      <BlockButton format={BLOCK_TYPES.NUMBERED_LIST} icon="OL" />
      <BlockButton format={BLOCK_TYPES.CODE_BLOCK} icon="{}" />
      <BlockButton format={BLOCK_TYPES.CALLOUT} icon={'\u26A1'} />
      <ChecklistButton />
      <TwoColumnsButton />
      <CtaButton />
      <DividerButton />
      <ImageButton onRequestImage={onRequestImage} />
    </div>
  </div>
);

export default SlateToolbar;

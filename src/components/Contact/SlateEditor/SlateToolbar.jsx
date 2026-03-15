import React from 'react';
import { useSlate } from 'slate-react';
import { isMarkActive, toggleMark, isBlockActive, toggleBlock } from './slateHelpers';
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

const SlateToolbar = () => (
  <div className="slate-toolbar">
    <div className="slate-toolbar-group">
      <MarkButton format={MARK_TYPES.BOLD} icon="B" />
      <MarkButton format={MARK_TYPES.ITALIC} icon="I" />
      <MarkButton format={MARK_TYPES.UNDERLINE} icon="U" />
      <MarkButton format={MARK_TYPES.CODE} icon="<>" />
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
    </div>
  </div>
);

export default SlateToolbar;

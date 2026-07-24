import React from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('contact');
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
      title={t(`editor.toolbar.${format}`)}
      aria-label={t(`editor.toolbar.${format}`)}
      aria-pressed={isActive}
    >
      {icon}
    </button>
  );
};

const BlockButton = ({ format, icon }) => {
  const { t } = useTranslation('contact');
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
      title={t(`editor.toolbar.${format}`)}
      aria-label={t(`editor.toolbar.${format}`)}
      aria-pressed={isActive}
    >
      {icon}
    </button>
  );
};

const LinkButton = () => {
  const { t } = useTranslation('contact');
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
          const url = window.prompt(t('editor.prompts.enterUrl'));
          if (url) {
            insertLink(editor, url);
          }
        }
      }}
      title={t('editor.toolbar.link')}
      aria-label={t('editor.toolbar.link')}
      aria-pressed={isActive}
    >
      {'\uD83D\uDD17'}
    </button>
  );
};

const DividerButton = () => {
  const { t } = useTranslation('contact');
  const editor = useSlate();
  return (
    <button
      type="button"
      className="slate-toolbar-btn"
      onMouseDown={(e) => {
        e.preventDefault();
        insertDivider(editor);
      }}
      title={t('editor.toolbar.divider')}
      aria-label={t('editor.toolbar.divider')}
    >
      {'\u2014'}
    </button>
  );
};

const ImageButton = ({ onRequestImage }) => {
  const { t } = useTranslation('contact');
  return (
    <button
      type="button"
      className="slate-toolbar-btn"
      onMouseDown={(e) => {
        e.preventDefault();
        if (onRequestImage) onRequestImage();
      }}
      title={t('editor.toolbar.image')}
      aria-label={t('editor.toolbar.image')}
    >
      {'\uD83D\uDDBC'}
    </button>
  );
};

const ChecklistButton = () => {
  const { t } = useTranslation('contact');
  const editor = useSlate();
  return (
    <button
      type="button"
      className="slate-toolbar-btn"
      onMouseDown={(e) => {
        e.preventDefault();
        insertChecklistItem(editor, t('editor.defaults.checklist'));
      }}
      title={t('editor.toolbar.checklist')}
      aria-label={t('editor.toolbar.checklist')}
    >
      {'\u2611'}
    </button>
  );
};

const CtaButton = () => {
  const { t } = useTranslation('contact');
  const editor = useSlate();
  return (
    <button
      type="button"
      className="slate-toolbar-btn"
      onMouseDown={(e) => {
        e.preventDefault();
        const label = window.prompt(t('editor.prompts.buttonText'), t('editor.defaults.replyNow'));
        if (label === null) return;
        const url = window.prompt(t('editor.prompts.buttonUrl'), 'https://');
        if (!url) return;
        insertCtaButton(editor, label, url, t('editor.defaults.viewDetails'));
      }}
      title={t('editor.toolbar.cta')}
      aria-label={t('editor.toolbar.cta')}
    >
      CTA
    </button>
  );
};

const TwoColumnsButton = () => {
  const { t } = useTranslation('contact');
  const editor = useSlate();
  return (
    <button
      type="button"
      className="slate-toolbar-btn"
      onMouseDown={(e) => {
        e.preventDefault();
        insertTwoColumns(
          editor,
          t('editor.defaults.leftColumn'),
          t('editor.defaults.rightColumn')
        );
      }}
      title={t('editor.toolbar.two-columns')}
      aria-label={t('editor.toolbar.two-columns')}
    >
      2C
    </button>
  );
};

const SlateToolbar = ({ onRequestImage }) => {
  const { t } = useTranslation('contact');

  return (
    <div className="slate-toolbar" role="toolbar" aria-label={t('editor.toolbar.aria')}>
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
};

export default SlateToolbar;

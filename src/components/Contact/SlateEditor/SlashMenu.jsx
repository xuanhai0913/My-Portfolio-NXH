import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import ReactDOM from 'react-dom';
import { Editor, Transforms, Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { useTranslation } from 'react-i18next';
import { SLASH_MENU_ITEMS } from './slateConstants';
import {
  toggleBlock,
  insertDivider,
  insertChecklistItem,
  insertCtaButton,
  insertTwoColumns,
} from './slateHelpers';

const SlashMenu = forwardRef(({ editor, onRequestImage }, ref) => {
  const { t } = useTranslation('contact');
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [targetRange, setTargetRange] = useState(null);
  const menuRef = useRef(null);

  const filteredItems = SLASH_MENU_ITEMS.filter((item) => {
    const label = t(`editor.slash.items.${item.key}.label`);
    return label.toLowerCase().includes(search.toLowerCase());
  });

  const selectItem = useCallback(
    (item) => {
      if (targetRange) {
        Transforms.select(editor, targetRange);
        Transforms.delete(editor);
      }

      const action = item.action || 'toggle-block';

      switch (action) {
        case 'prompt-image': {
          if (onRequestImage) {
            onRequestImage();
          }
          break;
        }
        case 'insert-void': {
          insertDivider(editor);
          break;
        }
        case 'insert-checklist': {
          insertChecklistItem(editor, t('editor.defaults.checklist'));
          break;
        }
        case 'insert-cta': {
          const label = window.prompt(t('editor.prompts.buttonText'), t('editor.defaults.replyNow'));
          if (label === null) break;
          const url = window.prompt(t('editor.prompts.buttonUrl'), 'https://');
          if (!url) break;
          insertCtaButton(editor, label, url, t('editor.defaults.viewDetails'));
          break;
        }
        case 'insert-two-columns': {
          insertTwoColumns(
            editor,
            t('editor.defaults.leftColumn'),
            t('editor.defaults.rightColumn')
          );
          break;
        }
        case 'toggle-block':
        default: {
          toggleBlock(editor, item.type);
          break;
        }
      }

      setIsOpen(false);
      ReactEditor.focus(editor);
    },
    [editor, onRequestImage, t, targetRange]
  );

  const checkForSlashCommand = useCallback(() => {
    const { selection } = editor;
    if (!selection || !Range.isCollapsed(selection)) {
      setIsOpen(false);
      return;
    }

    const [start] = Range.edges(selection);
    const blockEntry = Editor.above(editor, {
      match: (n) => Editor.isBlock(editor, n),
    });
    if (!blockEntry) return;

    const [, blockPath] = blockEntry;
    const blockStart = Editor.start(editor, blockPath);
    const beforeRange = { anchor: blockStart, focus: start };
    const beforeText = Editor.string(editor, beforeRange);

    const slashMatch = beforeText.match(/\/(\w*)$/);
    if (slashMatch) {
      const searchTerm = slashMatch[1];
      setSearch(searchTerm);
      setSelectedIndex(0);

      const slashPoint = {
        path: start.path,
        offset: start.offset - searchTerm.length - 1,
      };
      setTargetRange({ anchor: slashPoint, focus: start });

      try {
        const domRange = ReactEditor.toDOMRange(editor, {
          anchor: slashPoint,
          focus: slashPoint,
        });
        const rect = domRange.getBoundingClientRect();
        setMenuPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
        });
      } catch {
        // fallback: position will stay at last known position
      }

      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [editor]);

  const handleKeyDown = useCallback(
    (event) => {
      if (!isOpen) return false;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((i) =>
            filteredItems.length ? (i + 1) % filteredItems.length : 0
          );
          return true;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((i) =>
            filteredItems.length
              ? (i - 1 + filteredItems.length) % filteredItems.length
              : 0
          );
          return true;
        case 'Enter':
        case 'Tab':
          event.preventDefault();
          if (filteredItems[selectedIndex]) {
            selectItem(filteredItems[selectedIndex]);
          }
          return true;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          return true;
        default:
          return false;
      }
    },
    [isOpen, filteredItems, selectedIndex, selectItem]
  );

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isOpen]);

  useImperativeHandle(ref, () => ({
    checkForSlashCommand,
    handleKeyDown,
    isOpen,
  }));

  if (!isOpen || filteredItems.length === 0) return null;

  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      className="slash-menu"
      style={{ top: menuPosition.top, left: menuPosition.left }}
      role="listbox"
      aria-label={t('editor.slash.aria')}
    >
      <div className="slash-menu-header">{t('editor.slash.header')}</div>
      {filteredItems.map((item, index) => (
        <div
          key={item.type}
          className={`slash-menu-item ${
            index === selectedIndex ? 'selected' : ''
          }`}
          onMouseDown={(e) => {
            e.preventDefault();
            selectItem(item);
          }}
          onMouseEnter={() => setSelectedIndex(index)}
          role="option"
          aria-selected={index === selectedIndex}
        >
          <span className="slash-menu-icon">{item.icon}</span>
          <div className="slash-menu-text">
            <span className="slash-menu-label">{t(`editor.slash.items.${item.key}.label`)}</span>
            <span className="slash-menu-desc">{t(`editor.slash.items.${item.key}.description`)}</span>
          </div>
        </div>
      ))}
    </div>,
    document.body
  );
});

SlashMenu.displayName = 'SlashMenu';

export default SlashMenu;

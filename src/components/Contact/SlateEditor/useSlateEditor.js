import { useMemo, useCallback } from 'react';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import isHotkey from 'is-hotkey';
import { HOTKEYS } from './slateConstants';
import { toggleMark, withNodeId, withVoids } from './slateHelpers';

const useSlateEditor = () => {
  const editor = useMemo(
    () => withVoids(withNodeId(withHistory(withReact(createEditor())))),
    []
  );

  const handleHotkeys = useCallback(
    (event) => {
      for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, event)) {
          event.preventDefault();
          toggleMark(editor, HOTKEYS[hotkey]);
          return;
        }
      }
    },
    [editor]
  );

  return { editor, handleHotkeys };
};

export default useSlateEditor;

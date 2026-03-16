import React, { useState, useCallback, useRef } from 'react';
import { Slate, Editable } from 'slate-react';
import { Transforms, Node } from 'slate';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import useSlateEditor from './useSlateEditor';
import SlateToolbar from './SlateToolbar';
import SlashMenu from './SlashMenu';
import UnsplashPicker from './UnsplashPicker';
import DraggableBlock from './DraggableBlock';
import SlateElement from './SlateElement';
import SlateLeaf from './SlateLeaf';
import { INITIAL_VALUE } from './slateConstants';
import { serializeToEmailHtml, insertImage } from './slateHelpers';
import '../styles/SlateEditor.css';

const SlateEditor = ({ hiddenInputRef, disabled }) => {
  const { editor, handleHotkeys } = useSlateEditor();
  const [value, setValue] = useState(INITIAL_VALUE);
  const slashMenuRef = useRef(null);
  const [unsplashOpen, setUnsplashOpen] = useState(false);

  const openUnsplash = useCallback(() => setUnsplashOpen(true), []);
  const closeUnsplash = useCallback(() => setUnsplashOpen(false), []);

  const handleUnsplashSelect = useCallback(
    (url) => {
      insertImage(editor, url);
    },
    [editor]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const renderElement = useCallback(
    (props) => {
      // Only wrap top-level elements (path length === 1)
      if (props.element.id) {
        return (
          <DraggableBlock element={props.element}>
            <SlateElement {...props} />
          </DraggableBlock>
        );
      }
      return <SlateElement {...props} />;
    },
    []
  );

  const renderLeaf = useCallback((props) => <SlateLeaf {...props} />, []);

  const handleChange = useCallback(
    (newValue) => {
      setValue(newValue);
      if (hiddenInputRef?.current) {
        hiddenInputRef.current.value = serializeToEmailHtml(newValue);
      }
      if (slashMenuRef.current) {
        slashMenuRef.current.checkForSlashCommand();
      }
    },
    [hiddenInputRef]
  );

  const handleKeyDown = useCallback(
    (event) => {
      if (
        slashMenuRef.current &&
        slashMenuRef.current.handleKeyDown(event)
      ) {
        return;
      }
      handleHotkeys(event);
    },
    [handleHotkeys]
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = value.findIndex((node) => node.id === active.id);
      const newIndex = value.findIndex((node) => node.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        Transforms.moveNodes(editor, {
          at: [oldIndex],
          to: [newIndex > oldIndex ? newIndex + 1 : newIndex],
        });
      }
    },
    [editor, value]
  );

  const blockIds = value.filter((n) => n.id).map((n) => n.id);

  return (
    <div className={`slate-editor-wrapper ${disabled ? 'disabled' : ''}`}>
      <Slate editor={editor} initialValue={INITIAL_VALUE} onChange={handleChange}>
        <SlateToolbar onRequestImage={openUnsplash} />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blockIds}
            strategy={verticalListSortingStrategy}
          >
            <Editable
              className="slate-editable"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (use / for commands)"
              readOnly={disabled}
              spellCheck
              autoFocus={false}
            />
          </SortableContext>
          <DragOverlay />
        </DndContext>
        <SlashMenu ref={slashMenuRef} editor={editor} onRequestImage={openUnsplash} />
      </Slate>
      <UnsplashPicker
        isOpen={unsplashOpen}
        onSelect={handleUnsplashSelect}
        onClose={closeUnsplash}
      />
    </div>
  );
};

export default SlateEditor;

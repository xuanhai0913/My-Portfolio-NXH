import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';

const DraggableBlock = ({ element, children }) => {
  const { t } = useTranslation('contact');
  const {
    attributes: sortableAttributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`draggable-block ${isDragging ? 'dragging' : ''}`}>
      <div
        className="drag-handle"
        contentEditable={false}
        {...listeners}
        {...sortableAttributes}
        aria-label={t('editor.dragHandleAria')}
        title={t('editor.dragHandleTooltip')}
      >
        <span className="drag-handle-icon">&#x2630;</span>
      </div>
      <div className="draggable-block-content">{children}</div>
    </div>
  );
};

export default DraggableBlock;

import { memo } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { StickyNoteSaved } from './sticky-note-saved';
import { GripVertical } from 'lucide-react';

interface DraggableNoteProps {
  note: {
    id: string;
    title: string;
    content: string;
    date: string;
    color: string;
    isPinned: boolean;
    categoryId: string;
  };
  index: number;
  onLoadNote: (content: string, title: string, color: string) => void;
  onTogglePin: (id: string) => void;
  onDeleteNote: (id: string) => void;
}

// Simple drag handle component
const DragHandle = () => (
  <div 
    className="absolute top-2 left-2 p-1 rounded-full hover:bg-white/30 cursor-move z-10"
    style={{ touchAction: 'none' }}
  >
    <GripVertical className="h-4 w-4 text-gray-400" />
  </div>
);

export const DraggableNote = memo(({ 
  note, 
  index, 
  onLoadNote, 
  onTogglePin, 
  onDeleteNote 
}: DraggableNoteProps) => {
  return (
    <Draggable draggableId={note.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`relative ${snapshot.isDragging ? 'opacity-80 shadow-lg z-10' : 'opacity-100'}`}
          style={{
            ...provided.draggableProps.style,
            transition: snapshot.isDragging ? 'none' : 'all 0.2s ease',
          }}
        >
          {/* Drag handle with drag handle props */}
          <div {...provided.dragHandleProps}>
            <DragHandle />
          </div>
          <StickyNoteSaved
            notes={[note]}
            onLoadNote={onLoadNote}
            onTogglePin={onTogglePin}
            onDeleteNote={onDeleteNote}
            showCategory={false}
          />
        </div>
      )}
    </Draggable>
  );
});

DraggableNote.displayName = 'DraggableNote';

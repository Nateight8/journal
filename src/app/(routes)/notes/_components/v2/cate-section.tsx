"use client";

import { memo } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { StickyNoteSaved } from "./sticky-note-saved";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
  isPinned: boolean;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
}

interface CategorySectionProps {
  category: Category;
  notes: Note[];
  onLoadNote: (content: string, title: string, color: string) => void;
  onTogglePin: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const CategorySection = memo(
  ({
    category,
    notes,
    onLoadNote,
    onTogglePin,
    onDeleteNote,
    onDeleteCategory,
  }: CategorySectionProps) => {
    const pinnedNotes = notes.filter((note) => note.isPinned);
    const unpinnedNotes = notes.filter((note) => !note.isPinned);
    const allCategoryNotes = [...pinnedNotes, ...unpinnedNotes];

    const handleDeleteCategory = () => {
      onDeleteCategory(category.id);
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="text-xl font-semibold">{category.name}</h3>
            <Badge variant="secondary">{notes.length}</Badge>
          </div>
          {!category.isDefault && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDeleteCategory}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Droppable droppableId={category.id} direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`
              min-h-[280px] p-4 rounded-lg transition-all duration-200 ease-in-out
              ${
                snapshot.isDraggingOver
                  ? "border-2 border-primary bg-primary/5 shadow-lg"
                  : "border-2 border-dashed border-gray-300 hover:border-gray-400"
              }
            `}
            >
              {allCategoryNotes.length === 0 ? (
                <div className="text-center text-gray-500 py-16 transition-all duration-200">
                  {snapshot.isDraggingOver
                    ? "Drop your note here!"
                    : "Drop notes here or create new ones"}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {allCategoryNotes.map((note, index) => (
                    <Draggable
                      key={note.id}
                      draggableId={note.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`
                          transition-all duration-200 ease-in-out
                          ${
                            snapshot.isDragging
                              ? "rotate-6 scale-105 shadow-2xl z-50"
                              : "hover:scale-102"
                          }
                        `}
                          style={{
                            ...provided.draggableProps.style,
                            transform: snapshot.isDragging
                              ? `${provided.draggableProps.style?.transform} rotate(6deg)`
                              : provided.draggableProps.style?.transform,
                          }}
                        >
                          <StickyNoteSaved
                            notes={[note]}
                            onLoadNote={onLoadNote}
                            onTogglePin={onTogglePin}
                            onDeleteNote={onDeleteNote}
                            showCategory={false}
                            isDragging={snapshot.isDragging}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  }
);

CategorySection.displayName = "CategorySection";

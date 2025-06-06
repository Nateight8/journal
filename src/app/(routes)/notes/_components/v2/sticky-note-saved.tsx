"use client";

import type React from "react";

import { memo } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pin, PinOff, Trash2, Calendar, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
  isPinned: boolean;
  categoryId?: string;
}

interface StickyNoteSavedProps {
  notes: Note[];
  onLoadNote: (content: string, title: string, color: string) => void;
  onTogglePin: (id: string) => void;
  onDeleteNote: (id: string) => void;
  showCategory?: boolean;
  isDragging?: boolean;
}

// Memoized individual note card component
const NoteCard = memo(
  ({
    note,
    index,
    isDragging,
    onLoadNote,
    onTogglePin,
    onDeleteNote,
  }: {
    note: Note;
    index: number;
    isDragging: boolean;
    onLoadNote: (content: string, title: string, color: string) => void;
    onTogglePin: (id: string) => void;
    onDeleteNote: (id: string) => void;
  }) => {
    const handleTogglePin = (e: React.MouseEvent) => {
      e.stopPropagation();
      onTogglePin(note.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      onDeleteNote(note.id);
    };

    const handleLoadNote = () => {
      onLoadNote(note.content, note.title, note.color);
    };

    const truncatedContent =
      note.content
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 150) + "...";

    return (
      <motion.div
        key={note.id}
        initial={{ opacity: 0, y: 20, rotate: -2 }}
        animate={{
          opacity: 1,
          y: 0,
          rotate: isDragging ? 0 : index % 2 === 0 ? 2 : -2,
          transition: { delay: isDragging ? 0 : index * 0.1 },
        }}
        whileHover={
          !isDragging
            ? {
                scale: 1.05,
                rotate: 0,
                zIndex: 10,
                transition: { duration: 0.2 },
              }
            : {}
        }
        className="relative group"
      >
        <Card
          className={`
          sticky-note sticky-note-${note.color} sticky-note-texture
          border-2 cursor-pointer transition-all duration-200 
          shadow-lg hover:shadow-xl transform-gpu h-64 relative overflow-hidden
          ${isDragging ? "shadow-2xl ring-2 ring-primary" : ""}
        `}
        >
          {/* Tape effect */}
          <div className="sticky-note-tape"></div>

          {/* Pin indicator */}
          {note.isPinned && (
            <div className="absolute top-2 right-2">
              <Badge
                variant="secondary"
                className="bg-red-500 text-white text-xs px-1 py-0"
              >
                <Pin className="h-3 w-3" />
              </Badge>
            </div>
          )}

          <CardHeader className="pb-2 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs sticky-note-text-muted">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(note.date).toLocaleDateString()}
              </div>
              <div
                className={`flex space-x-1 transition-opacity ${
                  isDragging ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-white/50"
                  onClick={handleTogglePin}
                >
                  {note.isPinned ? (
                    <PinOff className="h-3 w-3" />
                  ) : (
                    <Pin className="h-3 w-3" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-red-200"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-3 w-3 text-red-600" />
                </Button>
              </div>
            </div>
            <CardTitle className="text-lg font-bold text-red-800 sticky-note-text line-clamp-2">
              {note.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div
              className="text-xs sticky-note-text-muted line-clamp-6"
              dangerouslySetInnerHTML={{ __html: truncatedContent }}
            />
            <div
              className={`mt-3 flex justify-center transition-opacity ${
                isDragging ? "opacity-0" : ""
              }`}
            >
              <Button
                size="sm"
                variant="outline"
                className="bg-white/70 hover:bg-white text-xs"
                onClick={handleLoadNote}
              >
                <Eye className="h-3 w-3 mr-1" />
                Open Note
              </Button>
            </div>
          </CardContent>

          {/* Corner fold effect */}
          <div className="sticky-note-fold"></div>
        </Card>
      </motion.div>
    );
  }
);

NoteCard.displayName = "NoteCard";

// Memoized single note component for drag and drop
const SingleNote = memo(
  ({
    note,
    isDragging,
    onLoadNote,
    onTogglePin,
    onDeleteNote,
  }: {
    note: Note;
    isDragging: boolean;
    onLoadNote: (content: string, title: string, color: string) => void;
    onTogglePin: (id: string) => void;
    onDeleteNote: (id: string) => void;
  }) => {
    return (
      <NoteCard
        note={note}
        index={0}
        isDragging={isDragging}
        onLoadNote={onLoadNote}
        onTogglePin={onTogglePin}
        onDeleteNote={onDeleteNote}
      />
    );
  }
);

SingleNote.displayName = "SingleNote";

// Memoized notes grid component
const NotesGrid = memo(
  ({
    notes,
    onLoadNote,
    onTogglePin,
    onDeleteNote,
  }: {
    notes: Note[];
    onLoadNote: (content: string, title: string, color: string) => void;
    onTogglePin: (id: string) => void;
    onDeleteNote: (id: string) => void;
  }) => {
    const pinnedNotes = notes.filter((note) => note.isPinned);
    const unpinnedNotes = notes.filter((note) => !note.isPinned);

    return (
      <div className="space-y-8">
        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <Pin className="h-5 w-5 mr-2 text-red-500" />
              <h2 className="text-xl font-bold">Pinned Notes</h2>
              <Badge variant="secondary" className="ml-2">
                {pinnedNotes.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
              {pinnedNotes.map((note, index) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  index={index}
                  isDragging={false}
                  onLoadNote={onLoadNote}
                  onTogglePin={onTogglePin}
                  onDeleteNote={onDeleteNote}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Notes */}
        <div>
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold">All Notes</h2>
            <Badge variant="secondary" className="ml-2">
              {notes.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {unpinnedNotes.map((note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                index={index}
                isDragging={false}
                onLoadNote={onLoadNote}
                onTogglePin={onTogglePin}
                onDeleteNote={onDeleteNote}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

NotesGrid.displayName = "NotesGrid";

export function StickyNoteSaved({
  notes,
  onLoadNote,
  onTogglePin,
  onDeleteNote,
  showCategory = true,
  isDragging = false,
}: StickyNoteSavedProps) {
  if (!showCategory) {
    // Single note display for drag and drop
    return notes.length > 0 ? (
      <SingleNote
        note={notes[0]}
        isDragging={isDragging}
        onLoadNote={onLoadNote}
        onTogglePin={onTogglePin}
        onDeleteNote={onDeleteNote}
      />
    ) : null;
  }

  return (
    <NotesGrid
      notes={notes}
      onLoadNote={onLoadNote}
      onTogglePin={onTogglePin}
      onDeleteNote={onDeleteNote}
    />
  );
}

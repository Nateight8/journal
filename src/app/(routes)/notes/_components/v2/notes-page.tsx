"use client";

import { useState, useCallback } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import {
  Save,
  FileText,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Link2,
  Palette,
  X,
  FolderPlus,
  Clock,
  NotebookPen as NotebookPenIcon,
} from "lucide-react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExtension from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Highlight from "@tiptap/extension-highlight";
import Heading from "@tiptap/extension-heading";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { DraggableNote } from "./draggable-note";
import { StickyNoteTemplates } from "./sticky-note-templates";

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

const defaultCategories: Category[] = [
  { id: "plans", name: "Plans", color: "blue", isDefault: true },
  { id: "journal", name: "Journal Notes", color: "green", isDefault: true },
];

const colorOptions = [
  { name: "yellow", label: "Yellow", class: "sticky-note-yellow" },
  { name: "blue", label: "Blue", class: "sticky-note-blue" },
  { name: "green", label: "Green", class: "sticky-note-green" },
  { name: "pink", label: "Pink", class: "sticky-note-pink" },
  { name: "purple", label: "Purple", class: "sticky-note-purple" },
];

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState("editor");
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [currentNoteColor, setCurrentNoteColor] = useState("yellow");
  const [savedNotes, setSavedNotes] = useState<Note[]>([
    {
      id: "1",
      title: "EUR/USD Breakout Strategy",
      content:
        "<h2>EUR/USD Breakout Strategy</h2><p>Looking for key level breakouts with confirmation. Focus on London session opens and major support/resistance levels.</p>",
      date: new Date().toISOString().split("T")[0],
      color: "yellow",
      isPinned: true,
      categoryId: "plans",
    },
  ]);

  const [currentNoteTitle, setCurrentNoteTitle] = useState("Untitled Note");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      UnderlineExtension,
      BulletList,
      OrderedList,
      ListItem,
      Highlight.configure({
        multicolor: true,
      }),
      Heading.configure({
        levels: [1, 2],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      // TableHeader extension removed as it was unused
      TableCell,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing your note...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "listItem"],
      }),
    ],
    content:
      "<h1>My Note</h1><p>Start documenting your thoughts, strategies, or observations...</p>",
  });

  const saveNote = useCallback(() => {
    if (!editor) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: currentNoteTitle,
      content: editor.getHTML(),
      date: new Date().toISOString().split("T")[0],
      color: currentNoteColor,
      isPinned: false,
      categoryId: categories[0]?.id || "plans",
    };

    setSavedNotes((prevNotes) => [newNote, ...prevNotes]);
  }, [editor, currentNoteTitle, currentNoteColor, categories]);

  const loadNote = useCallback(
    (content: string, title: string, color: string) => {
      if (!editor) return;
      editor.commands.setContent(content);
      setCurrentNoteTitle(title);
      setCurrentNoteColor(color);
      setActiveTab("editor");
    },
    [editor]
  );

  const createNewNote = useCallback(
    (template: string, title: string) => {
      if (!editor) return;
      editor.commands.setContent(template);
      setCurrentNoteTitle(title);
      setActiveTab("editor");
    },
    [editor]
  );

  const togglePin = useCallback((id: string) => {
    setSavedNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setSavedNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  }, []);

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    // Don't do anything if dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Moving between categories
    if (source.droppableId !== destination.droppableId) {
      setSavedNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === draggableId
            ? { ...note, categoryId: destination.droppableId }
            : note
        )
      );
    }
  }, []);

  const createCategory = useCallback(() => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryName.trim(),
      color: "gray",
      isDefault: false,
    };

    setCategories((prev) => [...prev, newCategory]);
    setNewCategoryName("");
    setShowNewCategoryInput(false);
  }, [newCategoryName]);

  const deleteCategory = useCallback(
    (categoryId: string) => {
      // Don't allow deleting default categories
      const category = categories.find((c) => c.id === categoryId);
      if (category?.isDefault) return;

      // Move notes to default category
      setSavedNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.categoryId === categoryId
            ? { ...note, categoryId: "plans" }
            : note
        )
      );

      // Remove the category
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
    },
    [categories]
  );

  const getNotesByCategory = useCallback(
    (categoryId: string) => {
      return savedNotes.filter((note) => note.categoryId === categoryId);
    },
    [savedNotes]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Notes</h1>
              <p className="text-muted-foreground">
                Organize your thoughts, plans, and observations
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={activeTab === "editor" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("editor")}
              >
                <NotebookPenIcon className="mr-2 h-4 w-4" />
                Editor
              </Button>
              <Button
                variant={activeTab === "templates" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("templates")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Templates
              </Button>
              <Button
                variant={activeTab === "saved" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("saved")}
              >
                <Clock className="mr-2 h-4 w-4" />
                Saved Notes
              </Button>
              <Button onClick={saveNote}>
                <Save className="mr-2 h-4 w-4" />
                Save Note
              </Button>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsContent value="editor" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Input
                      value={currentNoteTitle}
                      onChange={(e) => setCurrentNoteTitle(e.target.value)}
                      className="border-none text-2xl font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Note Title"
                    />
                    <div className="flex items-center space-x-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Palette className="h-4 w-4" />
                            <span>Color</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2" align="end">
                          <div className="grid grid-cols-3 gap-2">
                            {colorOptions.map((color) => (
                              <button
                                key={color.name}
                                onClick={() => setCurrentNoteColor(color.name)}
                                className={`h-8 w-full rounded-md ${
                                  currentNoteColor === color.name
                                    ? "ring-2 ring-offset-2 ring-primary"
                                    : ""
                                }`}
                                style={{
                                  backgroundColor: `var(--sticky-note-${color.name}-bg)`,
                                }}
                                aria-label={`${color.name} note`}
                              />
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {editor && (
                      <BubbleMenu
                        editor={editor}
                        tippyOptions={{ duration: 100 }}
                      >
                        <div className="flex items-center space-x-1 bg-background border rounded-md p-1 shadow-lg">
                          <Button
                            onClick={() =>
                              editor.chain().focus().toggleBold().run()
                            }
                            variant={
                              editor.isActive("bold") ? "secondary" : "ghost"
                            }
                            size="sm"
                          >
                            <Bold className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() =>
                              editor.chain().focus().toggleItalic().run()
                            }
                            variant={
                              editor.isActive("italic") ? "secondary" : "ghost"
                            }
                            size="sm"
                          >
                            <Italic className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() =>
                              editor.chain().focus().toggleUnderline().run()
                            }
                            variant={
                              editor.isActive("underline")
                                ? "secondary"
                                : "ghost"
                            }
                            size="sm"
                          >
                            <Underline className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() =>
                              editor.chain().focus().toggleStrike().run()
                            }
                            variant={
                              editor.isActive("strike") ? "secondary" : "ghost"
                            }
                            size="sm"
                          >
                            <Strikethrough className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() =>
                              editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 1 })
                                .run()
                            }
                            variant={
                              editor.isActive("heading", { level: 1 })
                                ? "secondary"
                                : "ghost"
                            }
                            size="sm"
                          >
                            <Heading1 className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() =>
                              editor.chain().focus().toggleBulletList().run()
                            }
                            variant={
                              editor.isActive("bulletList")
                                ? "secondary"
                                : "ghost"
                            }
                            size="sm"
                          >
                            <List className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() =>
                              editor.chain().focus().toggleOrderedList().run()
                            }
                            variant={
                              editor.isActive("orderedList")
                                ? "secondary"
                                : "ghost"
                            }
                            size="sm"
                          >
                            <ListOrdered className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => {
                              const previousUrl =
                                editor.getAttributes("link").href;
                              const url = window.prompt(
                                "URL",
                                previousUrl || "https://"
                              );
                              if (url === null) return;
                              if (url === "") {
                                editor
                                  .chain()
                                  .focus()
                                  .extendMarkRange("link")
                                  .unsetLink()
                                  .run();
                                return;
                              }
                              editor
                                .chain()
                                .focus()
                                .extendMarkRange("link")
                                .setLink({ href: url })
                                .run();
                            }}
                            variant={
                              editor.isActive("link") ? "secondary" : "ghost"
                            }
                            size="sm"
                          >
                            <Link2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </BubbleMenu>
                    )}
                    <EditorContent
                      editor={editor}
                      className="prose max-w-none handwriting-content focus:outline-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="mt-4">
              <StickyNoteTemplates onSelectTemplate={createNewNote} />
            </TabsContent>

            <TabsContent value="saved" className="mt-4">
              <DragDropContext onDragEnd={onDragEnd}>
                <div className="space-y-8">
                  {/* Category Management */}
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Categories</h2>
                    <div className="flex items-center space-x-2">
                      {showNewCategoryInput ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Category name"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && createCategory()
                            }
                            className="w-40"
                          />
                          <Button size="sm" onClick={createCategory}>
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowNewCategoryInput(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => setShowNewCategoryInput(true)}
                        >
                          <FolderPlus className="h-4 w-4 mr-2" />
                          New Category
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Categories with Notes */}
                  {categories.map((category) => {
                    const categoryNotes = getNotesByCategory(category.id);
                    const pinnedNotes = categoryNotes.filter(
                      (note) => note.isPinned
                    );
                    const unpinnedNotes = categoryNotes.filter(
                      (note) => !note.isPinned
                    );

                    return (
                      <div key={category.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-semibold">
                              {category.name}
                            </h3>
                            <Badge variant="secondary">
                              {categoryNotes.length}
                            </Badge>
                          </div>
                          {!category.isDefault && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteCategory(category.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <Droppable
                          droppableId={category.id}
                          direction="horizontal"
                          type="note"
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`min-h-[100px] p-4 rounded-lg transition-colors ${
                                snapshot.isDraggingOver
                                  ? "bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-primary"
                                  : "border-2 border-dashed border-gray-300"
                              }`}
                            >
                              {categoryNotes.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                  Drop notes here or create new ones
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                  {[...pinnedNotes, ...unpinnedNotes].map(
                                    (note, index) => (
                                      <DraggableNote
                                        key={note.id}
                                        note={note}
                                        index={index}
                                        onLoadNote={loadNote}
                                        onTogglePin={togglePin}
                                        onDeleteNote={deleteNote}
                                      />
                                    )
                                  )}
                                </div>
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    );
                  })}
                </div>
              </DragDropContext>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

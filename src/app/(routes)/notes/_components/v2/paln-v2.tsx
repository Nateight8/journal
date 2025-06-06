"use client";

import { useState, useMemo, useCallback } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Link2,
  Highlighter,
  Palette,
  FolderPlus,
  X,
  Type,
} from "lucide-react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import UnderlineExtension from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Save, FileText, Clock, NotebookPenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";

import { StickyNoteTemplates } from "./sticky-note-templates";
import { CategorySection } from "./cate-section";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
  isPinned: boolean;
  categoryId: string;
  textColor?: string;
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


const textColorOptions = [
  { name: "blue", label: "Blue", class: "text-blue-700", value: "#1d4ed8" },
  { name: "black", label: "Black", class: "text-gray-900", value: "#111827" },
  { name: "red", label: "Red", class: "text-red-700", value: "#b91c1c" },
];

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState("editor");
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [currentNoteColor, setCurrentNoteColor] = useState("yellow");
  const [currentTextColor, setCurrentTextColor] = useState("blue");
  const [savedNotes, setSavedNotes] = useState<Note[]>([
    {
      id: "1",
      title: "EUR/USD Breakout Strategy",
      content:
        "<h2>EUR/USD Breakout Strategy</h2><p>Looking for key level breakouts with confirmation. Focus on London session opens and major support/resistance levels.</p>",
      date: "2025-06-01",
      color: "yellow",
      isPinned: true,
      categoryId: "plans",
      textColor: "blue",
    },
    {
      id: "2",
      title: "Risk Management Framework",
      content:
        "<h2>Risk Management Rules</h2><p>Never risk more than 2% per trade. Always set stop loss before entry. Use position sizing calculator.</p>",
      date: "2025-05-28",
      color: "blue",
      isPinned: false,
      categoryId: "plans",
      textColor: "black",
    },
    {
      id: "3",
      title: "Daily Trading Reflection",
      content:
        "<h2>Today's Trading Session</h2><p>Market was choppy today. Need to be more patient with entries and wait for clear signals.</p>",
      date: "2025-05-25",
      color: "green",
      isPinned: true,
      categoryId: "journal",
      textColor: "red",
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
      TaskList,
      TaskItem,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
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
    content: `
      <h1>My Note</h1>
      <p>Start documenting your thoughts, strategies, or observations...</p>
    `,
  });

  const getNotesByCategory = useCallback(
    (categoryId: string) => {
      return savedNotes.filter((note) => note.categoryId === categoryId);
    },
    [savedNotes]
  );

  const memoizedCategories = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      notes: getNotesByCategory(category.id),
    }));
  }, [categories, getNotesByCategory]);

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

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

  const loadNote = useCallback(
    (content: string, title: string, color: string, textColor?: string) => {
      if (!editor) return;
      editor.commands.setContent(content);
      setCurrentNoteTitle(title);
      setCurrentNoteColor(color);
      if (textColor) {
        setCurrentTextColor(textColor);
      }
      setActiveTab("editor");
    },
    [editor]
  );

  const saveNote = () => {
    if (!editor) return;

    const newNote: Note = {
      id: Date.now().toString(),
      title: currentNoteTitle,
      content: editor.getHTML(),
      date: new Date().toISOString().split("T")[0],
      color: currentNoteColor,
      isPinned: false,
      categoryId: categories[0].id, // Default to first category
      textColor: currentTextColor,
    };

    setSavedNotes([newNote, ...savedNotes]);
  };

  const createNewNote = (template: string, title: string) => {
    if (!editor) return;
    editor.commands.setContent(template);
    setCurrentNoteTitle(title);
    setActiveTab("editor");
  };

  const createCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      color: "gray",
      isDefault: false,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setShowNewCategoryInput(false);
  };

  const deleteCategory = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category?.isDefault) return; // Can't delete default categories

    // Move notes from deleted category to first category
    setSavedNotes((notes) =>
      notes.map((note) =>
        note.categoryId === categoryId
          ? { ...note, categoryId: categories[0].id }
          : note
      )
    );
    setCategories((cats) => cats.filter((c) => c.id !== categoryId));
  };

  const getPaperClass = () => {
    return `paper-texture paper-${currentNoteColor}`;
  };

  const getCurrentTextColorValue = () => {
    const textColorOption = textColorOptions.find(
      (option) => option.name === currentTextColor
    );
    return textColorOption?.value || "#1d4ed8";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Notes</h1>
              <p className="text-muted-foreground">
                Organize your thoughts, plans, and observations
              </p>
            </div>
            <div className="flex items-center space-x-2 py-2">
              <Button
                variant={activeTab === "editor" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("editor")}
                className={activeTab === "editor" ? "bg-primary text-primary-foreground" : ""}
              >
                <NotebookPenIcon className="md:mr-2 h-4 w-4" />
                <span className="hidden md:inline">Editor</span>
              </Button>
              <Button
                variant={activeTab === "templates" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("templates")}
                className={activeTab === "templates" ? "bg-primary text-primary-foreground" : ""}
              >
                <FileText className="md:mr-2 h-4 w-4" />
                <span className="hidden md:inline">Templates</span>
              </Button>
              <Button
                variant={activeTab === "saved" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTab("saved")}
                className={activeTab === "saved" ? "bg-primary text-primary-foreground" : ""}
              >
                <Clock className="md:mr-2 h-4 w-4" />
                <span className="hidden md:inline">Saved Notes</span>
              </Button>
              <Button variant="outline" size="sm" onClick={saveNote}>
                <Save className="md:mr-2 h-4 w-4" />
                <span className="hidden md:inline">Save Note</span>
              </Button>
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full grid-cols-3 hidden">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="saved">Saved Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="mt-4 p-0">
              <Card className={`${getPaperClass()} border-0 shadow-lg`}>
                <CardHeader className="pb-3 border-b border-gray-600">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <input
                      type="text"
                      value={currentNoteTitle}
                      onChange={(e) => setCurrentNoteTitle(e.target.value)}
                      className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 w-full handwriting-font"
                      style={{ color: getCurrentTextColorValue() }}
                    />
                    <div className="flex items-center space-x-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                          >
                            <Palette className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">Paper</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4">
                          <fieldset className="space-y-4">
                            <legend className="text-foreground text-sm leading-none font-medium">
                              Choose a color
                            </legend>
                            <RadioGroup
                              className="flex flex-wrap gap-1.5"
                              value={currentNoteColor}
                              onValueChange={setCurrentNoteColor}
                            >
                              <RadioGroupItem
                                value="yellow"
                                aria-label="Yellow"
                                className="size-6 border-yellow-400 bg-yellow-400 shadow-none data-[state=checked]:border-yellow-400 data-[state=checked]:bg-yellow-400"
                              />
                              <RadioGroupItem
                                value="blue"
                                aria-label="Blue"
                                className="size-6 border-blue-400 bg-blue-400 shadow-none data-[state=checked]:border-blue-400 data-[state=checked]:bg-blue-400"
                              />
                              <RadioGroupItem
                                value="green"
                                aria-label="Green"
                                className="size-6 border-green-400 bg-green-400 shadow-none data-[state=checked]:border-green-400 data-[state=checked]:bg-green-400"
                              />
                              <RadioGroupItem
                                value="pink"
                                aria-label="Pink"
                                className="size-6 border-pink-400 bg-pink-400 shadow-none data-[state=checked]:border-pink-400 data-[state=checked]:bg-pink-400"
                              />
                              <RadioGroupItem
                                value="purple"
                                aria-label="Purple"
                                className="size-6 border-purple-400 bg-purple-400 shadow-none data-[state=checked]:border-purple-400 data-[state=checked]:bg-purple-400"
                              />
                            </RadioGroup>
                          </fieldset>
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                          >
                            <Type className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">Text</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2">
                          <div className="space-y-2">
                            {textColorOptions.map((textColor) => (
                              <button
                                key={textColor.name}
                                onClick={() =>
                                  setCurrentTextColor(textColor.name)
                                }
                                className={`
                                  w-full p-2 rounded-lg border-2 transition-all text-left
                                  ${textColor.class} bg-white
                                  ${
                                    currentTextColor === textColor.name
                                      ? "ring-2 ring-primary"
                                      : ""
                                  }
                                `}
                                title={textColor.label}
                              >
                                {textColor.label}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <div className="text-sm text-gray-400">
                        {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-300">
                    Document your thoughts, strategies, and observations
                  </CardDescription>
                </CardHeader>
                <CardContent className="md:p-6">
                  <div className="relative">
                    <div className="paper-lines min-h-[600px] md:p-6 rounded-md relative">
                      {editor && (
                        <BubbleMenu
                          editor={editor}
                          tippyOptions={{
                            duration: 100,
                            placement: "top-start",
                            animation: "shift-toward-subtle",
                            maxWidth: "none",
                          }}
                          className="flex items-center gap-1 p-1 bg-background text-foreground border rounded-md shadow-lg"
                        >
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              editor.chain().focus().toggleBold().run()
                            }
                            className={
                              editor.isActive("bold") ? "bg-accent" : ""
                            }
                          >
                            <Bold className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              editor.chain().focus().toggleItalic().run()
                            }
                            className={
                              editor.isActive("italic") ? "bg-accent" : ""
                            }
                          >
                            <Italic className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              editor.chain().focus().toggleUnderline().run()
                            }
                            className={
                              editor.isActive("underline") ? "bg-accent" : ""
                            }
                          >
                            <Underline className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              editor.chain().focus().toggleStrike().run()
                            }
                            className={
                              editor.isActive("strike") ? "bg-accent" : ""
                            }
                          >
                            <Strikethrough className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              editor.chain().focus().toggleHighlight().run()
                            }
                            className={
                              editor.isActive("highlight") ? "bg-accent" : ""
                            }
                          >
                            <Highlighter className="h-4 w-4" />
                          </Button>
                          <div className="h-6 w-px bg-border mx-1" />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 1 })
                                .run()
                            }
                            className={
                              editor.isActive("heading", { level: 1 })
                                ? "bg-accent"
                                : ""
                            }
                          >
                            <Heading1 className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 2 })
                                .run()
                            }
                            className={
                              editor.isActive("heading", { level: 2 })
                                ? "bg-accent"
                                : ""
                            }
                          >
                            <Heading2 className="h-4 w-4" />
                          </Button>
                          <div className="h-6 w-px bg-border mx-1" />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              editor.chain().focus().toggleBulletList().run()
                            }
                            className={
                              editor.isActive("bulletList") ? "bg-accent" : ""
                            }
                          >
                            <List className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              editor.chain().focus().toggleOrderedList().run()
                            }
                            className={
                              editor.isActive("orderedList") ? "bg-accent" : ""
                            }
                          >
                            <ListOrdered className="h-4 w-4" />
                          </Button>
                          <div className="h-6 w-px bg-border mx-1" />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              editor.chain().focus().setTextAlign("left").run()
                            }
                            className={
                              editor.isActive({ textAlign: "left" })
                                ? "bg-accent"
                                : ""
                            }
                          >
                            <AlignLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              editor
                                .chain()
                                .focus()
                                .setTextAlign("center")
                                .run()
                            }
                            className={
                              editor.isActive({ textAlign: "center" })
                                ? "bg-accent"
                                : ""
                            }
                          >
                            <AlignCenter className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() =>
                              editor.chain().focus().setTextAlign("right").run()
                            }
                            className={
                              editor.isActive({ textAlign: "right" })
                                ? "bg-accent"
                                : ""
                            }
                          >
                            <AlignRight className="h-4 w-4" />
                          </Button>
                          <div className="h-6 w-px bg-border mx-1" />
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              const previousUrl =
                                editor.getAttributes("link").href;
                              const url = window.prompt("URL", previousUrl);
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
                            className={
                              editor.isActive("link") ? "bg-accent" : ""
                            }
                          >
                            <Link2 className="h-4 w-4" />
                          </Button>
                        </BubbleMenu>
                      )}
                      <EditorContent
                        editor={editor}
                        className="prose max-w-none handwriting-content focus:outline-none"
                        style={{ color: getCurrentTextColorValue() }}
                      />
                    </div>
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
                  {memoizedCategories.map((category) => (
                    <CategorySection
                      key={category.id}
                      category={category}
                      notes={category.notes}
                      onLoadNote={loadNote}
                      onTogglePin={togglePin}
                      onDeleteNote={deleteNote}
                      onDeleteCategory={deleteCategory}
                    />
                  ))}
                </div>
              </DragDropContext>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

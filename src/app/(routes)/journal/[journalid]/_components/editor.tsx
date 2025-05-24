"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const MenuButton = ({
  active,
  onClick,
  children,
  title,
  disabled = false,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "p-2 rounded transition-colors",
      active ? "text-foreground" : "text-muted-foreground",
      !disabled && "hover:bg-muted",
      disabled && "opacity-50 cursor-not-allowed"
    )}
    disabled={disabled}
    title={title}
  >
    {children}
  </button>
);

export default function Editor({
  onChange,
  placeholder = "Start writing...",
  className,
  autoFocus = false,
}: {
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: `<h1 class="text-2xl font-bold text-foreground mb-4">Trading Plan</h1>
<h2 class="text-xl font-semibold text-muted-foreground mb-3">Market Analysis</h2>
<p>This is a sample trading journal entry. You can format your text with <strong>bold</strong>, <em>italics</em>, and other styles using the formatting toolbar that appears when you select text.</p>
<h2 class="text-xl font-semibold text-muted-foreground mb-3 mt-6">Trades</h2>
<p>Document your trades here with all the relevant details.</p>`,
    editorProps: {
      attributes: {
        class: "focus:outline-none h-full p-4 prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoFocus && editor) {
      // Small delay to ensure the editor is fully mounted
      const timer = setTimeout(() => {
        editor.commands.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [editor, autoFocus]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-full bg-transparent",
        className
      )}
    >
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100, maxWidth: "none" }}
          className="flex items-center gap-1 p-1 bg-background border rounded-lg shadow-lg"
        >
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold (⌘+B)"
          >
            <Bold className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic (⌘+I)"
          >
            <Italic className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough (⌘+Shift+X)"
          >
            <Strikethrough className="w-4 h-4" />
          </MenuButton>
          <div className="w-px h-6 bg-border mx-1" />
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </MenuButton>
          <div className="w-px h-6 bg-border mx-1" />
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (⌘+Z)"
          >
            <Undo className="w-4 h-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (⌘+Shift+Z)"
          >
            <Redo className="w-4 h-4" />
          </MenuButton>
        </BubbleMenu>
      )}
      <style jsx global>{`
        .ProseMirror {
          height: 100%;
          outline: none;
        }
        .ProseMirror h1 {
          @apply text-2xl font-bold text-foreground mb-4;
        }
        .ProseMirror h2 {
          @apply text-xl font-semibold text-muted-foreground mb-3 mt-6;
        }
        .ProseMirror p {
          @apply text-foreground/90 leading-relaxed mb-4;
        }
        .ProseMirror:focus {
          outline: none;
        }
      `}</style>
      <EditorContent editor={editor} className="h-full" />
    </div>
  );
}

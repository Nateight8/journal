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
  Type,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";

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
    content: `
<h1>Trading Journal</h1>
<p>Welcome to your trading journal. Use this space to document your trades, analyze your performance, and track your progress.</p>

<h2>Trade Analysis</h2>
<p>Document your market analysis and trading ideas here. Use headings to organize your thoughts and the formatting toolbar to highlight important information.</p>

<h3>Key Levels</h3>
<ul>
  <li>Support: $45,200</li>
  <li>Resistance: $47,800</li>
  <li>Volume Profile: High at $46,500</li>
</ul>

<h2>Trade Plan</h2>
<ol>
  <li>Wait for pullback to $45,800 support</li>
  <li>Enter long with 2% risk</li>
  <li>Target 1: $46,500 (partial profit)</li>
  <li>Target 2: $47,200 (full position)</li>
  <li>Stop loss: $45,400</li>
</ol>

<h3>Risk Management</h3>
<p>Remember to always manage your risk and never risk more than 1-2% of your account on any single trade.</p>
    `,
    editorProps: {
      attributes: {
        class:
          "focus:outline-none h-full p-4 prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto max-w-none",
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
      className={cn("h-full bg-transparent flex flex-col", className)}
    >
      {editor && (
        <>
          {/* Enhanced Bubble Menu */}
          <BubbleMenu
            editor={editor}
            tippyOptions={{
              duration: 100,
              maxWidth: "none",
              placement: "top-start",
              arrow: false,
              offset: [0, 8],
            }}
            className="flex items-center gap-0.5 p-1 bg-background border rounded-lg shadow-lg"
          >
            {/* Text Formatting */}
            <div className="flex items-center gap-0.5">
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
            </div>

            <div className="w-px h-6 bg-border mx-0.5" />

            {/* Headings */}
            <div className="flex items-center">
              <HeadingDropdownMenu editor={editor}>
                <button
                  type="button"
                  className={cn(
                    "p-1.5 rounded transition-colors flex items-center gap-1 text-sm",
                    "hover:bg-muted text-muted-foreground",
                    "h-7 w-7 justify-center"
                  )}
                  title="Text Style"
                >
                  <Type className="w-3.5 h-3.5" />
                </button>
              </HeadingDropdownMenu>
            </div>

            <div className="w-px h-6 bg-border mx-0.5" />

            {/* Lists */}
            <div className="flex items-center gap-0.5">
              <MenuButton
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                active={editor.isActive("bulletList")}
                title="Bullet List (⌘+Shift+8)"
              >
                <List className="w-4 h-4" />
              </MenuButton>
              <MenuButton
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                active={editor.isActive("orderedList")}
                title="Numbered List (⌘+Shift+7)"
              >
                <ListOrdered className="w-4 h-4" />
              </MenuButton>
            </div>

            <div className="w-px h-6 bg-border mx-0.5" />

            {/* Undo/Redo */}
            <div className="flex items-center gap-0.5">
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
            </div>
          </BubbleMenu>
        </>
      )}
      <style jsx global>{`
        .ProseMirror {
          height: 100%;
          outline: none;
        }
        .ProseMirror h1 {
          @apply text-3xl font-bold text-foreground mb-6 mt-8 pb-2 border-b border-border;
          font-family: var(--font-heading);
        }
        .ProseMirror h2 {
          @apply text-2xl font-bold text-foreground mb-4 mt-8 pb-1 border-b border-border/50;
          font-family: var(--font-heading);
        }
        .ProseMirror h3 {
          @apply text-xl font-semibold text-foreground mb-3 mt-6;
        }
        .ProseMirror h4 {
          @apply text-lg font-medium text-foreground/90 mb-2 mt-4;
        }
        .ProseMirror p {
          @apply text-foreground/90 leading-relaxed mb-4;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          @apply my-2 pl-6;
        }
        .ProseMirror ul {
          @apply list-disc;
        }
        .ProseMirror ol {
          @apply list-decimal;
        }
        .ProseMirror li {
          @apply mb-1;
        }
        .ProseMirror a {
          @apply text-primary underline underline-offset-2 hover:text-primary/80;
        }
        .ProseMirror:focus {
          outline: none;
        }
      `}</style>
      <EditorContent editor={editor} className="h-full" />
    </div>
  );
}

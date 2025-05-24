"use client";

import { EditorContent, useEditor, BubbleMenu } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Document } from "@tiptap/extension-document";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Heading } from "@tiptap/extension-heading";
import { BulletList } from "@tiptap/extension-bullet-list";
import { ListItem } from "@tiptap/extension-list-item";
import Indent from "@weiruo/tiptap-extension-indent";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import TextAlign, { TextAlignOptions } from "@tiptap/extension-text-align";

// Define our custom editor type with additional methods
import { Node as ProseMirrorNode } from "prosemirror-model";
import { Button } from "@/components/ui/button";
import {
  Bold as BoldIcon,
  Heading2,
  Heading3,
  Italic as ItalicIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CheckSquare,
  AlertCircle,
  Type,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import "./editor-styles.css";

// Define our custom editor type with additional methods
type CustomEditor = Editor & {
  resetChangeTracking: () => void;
};

interface JournalEditorProps {
  onContentChange?: (content: string, hasChanges: boolean) => void;
  initialContent?: string;
}

export default function JournalEditor({
  onContentChange,
  initialContent = "",
}: JournalEditorProps) {
  const [hasMultipleH1s, setHasMultipleH1s] = useState(false);
  const initialContentRef = useRef<string>(initialContent);

  // Get today's date in a readable format
  const getTodaysDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const forexJournalTemplate = `
    <h1>[Trade Title - e.g., EUR/USD Long Position - London Session]</h1>
    
    <p><strong>Date:</strong> ${getTodaysDate()}<br>
    <strong>Session:</strong> [e.g., London Open, New York Close]<br>
    <strong>Pair:</strong> [Currency Pair]<br>
    <strong>Position:</strong> [Long/Short]<br>
    <strong>Lot Size:</strong> [Position Size]</p>

    <h2>Pre-Trade Analysis</h2>

    <h3>Market Context</h3>
    <p>[Describe the overall market trend, key levels, and recent price action. What's the bigger picture for this pair?]</p>

    <h3>Technical Setup</h3>
    <ul>
      <li><strong>Pattern:</strong> [e.g., Bull flag, Head & shoulders, Support/resistance break]</li>
      <li><strong>Key Support:</strong> [Support level with reasoning]</li>
      <li><strong>Key Resistance:</strong> [Resistance level with reasoning]</li>
      <li><strong>Momentum:</strong> [RSI, MACD, or other momentum indicators]</li>
      <li><strong>Volume:</strong> [Volume analysis if applicable]</li>
    </ul>

    <h3>Fundamental Backdrop</h3>
    <p>[Any relevant news, economic events, or market sentiment affecting this pair]</p>

    <h2>Trade Execution</h2>

    <h3>Entry Details</h3>
    <ul>
      <li><strong>Entry Price:</strong> [Actual entry price]</li>
      <li><strong>Entry Time:</strong> [Time of entry]</li>
      <li><strong>Entry Reason:</strong> [What triggered your entry?]</li>
      <li><strong>Risk:</strong> [% of account or dollar amount at risk]</li>
    </ul>

    <h3>Trade Management Plan</h3>
    <ul>
      <li><strong>Stop Loss:</strong> [SL price and reasoning]</li>
      <li><strong>Take Profit 1:</strong> [First target with R/R ratio]</li>
      <li><strong>Take Profit 2:</strong> [Second target with R/R ratio - if applicable]</li>
      <li><strong>Position Management:</strong> [How will you manage the trade as it moves?]</li>
    </ul>

    <h2>Psychology & Emotions</h2>

    <h3>Pre-Trade Mental State</h3>
    <p>[How are you feeling before entering? Confident, anxious, rushed, patient?]</p>

    <h3>During Trade</h3>
    <p>[Document your emotions as the trade progresses - especially any urges to deviate from your plan]</p>

    <h2>Trade Outcome</h2>

    <h3>Exit Details</h3>
    <ul>
      <li><strong>Exit Price:</strong> [Final exit price or current status if still open]</li>
      <li><strong>Exit Time:</strong> [Time of exit]</li>
      <li><strong>Profit/Loss:</strong> [Final P&L in currency and R multiples]</li>
      <li><strong>Duration:</strong> [How long was the trade open?]</li>
    </ul>

    <h3>What Went Right</h3>
    <ul data-type="taskList">
      <li data-type="taskItem" data-checked="false">[List specific things that worked well in this trade]</li>
      <li data-type="taskItem" data-checked="false">[e.g., Good entry timing, stuck to risk management, etc.]</li>
      <li data-type="taskItem" data-checked="false">[Add more items as needed]</li>
    </ul>

    <h3>What Could Be Improved</h3>
    <p>[What would you do differently next time? Be specific and actionable]</p>

    <h2>Key Lessons & Notes</h2>

    <h3>Technical Insights</h3>
    <p>[What did this trade teach you about technical analysis or market behavior?]</p>

    <h3>Behavioral Observations</h3>
    <p>[What patterns do you notice in your trading psychology?]</p>

    <h3>Market Conditions</h3>
    <p>[How did the market environment affect this trade?]</p>

    <h2>Action Items for Next Trades</h2>
    <ul data-type="taskList">
      <li data-type="taskItem" data-checked="false">[Specific action based on this trade's lessons]</li>
      <li data-type="taskItem" data-checked="false">[e.g., Review similar setups, adjust position sizing, etc.]</li>
      <li data-type="taskItem" data-checked="false">[Add more action items as needed]</li>
    </ul>

    <h2>Screenshots & Charts</h2>
    <p>[Space for chart screenshots and additional visual analysis]</p>

    <hr>

    <p><strong>Overall Trade Grade:</strong> [A, B, C, D, F]<br>
    <strong>Emotional Control:</strong> [1-10]<br>
    <strong>Technical Execution:</strong> [1-10]<br>
    <strong>Risk Management:</strong> [1-10]</p>
  `;

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Strike,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      } as TextAlignOptions),
      Text,
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: "editor-heading",
        },
      }),
      Bold.configure({
        HTMLAttributes: {
          class: "editor-bold",
        },
      }),
      Italic.configure({
        HTMLAttributes: {
          class: "editor-italic",
        },
      }),
      Strike.configure({
        HTMLAttributes: {
          class: "editor-strike",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: "editor-task-list",
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "editor-task-item",
        },
      }),
      ListItem,
      BulletList,
      Indent.configure({
        types: ["paragraph", "heading", "listItem", "taskItem"],
      }),
    ],
    content: initialContent || forexJournalTemplate,
    editorProps: {
      attributes: {
        class: "prose prose-neutral max-w-none focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      // Check for multiple H1s
      const h1Count = editor.state.doc.content.content.filter(
        (node: ProseMirrorNode) =>
          node.type.name === "heading" && node.attrs.level === 1
      ).length;
      setHasMultipleH1s(h1Count > 1);

      // Check for content changes
      const currentContent = editor.getHTML();
      const hasChanges = currentContent !== initialContentRef.current;

      // Notify parent component of content changes
      if (onContentChange) {
        onContentChange(currentContent, hasChanges);
      }
    },
  });

  // Update editor content when initialContent changes
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent || forexJournalTemplate);
      initialContentRef.current = initialContent || forexJournalTemplate;
    }
  }, [editor, initialContent, forexJournalTemplate]);

  // Expose resetChangeTracking method via ref if needed
  useEffect(() => {
    if (!editor) return;

    const resetChangeTracking = () => {
      initialContentRef.current = editor.getHTML();
      if (onContentChange) {
        onContentChange(editor.getHTML(), false);
      }
    };

    // Store the reset function on the editor instance
    (editor as CustomEditor).resetChangeTracking = resetChangeTracking;

    // Cleanup function to avoid memory leaks
    return () => {
      // No need to delete the method as it will be garbage collected
    };
  }, [editor, onContentChange, forexJournalTemplate]);

  const toggleHeading = (level: 1 | 2 | 3) => {
    if (!editor) return;

    if (level === 1) {
      // Check if there's already an H1 and we're not currently in an H1
      const currentNode = editor.state.selection.$head.parent;
      const isCurrentlyH1 =
        currentNode.type.name === "heading" && currentNode.attrs.level === 1;

      if (!isCurrentlyH1) {
        const h1Count = editor.state.doc.content.content.filter(
          (node: ProseMirrorNode) =>
            node.type.name === "heading" && node.attrs.level === 1
        ).length;

        if (h1Count >= 1) {
          return; // Prevent adding another H1
        }
      }
    }

    editor.chain().focus().toggleHeading({ level }).run();
  };

  const toggleTaskList = () => {
    if (!editor) return;
    editor.chain().focus().toggleTaskList().run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="h-full w-full max-w-2xl mx-auto">
      <style jsx global>{`
        /* Text selection styles */
        ::selection {
          background-color: #3b82f6;
          color: white;
        }
      `}</style>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {hasMultipleH1s && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Only one main title (H1) is recommended per journal entry.
              Consider using subheadings (H2/H3) instead.
            </AlertDescription>
          </Alert>
        )}

        <div className="relative">
          <BubbleMenu
            editor={editor}
            tippyOptions={{
              duration: 100,
              placement: "top",
              offset: [0, 10],
            }}
            className="flex items-center gap-1 p-2 bg-popover border rounded-md shadow-lg"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleHeading(1)}
              className={`h-8 w-8 p-0 ${
                editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""
              }`}
              disabled={
                !editor.isActive("heading", { level: 1 }) && hasMultipleH1s
              }
              title="Title (H1)"
            >
              <Type className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleHeading(2)}
              className={`h-8 w-8 p-0 ${
                editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""
              }`}
              title="Heading (H2)"
            >
              <Heading2 className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleHeading(3)}
              className={`h-8 w-8 p-0 ${
                editor.isActive("heading", { level: 3 }) ? "bg-accent" : ""
              }`}
              title="Subheading (H3)"
            >
              <Heading3 className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive("bold") ? "bg-accent" : ""
              }`}
              title="Bold"
            >
              <BoldIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive("italic") ? "bg-accent" : ""
              }`}
              title="Italic"
            >
              <ItalicIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive("strike") ? "bg-accent" : ""
              }`}
              title="Strikethrough"
            >
              <Strikethrough className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""
              }`}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={`h-8 w-8 p-0 ${
                editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""
              }`}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={`h-8 w-8 p-0 ${
                editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""
              }`}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTaskList}
              className={`h-8 w-8 p-0 ${
                editor.isActive("taskList") ? "bg-accent" : ""
              }`}
              title="Task List"
            >
              <CheckSquare className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().sinkListItem("listItem").run()
              }
              className="h-8 w-8 p-0"
              title="Indent"
              disabled={!editor.can().sinkListItem("listItem")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 8 7 12 3 16"></polyline>
                <line x1="21" y1="12" x2="11" y2="12"></line>
                <line x1="21" y1="6" x2="11" y2="6"></line>
                <line x1="21" y1="18" x2="11" y2="18"></line>
              </svg>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor.chain().focus().liftListItem("listItem").run()
              }
              className="h-8 w-8 p-0"
              title="Outdent"
              disabled={!editor.can().liftListItem("listItem")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="17 8 21 12 17 16"></polyline>
                <line x1="3" y1="12" x2="13" y2="12"></line>
                <line x1="3" y1="6" x2="13" y2="6"></line>
                <line x1="3" y1="18" x2="13" y2="18"></line>
              </svg>
            </Button>
          </BubbleMenu>

          <EditorContent
            editor={editor}
            className="editor-content focus-within:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

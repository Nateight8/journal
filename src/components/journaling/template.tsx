"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Save,
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  Sparkles,
  BookOpen,
} from "lucide-react";
import JournalEditor from "@/app/(routes)/journal/[journalid]/_components/journal-editor";

interface JournalTemplateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (content: string) => void;
  initialContent?: string;
  className?: string;
  title?: string;
  mode?: "journal" | "trading-plan";
}

export default function JournalTemplateDrawer({
  isOpen,
  onClose,
  onSave,
  initialContent = "",
  className = "",
  title = "Create Journal Template",
  mode = "journal",
}: JournalTemplateDrawerProps) {
  const [editorContent, setEditorContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleContentChange = (content: string, hasChanges: boolean) => {
    setEditorContent(content);
    setHasChanges(hasChanges);
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    setIsSaving(true);

    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onSave?.(editorContent);
    setHasChanges(false);
    setIsSaving(false);
    setShowSaveSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const handleClose = () => {
    if (hasChanges) {
      const confirmClose = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirmClose) return;
    }
    onClose();
  };

  return (
    <div
      className={`absolute inset-0 z-50 bg-background border border-border rounded-lg shadow-2xl transition-transform duration-500 ease-out ${
        isOpen ? "translate-y-0" : "translate-y-full"
      } ${className}`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-none border-b border-border bg-background/95 backdrop-blur-sm rounded-t-lg">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {mode === "journal"
                      ? "Build your personalized trading journal structure"
                      : "Define your trading strategy and rules"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {showSaveSuccess && (
                <div className="flex items-center space-x-2 text-primary animate-in fade-in-0 slide-in-from-right-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Template saved!</span>
                </div>
              )}

              {hasChanges && (
                <Badge
                  variant="outline"
                  className="border-orange-500/30 bg-orange-500/10 text-orange-600"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Unsaved changes
                </Badge>
              )}

              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="bg-primary hover:bg-primary/90"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Template
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="px-4 pb-4">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>
                  Template includes pre-built sections for comprehensive trade
                  analysis
                </span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Customize sections to match your trading style</span>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <JournalEditor
              initialContent={initialContent}
              onContentChange={handleContentChange}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex-none border-t border-border bg-muted/30 p-4 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Auto-saves as you type</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
                <span>Use this template for all future trades</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="bg-primary hover:bg-primary/90"
              >
                {isSaving ? "Saving..." : "Save & Use Template"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

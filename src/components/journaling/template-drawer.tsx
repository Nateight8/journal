"use client";
import { useState } from "react";
import type React from "react";
import DashboardPrompt from "./journaling-prompt-v2";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";
import JournalTemplateDrawer from "./template";

interface DashboardWithTemplateDrawerProps {
  children?: React.ReactNode;
  hasTemplate?: boolean;
  onTemplateCreated?: (content: string) => void;
}

export default function DashboardWithTemplateDrawer({
  children,
  hasTemplate = false,
  onTemplateCreated,
}: DashboardWithTemplateDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [templateExists, setTemplateExists] = useState(hasTemplate);

  const handleCreateTemplate = () => {
    setIsDrawerOpen(true);
  };

  const handleSaveTemplate = (content: string) => {
    setTemplateExists(true);
    onTemplateCreated?.(content);
    console.log("Template saved:", content);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="relative">
      {/* Dashboard Content */}
      <div
        className={`transition-transform duration-500 ease-out ${
          isDrawerOpen ? "scale-95 -translate-y-8" : "scale-100 translate-y-0"
        }`}
        style={{
          pointerEvents: isDrawerOpen ? "none" : "auto",
          transformOrigin: "center top",
        }}
      >
        {/* Dashboard Prompt - only show if no template exists */}
        {!templateExists && (
          <div className="p-6">
            <DashboardPrompt
              showTemplatePrompt={true}
              showTradingPlanPrompt={false}
              onCreateTemplate={handleCreateTemplate}
              onDismiss={() => console.log("Prompt dismissed")}
            />
          </div>
        )}

        {/* Template Success State */}
        {templateExists && (
          <div className="p-6">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/20 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Journal Template Created!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your personalized template is ready. It will be used for all
                    new journal entries.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDrawerOpen(true)}
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  Edit Template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log("Create new journal entry")}
                >
                  Create Journal Entry
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Rest of Dashboard Content */}
        {children}
      </div>

      {/* Template Drawer */}
      <JournalTemplateDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSave={handleSaveTemplate}
      />
    </div>
  );
}

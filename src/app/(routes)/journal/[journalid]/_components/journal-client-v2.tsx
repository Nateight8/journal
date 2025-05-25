"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import type React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Target,
  Shield,
  Edit3,
  Save,
  ArrowLeft,
  GripVertical,
  Calendar,
  BarChart3,
  CheckCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import JournalEditor from "./journal-editor";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import journalOperations, {
  GetJournalResponse,
} from "@/graphql/journal-operationsl";
import { useMutation, useQuery } from "@apollo/client";
import WorkInProgress from "@/components/wip";

export default function EnhancedTradeJournal({
  journalId,
}: {
  journalId: string;
}) {
  const [expandedPanel, setExpandedPanel] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(40); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const [journalNote, setJournalNote] = useState(""); // Initialize with empty string to use template
  const [editorContent, setEditorContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [pendingClose, setPendingClose] = useState(false);

  // Mock trade data
  const tradeData = {
    symbol: "AAPL",
    direction: "LONG",
    entryPrice: 175.24,
    currentPrice: 178.9,
    quantity: 100,
    entryTime: "2024-01-15 09:30:00",
    pnl: 366.0,
    pnlPercent: 2.09,
  };

  // Mock trade entries
  const tradeEntries = [
    {
      id: 1,
      type: "ENTRY",
      price: 175.24,
      quantity: 100,
      time: "09:30:00",
      status: "FILLED",
    },
    {
      id: 2,
      type: "STOP_LOSS",
      price: 172.0,
      quantity: 100,
      time: "09:31:00",
      status: "PENDING",
    },
    {
      id: 3,
      type: "TAKE_PROFIT",
      price: 182.0,
      quantity: 50,
      time: "09:32:00",
      status: "PENDING",
    },
    {
      id: 4,
      type: "TAKE_PROFIT",
      price: 185.0,
      quantity: 50,
      time: "09:32:00",
      status: "PENDING",
    },
  ];

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (expandedPanel) return;
      setIsResizing(true);
      e.preventDefault();
    },
    [expandedPanel]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current || expandedPanel) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;

      // Convert to absolute pixel values
      const minWidth = 300; // minimum width in pixels
      const maxWidth = 800; // maximum width in pixels

      // Calculate new width in pixels
      let newWidth = mouseX;

      // Constrain between min and max widths
      newWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);

      // Ensure right panel also respects constraints
      const rightWidth = containerWidth - newWidth;
      if (rightWidth < minWidth) {
        newWidth = containerWidth - minWidth;
      } else if (rightWidth > maxWidth) {
        newWidth = containerWidth - maxWidth;
      }

      // Update the width
      setLeftPanelWidth((newWidth / containerWidth) * 100);
    },
    [isResizing, expandedPanel]
  );

  const handleMouseUp = useCallback(() => {
    if (!isResizing) return;
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, [isResizing]);

  // Move event listeners to useEffect
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const toggleLeftPanel = () => {
    setIsAnimating(true);
    setExpandedPanel(expandedPanel === "left" ? null : "left");
    setTimeout(() => setIsAnimating(false), 300);
  };

  const toggleRightPanel = () => {
    setIsAnimating(true);
    setExpandedPanel(expandedPanel === "right" ? null : "right");
    setTimeout(() => setIsAnimating(false), 300);
  };

  const getLeftPanelWidth = () => {
    if (expandedPanel === "left") return "800px"; // Use max width when expanded
    if (expandedPanel === "right") return "60px";
    return `${leftPanelWidth}%`;
  };

  const getRightPanelWidth = () => {
    if (expandedPanel === "right") return "800px"; // Use max width when expanded
    if (expandedPanel === "left") return "60px";
    return `${100 - leftPanelWidth}%`;
  };

  const getEntryTypeColor = (type: string) => {
    switch (type) {
      case "ENTRY":
        return "bg-primary/10 text-primary border-primary/20";
      case "STOP_LOSS":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "TAKE_PROFIT":
        return "bg-secondary text-secondary-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getEntryTypeIcon = (type: string) => {
    switch (type) {
      case "ENTRY":
        return <TrendingUp className="w-4 h-4" />;
      case "STOP_LOSS":
        return <Shield className="w-4 h-4" />;
      case "TAKE_PROFIT":
        return <Target className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "FILLED":
        return (
          <Badge variant="default">
            <CheckCircle className="w-3 h-3 mr-1" />
            Filled
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge variant="destructive">
            <X className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const [saveJournal, { loading: isSaving }] = useMutation(
    journalOperations.Mutations.updateJournal,
    {
      onCompleted: () => {
        console.log("Journal saved successfully");
      },
    }
  );

  const { data: journalData } = useQuery<GetJournalResponse>(
    journalOperations.Queries.getJournal,
    {
      variables: {
        getJournalId: journalId,
      },
    }
  );

  const journal = journalData?.getJournal;

  // Set the default note when journal data is loaded
  useEffect(() => {
    if (journal?.note) {
      setJournalNote(journal.note);
      setEditorContent(journal.note);
    }
  }, [journal?.note]);

  console.log("Journal data:", journal?.note);

  const handleSaveNote = () => {
    console.log("Saving content:", editorContent);

    saveJournal({
      variables: {
        input: {
          id: journalId,
          note: editorContent,
        },
      },
    });

    setJournalNote(editorContent);
    setHasChanges(false); // Reset changes after save
    setIsEditing(false);
  };

  const handleSheetOpenChange = (open: boolean) => {
    if (!open && hasChanges) {
      setShowUnsavedDialog(true);
      setPendingClose(true);
      return;
    }
    setIsSheetOpen(open);
  };

  const handleUnsavedDialogConfirm = () => {
    setShowUnsavedDialog(false);
    if (pendingClose) {
      setIsSheetOpen(false);
      setPendingClose(false);
    }
  };

  const handleUnsavedDialogCancel = () => {
    setShowUnsavedDialog(false);
    setPendingClose(false);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1064);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div ref={containerRef} className="flex h-full">
      {isMobile ? (
        // Mobile Layout - Single Panel with Sheet
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="h-16 border-b flex items-center justify-between px-4">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="font-bold text-foreground">
                  {tradeData.symbol} - {tradeData.direction}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Trade Entries & Orders
                </p>
              </div>
            </div>
            <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Notes
                </Button>
              </SheetTrigger>
              <SheetContent
                showClose={true}
                side="bottom"
                className="h-[90vh] flex flex-col p-0"
              >
                <SheetHeader
                  showClose={true}
                  className="px-6 py-4 border-b flex-none"
                >
                  <SheetTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Trade Analysis - {new Date().toLocaleDateString()}
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 min-h-0">
                  {isEditing ? (
                    <div className="h-full flex flex-col px-6 py-4">
                      <div className="flex-1 min-h-0">
                        <Textarea
                          value={journalNote}
                          onChange={(e) => setJournalNote(e.target.value)}
                          className="h-full resize-none border"
                          placeholder="Write your trade analysis, observations, and lessons learned..."
                        />
                      </div>
                      <div className="flex-none flex justify-end space-x-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="border"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          disabled={!hasChanges}
                          size="sm"
                          onClick={handleSaveNote}
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col">
                      <div className="flex-none px-6 py-4 flex justify-end">
                        {hasChanges ? (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={handleSaveNote}
                            className="bg-primary hover:bg-primary/90"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                            className="hover:bg-muted"
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        )}
                      </div>
                      <div className="flex-1 min-h-0 px-6 pb-4">
                        <ScrollArea className="h-full">
                          <div className="max-w-4xl mx-auto">
                            <JournalEditor
                              initialContent={journalNote}
                              onContentChange={(content, hasChanges) => {
                                setEditorContent(content);
                                setHasChanges(hasChanges);
                              }}
                            />
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Content - Trade Entries Only */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Trade Summary Card */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Position Summary</span>
                  <Badge
                    variant={tradeData.pnl >= 0 ? "default" : "destructive"}
                    className={
                      tradeData.pnl >= 0 ? "bg-primary/10 text-primary" : ""
                    }
                  >
                    {tradeData.pnl >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    ${tradeData.pnl.toFixed(2)} (
                    {tradeData.pnlPercent.toFixed(2)}%)
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Entry Price</p>
                    <p className="font-semibold">${tradeData.entryPrice}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Price</p>
                    <p className="font-semibold">${tradeData.currentPrice}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Quantity</p>
                    <p className="font-semibold">{tradeData.quantity} shares</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Entry Time</p>
                    <p className="font-semibold">{tradeData.entryTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trade Entries */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Orders & Entries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tradeEntries.map((entry, index) => (
                  <div key={entry.id}>
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg border ${getEntryTypeColor(
                            entry.type
                          )}`}
                        >
                          {getEntryTypeIcon(entry.type)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {entry.type.replace("_", " ")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${entry.price} × {entry.quantity} @ {entry.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(entry.status)}
                      </div>
                    </div>
                    {index < tradeEntries.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <AlertDialog
            open={showUnsavedDialog}
            onOpenChange={setShowUnsavedDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                <AlertDialogDescription>
                  You have unsaved changes in your journal notes. Are you sure
                  you want to close without saving?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleUnsavedDialogCancel}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleUnsavedDialogConfirm}>
                  Close Without Saving
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        // Desktop Layout - Split Panels (existing code)
        <>
          {/* Left Panel - Trade Entries */}
          <div
            className="relative border-r transition-all duration-300 ease-in-out flex flex-col shadow-sm"
            style={{ width: getLeftPanelWidth() }}
          >
            {/* Header */}
            <div className="h-16 border-b flex items-center justify-between px-4">
              {expandedPanel !== "right" && (
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" className="p-2">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div>
                    <h1 className="font-bold text-foreground">
                      {tradeData.symbol} - {tradeData.direction}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Trade Entries & Orders
                    </p>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLeftPanel}
                disabled={isAnimating}
                className="p-2 hover:bg-muted"
              >
                {expandedPanel === "left" ? (
                  <Minimize2 className="w-4 h-4" />
                ) : expandedPanel === "right" ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {expandedPanel === "right" ? (
                <div className="h-full flex items-center justify-center bg-muted">
                  <Button
                    variant="ghost"
                    onClick={toggleLeftPanel}
                    className="h-full flex items-center justify-center hover:bg-muted"
                  >
                    <div className="[writing-mode:vertical-rl] rotate-180 text-xs font-medium tracking-wider">
                      VIEW TRADE ENTRIES
                    </div>
                  </Button>
                </div>
              ) : (
                <div className="p-4 space-y-4 h-full overflow-y-auto">
                  {/* Trade Summary Card */}
                  {/* <Card className="border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Position Summary</span>
                        <Badge
                          variant={
                            tradeData.pnl >= 0 ? "default" : "destructive"
                          }
                          className={
                            tradeData.pnl >= 0
                              ? "bg-primary/10 text-primary"
                              : ""
                          }
                        >
                          {tradeData.pnl >= 0 ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          ${tradeData.pnl.toFixed(2)} (
                          {tradeData.pnlPercent.toFixed(2)}%)
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Entry Price</p>
                          <p className="font-semibold">
                            ${tradeData.entryPrice}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Current Price</p>
                          <p className="font-semibold">
                            ${tradeData.currentPrice}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-semibold">
                            {tradeData.quantity} shares
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Entry Time</p>
                          <p className="font-semibold">{tradeData.entryTime}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card> */}

                  {/* Trade Entries */}
                  {/* <Card className="border">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Orders & Entries
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {tradeEntries.map((entry, index) => (
                        <div key={entry.id}>
                          <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-2 rounded-lg border ${getEntryTypeColor(
                                  entry.type
                                )}`}
                              >
                                {getEntryTypeIcon(entry.type)}
                              </div>
                              <div>
                                <p className="font-medium text-foreground">
                                  {entry.type.replace("_", " ")}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  ${entry.price} × {entry.quantity} @{" "}
                                  {entry.time}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(entry.status)}
                            </div>
                          </div>
                          {index < tradeEntries.length - 1 && (
                            <Separator className="my-2" />
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card> */}
                  <WorkInProgress
                    variant="compact"
                    title="Show Logged Trade Data"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Resize Handle */}
          {!expandedPanel && (
            <div
              ref={resizeRef}
              className="w-1 border hover:bg-primary/90 cursor-col-resize transition-colors duration-200 flex items-center justify-center group relative"
              onMouseDown={handleMouseDown}
            >
              <div className="absolute inset-y-0 -left-1 -right-1 flex items-center justify-center">
                <GripVertical className="w-3 h-3 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
          )}

          {/* Right Panel - Journal Notes */}
          <div
            className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
            style={{ width: getRightPanelWidth() }}
          >
            {/* Header */}
            <div className="h-16 border-b flex items-center justify-between px-6">
              {expandedPanel !== "left" && (
                <div>
                  <h2 className="font-semibold text-foreground">
                    Journal Notes
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Record your thoughts and analysis
                  </p>
                </div>
              )}
              <div className="flex items-center space-x-2">
                {expandedPanel !== "left" && (
                  <>
                    <Button
                      variant="default"
                      disabled={!hasChanges}
                      size="sm"
                      onClick={handleSaveNote}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleRightPanel}
                  disabled={isAnimating}
                  className="p-2 hover:bg-muted"
                >
                  {expandedPanel === "right" ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : expandedPanel === "left" ? (
                    <ChevronLeft className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {expandedPanel === "left" ? (
                <div className="h-full flex items-center justify-center bg-muted">
                  <Button
                    variant="ghost"
                    onClick={toggleRightPanel}
                    className="h-full flex items-center justify-center hover:bg-muted"
                  >
                    <div className="[writing-mode:vertical-rl] rotate-180 text-xs font-medium tracking-wider">
                      EDIT JOURNAL NOTES
                    </div>
                  </Button>
                </div>
              ) : (
                <ScrollArea className="p-6 h-[calc(100vh-8rem)] overflow-y-auto">
                  <div className="max-w-4xl mx-auto">
                    <JournalEditor
                      initialContent={journalNote}
                      onContentChange={(content, hasChanges) => {
                        setEditorContent(content);
                        setHasChanges(hasChanges);
                      }}
                    />
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .writing-mode-vertical-rl {
          writing-mode: vertical-rl;
        }
      `}</style>
    </div>
  );
}

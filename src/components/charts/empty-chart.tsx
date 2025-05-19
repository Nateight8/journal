"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TradeEmptyStateProps {
  icon: LucideIcon;
  category: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyChart({
  icon: Icon,
  category,
  actionLabel = "Log your first trade",
  onAction,
}: TradeEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center  p-4 text-center border border-dashed rounded-lg ">
      <div className="rounded-full bg-muted/80 p-5 mb-5 border">
        <Icon className="h-10 w-10 text-muted-foreground/70" />
      </div>
      <h3 className="text-xl font-medium mb-2">No {category} trades yet</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Your {category.toLowerCase()} performance metrics will appear here once
        you&apos;ve logged your first trade.
      </p>
      <Button onClick={onAction}>{actionLabel}</Button>
    </div>
  );
}

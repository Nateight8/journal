"use client";

import type React from "react";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";
import { LoadingDots, LoadingSpinner } from "./loading-spinner";

interface DataLoadingStateProps {
  isLoading: boolean;
  error?: string | null;
  isEmpty?: boolean;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  className?: string;
}

export function DataLoadingState({
  isLoading,
  error,
  isEmpty,
  children,
  loadingComponent,
  emptyComponent,
  errorComponent,
  className,
}: DataLoadingStateProps) {
  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        {loadingComponent || <DefaultLoadingComponent />}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        {errorComponent || <DefaultErrorComponent error={error} />}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        {emptyComponent || <DefaultEmptyComponent />}
      </div>
    );
  }

  return <>{children}</>;
}

function DefaultLoadingComponent() {
  return (
    <div className="text-center space-y-4">
      <LoadingSpinner size="lg" />
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Loading data...</p>
        <LoadingDots />
      </div>
    </div>
  );
}

function DefaultErrorComponent({ error }: { error: string }) {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Something went wrong
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-primary hover:underline"
        >
          Try again
        </button>
      </CardContent>
    </Card>
  );
}

function DefaultEmptyComponent() {
  return (
    <Card className="border-muted">
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <WifiOff className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No data available
        </h3>
        <p className="text-sm text-muted-foreground">
          There&apos;s nothing to show here yet.
        </p>
      </CardContent>
    </Card>
  );
}

// Inline loading states for smaller components
export function InlineLoader({
  size = "sm",
  text,
}: {
  size?: "sm" | "md";
  text?: string;
}) {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size={size} />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
}

interface ButtonLoaderProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
}

export function ButtonLoader({ children, isLoading = false, ...props }: ButtonLoaderProps) {
  return (
    <button disabled={isLoading} {...props}>
      <div className="flex items-center space-x-2">
        {isLoading && <LoadingSpinner size="sm" />}
        <span>{children}</span>
      </div>
    </button>
  );
}

// Connection status indicator
export function ConnectionStatus({ isOnline = true }: { isOnline?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center space-x-2 text-xs px-2 py-1 rounded-full",
        isOnline
          ? "bg-green-500/10 text-green-600"
          : "bg-red-500/10 text-red-600"
      )}
    >
      {isOnline ? (
        <Wifi className="w-3 h-3" />
      ) : (
        <WifiOff className="w-3 h-3" />
      )}
      <span>{isOnline ? "Connected" : "Offline"}</span>
    </div>
  );
}

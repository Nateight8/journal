"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, BarChart3 } from "lucide-react";

interface PageTransitionLoaderProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export function PageTransitionLoader({
  isLoading,
  message = "Loading your dashboard...",
  className,
}: PageTransitionLoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      setProgress(100);
    }
  }, [isLoading]);

  if (!isLoading && progress === 100) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
        "flex items-center justify-center",
        className
      )}
    >
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        {/* Animated Logo/Icon */}
        <div className="relative">
          <div className="w-16 h-16 mx-auto relative">
            <TrendingUp className="w-16 h-16 text-primary animate-pulse" />
            <BarChart3 className="w-8 h-8 text-primary/60 absolute top-2 right-2 animate-bounce" />
          </div>

          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin">
            <div className="w-20 h-20 mx-auto relative">
              <div className="absolute top-0 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2"></div>
              <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-primary/60 rounded-full -translate-x-1/2"></div>
              <div className="absolute left-0 top-1/2 w-2 h-2 bg-primary/40 rounded-full -translate-y-1/2"></div>
              <div className="absolute right-0 top-1/2 w-2 h-2 bg-primary/80 rounded-full -translate-y-1/2"></div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {Math.round(progress)}%
          </p>
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{message}</h3>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

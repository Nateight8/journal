"use client";
import { useState, useEffect } from "react";
import type React from "react";
import MobileNotReady from "./screen-not";

interface MobileDetectorProps {
  children: React.ReactNode;
  breakpoint?: number;
  showMobileScreen?: boolean;
}

export default function MobileDetector({
  children,
  breakpoint = 1024,
  showMobileScreen = true,
}: MobileDetectorProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
      setIsLoading(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isMobile && showMobileScreen) {
    return <MobileNotReady />;
  }

  return <>{children}</>;
}

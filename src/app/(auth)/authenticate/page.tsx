"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";

// Dynamically import only the Loader2 icon
const Loader2 = dynamic(
  () => import("lucide-react").then((mod) => mod.Loader2),
  { ssr: false, loading: () => <div className="h-6 w-6" /> }
);

// Simple loading component
function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );
}

// Lazy load the auth form with proper typing
const AuthForm = dynamic(
  () => import("./_components/auth-form-client").then((mod) => mod.LoginForm),
  {
    ssr: false,
    loading: () => <LoadingSpinner className="p-8" />,
  }
);

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Handle redirects in a single effect to prevent layout shifts
  useEffect(() => {
    if (loading) return;

    if (user?.onboardingStep === "account_setup") {
      router.replace("/onboarding");
    } else if (user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  // Show loading state while checking auth or redirecting
  if (loading || user) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
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
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" x2="4" y1="22" y2="15" />
            </svg>
          </div>
          <span>Journal</span>
        </a>
        <Suspense fallback={<LoadingSpinner />}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}

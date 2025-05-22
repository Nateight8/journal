import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function OnboardingProgress({
  currentStep,
  totalSteps,
}: OnboardingProgressProps) {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-1 w-4 rounded-full transition-all duration-300",
            index === currentStep
              ? "bg-primary w-6"
              : index < currentStep
              ? "bg-primary/70"
              : "bg-muted"
          )}
        />
      ))}
    </div>
  );
}

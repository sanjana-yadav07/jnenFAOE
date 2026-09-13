import { cn } from "@/lib/utils";

export function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Step ${step} of ${total}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i < step
              ? i === step - 1
                ? "w-8 bg-deep-teal"
                : "w-5 bg-deep-teal/70"
              : "w-3 bg-border-color/80"
          )}
        />
      ))}
    </div>
  );
}

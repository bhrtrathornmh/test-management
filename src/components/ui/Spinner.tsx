import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: number;
}

export function Spinner({ className, size = 16 }: SpinnerProps) {
  return (
    <Loader2
      size={size}
      className={cn("animate-spin text-primary-500", className)}
    />
  );
}

interface PageLoaderProps {
  label?: string;
  className?: string;
}

export function PageLoader({ label = "Loading…", className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-16 text-sm text-slate-400",
        className,
      )}
    >
      <Spinner size={28} />
      {label}
    </div>
  );
}

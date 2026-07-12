import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "primary" | "neutral" | "dark";

const filledToneClasses: Record<Tone, string> = {
  success: "bg-success-50 text-success-700",
  warning: "bg-warning-50 text-warning-700",
  danger: "bg-danger-50 text-danger-700",
  primary: "bg-primary-50 text-primary-700",
  neutral: "bg-slate-100 text-slate-600",
  dark: "bg-slate-900 text-white",
};

const outlineToneClasses: Record<Tone, string> = {
  success: "border border-success-500 bg-white text-success-700",
  warning: "border border-warning-500 bg-white text-warning-700",
  danger: "border border-danger-500 bg-white text-danger-700",
  primary: "border border-primary-500 bg-white text-primary-700",
  neutral: "border border-slate-300 bg-white text-slate-600",
  dark: "border border-slate-900 bg-white text-slate-900",
};

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  variant?: "filled" | "outline";
  pill?: boolean;
  className?: string;
}

export function Badge({
  children,
  tone = "neutral",
  variant = "filled",
  pill,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium",
        pill ? "rounded-full" : "rounded-md",
        variant === "outline" ? outlineToneClasses[tone] : filledToneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

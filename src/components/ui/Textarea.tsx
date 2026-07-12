import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400",
          invalid ? "border-danger-400" : "border-slate-200",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

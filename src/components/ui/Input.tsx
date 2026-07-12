import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-800 placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400",
          invalid ? "border-danger-400" : "border-slate-200",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

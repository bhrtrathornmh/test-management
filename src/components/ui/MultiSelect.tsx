import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  id: string;
  name: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Choose from Drop-down",
  disabled,
  invalid,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selectedOptions = options.filter((o) => value.includes(o.id));

  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-lg border bg-white px-2.5 py-1.5 text-left text-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary-200",
          disabled ? "cursor-not-allowed bg-slate-50 text-slate-400" : "",
          invalid ? "border-danger-400" : "border-slate-200",
        )}
      >
        {selectedOptions.length === 0 && (
          <span className="px-0.5 text-slate-400">{placeholder}</span>
        )}
        {selectedOptions.map((o) => (
          <span
            key={o.id}
            className="flex items-center gap-1 rounded-md bg-warning-50 px-2 py-0.5 text-xs font-medium text-warning-700"
          >
            {o.name}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                toggle(o.id);
              }}
            />
          </span>
        ))}
        <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-slate-400" />
      </button>
      {open && !disabled && (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {options.length === 0 && (
            <p className="px-3 py-2 text-sm text-slate-400">No options</p>
          )}
          {options.map((o) => (
            <label
              key={o.id}
              className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={value.includes(o.id)}
                onChange={() => toggle(o.id)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-primary-500 focus:ring-primary-300"
              />
              {o.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

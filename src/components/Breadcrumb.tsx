import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items: string[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-sm text-slate-400">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
          <span
            className={
              i === items.length - 1 ? "font-medium text-slate-600" : ""
            }
          >
            {item}
          </span>
        </span>
      ))}
    </div>
  );
}

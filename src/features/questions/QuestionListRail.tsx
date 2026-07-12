import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { isDraftComplete } from "@/features/questions/questionDraft";
import type { DraftQuestion } from "@/types";

interface QuestionListRailProps {
  questions: DraftQuestion[];
  activeLocalId: string | null;
  totalTarget: number;
  onSelect: (localId: string) => void;
  onDelete: (localId: string) => void;
  onAddNew: () => void;
}

export function QuestionListRail({
  questions,
  activeLocalId,
  totalTarget,
  onSelect,
  onDelete,
  onAddNew,
}: QuestionListRailProps) {
  return (
    <div className="flex w-full flex-col gap-3 lg:w-64 lg:shrink-0">
      <div>
        <p className="text-sm font-semibold text-slate-700">Question creation</p>
        <p className="text-xs text-slate-400">
          Total Questions . {totalTarget || questions.length}
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        {questions.map((q, i) => {
          const complete = isDraftComplete(q);
          const active = q.localId === activeLocalId;
          return (
            <div
              key={q.localId}
              onClick={() => onSelect(q.localId)}
              className={cn(
                "group flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors",
                active
                  ? "border-primary-300 bg-primary-50 text-primary-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full",
                    complete ? "bg-success-500 text-white" : "bg-slate-200",
                  )}
                >
                  {complete && <Check className="h-2.5 w-2.5" />}
                </span>
                Question {i + 1}
              </span>
              <Trash2
                className="h-3.5 w-3.5 shrink-0 text-slate-300 opacity-100 hover:text-danger-500 lg:opacity-0 lg:group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(q.localId);
                }}
              />
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={onAddNew}
        className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-500 hover:border-primary-300 hover:text-primary-600"
      >
        + Add question
      </button>
    </div>
  );
}

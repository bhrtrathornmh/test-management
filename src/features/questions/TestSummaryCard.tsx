import { Clock, HelpCircle, Award, BrainCog, Pencil } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { testTypeLabel } from "@/lib/testType";
import type { Test } from "@/types";
import { TestChapterIcon } from "@/components/ChapterIcon";


const DIFFICULTY_TONE = {
  easy: "success",
  medium: "warning",
  hard: "danger",
} as const;

interface TestSummaryCardProps {
  test: Test;
  onEdit?: () => void;
}

export function TestSummaryCard({ test, onEdit }: TestSummaryCardProps) {
  return (
    <Card className="relative p-4 sm:p-5">
      {onEdit && (
        <button
          type="button"
          title="Edit test"
          onClick={onEdit}
          className="absolute right-4 top-4 text-primary-500 hover:text-primary-600"
        >
          <Pencil className="h-4 w-4" />
        </button>
      )}

      <Badge tone="dark" pill className="px-3 py-1">
        {testTypeLabel(test.type)}
      </Badge>

      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <TestChapterIcon  />
        <h2 className="text-base font-semibold text-slate-800">{test.name}</h2>
        <Badge tone={DIFFICULTY_TONE[test.difficulty]} pill className="gap-1 px-2.5 py-1">
          <BrainCog className="h-3 w-3" />
          {test.difficulty}
        </Badge>
      </div>

      <div className="mt-4 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <dl className="flex flex-col gap-2.5 text-sm">
          <div className="flex items-center gap-3">
            <dt className="w-20 shrink-0 text-slate-400">Subject</dt>
            <dd className="text-slate-700">
              : <span className="font-medium">{test.subject}</span>
            </dd>
          </div>
          {test.topics && test.topics.length > 0 && (
            <div className="flex items-center gap-3">
              <dt className="w-20 shrink-0 text-slate-400">Topic</dt>
              <dd className="flex flex-wrap items-center gap-1.5 text-slate-400">
                :
                {test.topics.map((t) => (
                  <Badge key={t} tone="warning" variant="outline" pill>
                    {t}
                  </Badge>
                ))}
              </dd>
            </div>
          )}
          {test.sub_topics && test.sub_topics.length > 0 && (
            <div className="flex items-center gap-3">
              <dt className="w-20 shrink-0 text-slate-400">Sub Topic</dt>
              <dd className="flex flex-wrap items-center gap-1.5 text-slate-400">
                :
                {test.sub_topics.map((t) => (
                  <Badge key={t} tone="warning" variant="outline" pill>
                    {t}
                  </Badge>
                ))}
              </dd>
            </div>
          )}
        </dl>

        <div className="flex w-full flex-wrap items-center divide-x divide-slate-200 rounded-lg border border-slate-200 text-sm text-slate-500 lg:mt-10 lg:w-auto lg:shrink-0">
          <span className="flex items-center gap-1.5 px-3.5 py-2">
            <Clock className="h-4 w-4" /> {test.total_time} Min
          </span>
          <span className="flex items-center gap-1.5 px-3.5 py-2">
            <HelpCircle className="h-4 w-4" /> {test.total_questions} Q's
          </span>
          <span className="flex items-center gap-1.5 px-3.5 py-2">
            <Award className="h-4 w-4" /> {test.total_marks} Marks
          </span>
        </div>
      </div>
    </Card>
  );
}

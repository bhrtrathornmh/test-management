import { CircleCheck, Circle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { CorrectOption, Question } from "@/types";

const OPTION_KEYS: CorrectOption[] = ["option1", "option2", "option3", "option4"];

interface QuestionPreviewCardProps {
  question: Question;
  index: number;
}

export function QuestionPreviewCard({ question, index }: QuestionPreviewCardProps) {
  return (
    <Card className="p-5">
      <p className="mb-2 text-xs font-medium text-slate-400">
        Question {index + 1}
      </p>
      <div
        className="editor-content mb-4 text-sm text-slate-800"
        dangerouslySetInnerHTML={{ __html: question.question }}
      />
      <div className="flex flex-col gap-2">
        {OPTION_KEYS.map((key) => {
          const isCorrect = question.correct_option === key;
          return (
            <div
              key={key}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                isCorrect
                  ? "border-success-500 bg-success-50 text-success-700"
                  : "border-slate-200 text-slate-600",
              )}
            >
              {isCorrect ? (
                <CircleCheck className="h-4 w-4 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 shrink-0 text-slate-300" />
              )}
              {question[key]}
            </div>
          );
        })}
      </div>
      {question.explanation && (
        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
          <span className="font-medium text-slate-700">Explanation: </span>
          {question.explanation}
        </div>
      )}
    </Card>
  );
}

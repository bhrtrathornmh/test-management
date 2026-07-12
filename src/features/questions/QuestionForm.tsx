import { Circle, CircleCheck, X } from "lucide-react";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import type { CorrectOption, DraftQuestion } from "@/types";
import type { MultiSelectOption } from "@/components/ui/MultiSelect";

const OPTION_KEYS: CorrectOption[] = ["option1", "option2", "option3", "option4"];

interface QuestionFormProps {
  draft: DraftQuestion;
  onChange: (next: DraftQuestion) => void;
  errors?: Partial<Record<keyof DraftQuestion, string>>;
  topicOptions: MultiSelectOption[];
  subTopicOptions: MultiSelectOption[];
}

export function QuestionForm({
  draft,
  onChange,
  errors,
  topicOptions,
  subTopicOptions,
}: QuestionFormProps) {
  function set<K extends keyof DraftQuestion>(key: K, value: DraftQuestion[K]) {
    onChange({ ...draft, [key]: value });
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={() =>
          onChange({
            ...draft,
            question: "",
            option1: "",
            option2: "",
            option3: "",
            option4: "",
            explanation: "",
          })
        }
        className="self-start text-xs font-medium text-danger-500 hover:underline"
      >
        Delete All Edits
      </button>

      <div>
        <RichTextEditor
          value={draft.question}
          onChange={(html) => set("question", html)}
          invalid={!!errors?.question}
        />
        {errors?.question && (
          <p className="mt-1 text-xs text-danger-600">{errors.question}</p>
        )}
      </div>

      <Field label="Type the options below" error={errors?.correct_option}>
        <div className="flex flex-col gap-2.5">
          {OPTION_KEYS.map((key, i) => (
            <div key={key} className="flex items-center gap-2.5">
              <button
                type="button"
                title="Mark as correct answer"
                onClick={() => set("correct_option", key)}
                className={cn(
                  "shrink-0",
                  draft.correct_option === key
                    ? "text-primary-500"
                    : "text-slate-300 hover:text-slate-400",
                )}
              >
                {draft.correct_option === key ? (
                  <CircleCheck className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <Input
                placeholder={`Type Option ${i + 1} here`}
                value={draft[key]}
                invalid={!!errors?.[key]}
                onChange={(e) => set(key, e.target.value)}
                className="flex-1"
              />
              <button
                type="button"
                title="Clear option"
                onClick={() => set(key, "")}
                className="shrink-0 text-slate-300 hover:text-danger-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Field>

      <Field label="Add Solution">
        <Textarea
          rows={3}
          placeholder="Type here"
          value={draft.explanation ?? ""}
          onChange={(e) => set("explanation", e.target.value)}
        />
      </Field>

      <div>
        <p className="mb-3 text-sm font-medium text-slate-700">
          Question settings
        </p>
        <div className="grid grid-cols-1 ">
          <Field label="Level of Difficulty">
            <Select
              value={draft.difficulty ?? ""}
              onChange={(e) =>
                set("difficulty", (e.target.value || null) as DraftQuestion["difficulty"])
              }
            >
              <option value="">Select from Drop-down</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Difficult</option>
            </Select>
          </Field>
          <Field label="Topic">
            <Select
              value={draft.topic ?? ""}
              onChange={(e) => set("topic", e.target.value || null)}
            >
              <option value="">Select from Drop-down</option>
              {topicOptions.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Sub-topic">
            <Select
              value={draft.sub_topic ?? ""}
              onChange={(e) => set("sub_topic", e.target.value || null)}
            >
              <option value="">Select from Drop-down</option>
              {subTopicOptions.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>
    </div>
  );
}

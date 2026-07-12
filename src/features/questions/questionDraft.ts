import { z } from "zod";
import type { BulkCreateQuestionInput } from "@/api/questions";
import type { DraftQuestion, Question } from "@/types";

export const questionDraftSchema = z
  .object({
    question: z.string().refine((v) => v.replace(/<[^>]*>/g, "").trim().length > 0, {
      message: "Question text is required",
    }),
    option1: z.string().min(1, "Option 1 is required"),
    option2: z.string().min(1, "Option 2 is required"),
    option3: z.string().min(1, "Option 3 is required"),
    option4: z.string().min(1, "Option 4 is required"),
    correct_option: z.enum(["option1", "option2", "option3", "option4"], {
      error: "Select the correct option",
    }),
    subject: z.string().min(1, "Subject is required"),
  })
  .passthrough();

export function makeBlankDraft(testId: string, subject: string): DraftQuestion {
  return {
    localId: crypto.randomUUID(),
    type: "mcq",
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correct_option: "option1",
    explanation: "",
    difficulty: null,
    subject,
    topic: null,
    sub_topic: null,
    media_url: "test.com",
    test_id: testId,
  };
}

export function isDraftComplete(draft: DraftQuestion): boolean {
  return questionDraftSchema.safeParse(draft).success;
}

// Fetched questions carry extra server-only fields (id, created_by, category,
// paragraph, ...) that the bulk-create endpoint rejects when they're null.
// Pick only the fields a draft needs and normalize nullable strings.
export function toDraftQuestion(question: Question): DraftQuestion {
  return {
    localId: crypto.randomUUID(),
    type: "mcq",
    question: question.question,
    option1: question.option1,
    option2: question.option2,
    option3: question.option3,
    option4: question.option4,
    correct_option: question.correct_option,
    explanation: question.explanation ?? "",
    difficulty: question.difficulty ?? null,
    subject: question.subject,
    topic: question.topic ?? null,
    sub_topic: question.sub_topic ?? null,
    media_url: question.media_url || "",
    test_id: question.test_id,
  };
}

// The API rejects optional string fields when the value is explicitly null
// (e.g. "Difficulty must be a string") — it only accepts a real string or the
// key being absent. Drop any unset optional field instead of sending null.
export function toBulkCreateInput(
  draft: DraftQuestion,
  testId: string,
): BulkCreateQuestionInput {
  const { localId, explanation, difficulty, topic, sub_topic, media_url, ...rest } = draft;
  return {
    ...rest,
    test_id: testId,
    ...(explanation ? { explanation } : {}),
    ...(difficulty ? { difficulty } : {}),
    ...(topic ? { topic } : {}),
    ...(sub_topic ? { sub_topic } : {}),
    ...(media_url ? { media_url } : {}),
  };
}

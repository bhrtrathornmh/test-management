import { z } from "zod";

export const testFormSchema = z.object({
  type: z.enum(["chapterwise", "pyq", "mock"]),
  name: z.string().min(1, "Test name is required"),
  subject: z.string().min(1, "Subject is required"),
  topics: z.array(z.string()).min(1, "Select at least one topic"),
  sub_topics: z.array(z.string()),
  total_time: z.number().positive("Duration must be greater than 0"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  wrong_marks: z.number(),
  unattempt_marks: z.number(),
  correct_marks: z.number(),
  total_questions: z.number().positive("Number of questions is required"),
  total_marks: z.number().positive("Total marks is required"),
  media_url: z.string(),
});

export type TestFormValues = z.infer<typeof testFormSchema>;

export const TEST_FORM_DEFAULTS: TestFormValues = {
  type: "chapterwise",
  name: "",
  subject: "",
  topics: [],
  sub_topics: [],
  total_time: 60,
  difficulty: "easy",
  wrong_marks: -1,
  unattempt_marks: 0,
  correct_marks: 4,
  total_questions: 0,
  total_marks: 0,
  media_url: "test.com",
};

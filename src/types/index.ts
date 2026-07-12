export interface ApiEnvelope<T> {
  status?: string;
  success?: boolean;
  message?: string;
  data: T;
}

export interface User {
  id: string;
  userId: string;
  name: string;
  role: string;
  subrole?: string | null;
}

export interface Subject {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
}

export type TestType = "chapterwise" | "pyq" | "mock";
export type Difficulty = "easy" | "medium" | "hard";
export type TestStatus =
  | "draft"
  | "scheduled"
  | "live"
  | "unpublished"
  | "expired"
  | null;

export interface Test {
  id: string;
  name: string;
  type: TestType;
  subject: string;
  topics: string[] | null;
  sub_topics: string[] | null;
  questions: string[] | null;
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  difficulty: Difficulty;
  total_marks: number;
  total_time: number;
  total_questions: number;
  status: TestStatus;
  created_by: number;
  created_at: string;
  updated_at: string | null;
  scheduled_date: string | null;
  expiry_date: string | null;
}

export type CorrectOption = "option1" | "option2" | "option3" | "option4";

export interface Question {
  id: string;
  type: "mcq";
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: CorrectOption;
  explanation?: string | null;
  difficulty?: Difficulty | null;
  subject: string;
  topic?: string | null;
  sub_topic?: string | null;
  media_url?: string;
  test_id?: string;
}

export type DraftQuestion = Omit<Question, "id"> & { localId: string };

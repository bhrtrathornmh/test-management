import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Download, Plus } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageLoader, Spinner } from "@/components/ui/Spinner";
import { useTest, useUpdateTest } from "@/hooks/useTests";
import { useBulkCreateQuestions, useQuestionsBulk } from "@/hooks/useQuestions";
import { extractErrorMessage } from "@/api/client";
import { TestSummaryCard } from "@/features/questions/TestSummaryCard";
import { QuestionListRail } from "@/features/questions/QuestionListRail";
import { QuestionForm } from "@/features/questions/QuestionForm";
import {
  makeBlankDraft,
  questionDraftSchema,
  toBulkCreateInput,
  toDraftQuestion,
} from "@/features/questions/questionDraft";
import type { DraftQuestion } from "@/types";

export function AddQuestionsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: test, isLoading: loadingTest } = useTest(id);
  const { data: existingQuestions } = useQuestionsBulk(test?.questions ?? []);
  const updateTest = useUpdateTest(id);
  const bulkCreate = useBulkCreateQuestions();

  const [questions, setQuestions] = useState<DraftQuestion[]>([]);
  const [activeLocalId, setActiveLocalId] = useState<string | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const seeded = useRef(false);

  useEffect(() => {
    if (seeded.current || !test) return;
    if (existingQuestions && existingQuestions.length > 0) {
      const drafts = existingQuestions.map(toDraftQuestion);
      setQuestions(drafts);
      setActiveLocalId(drafts[0].localId);
      seeded.current = true;
    } else if (test.questions === null || test.questions?.length === 0) {
      const blank = makeBlankDraft(test.id, test.subject);
      setQuestions([blank]);
      setActiveLocalId(blank.localId);
      seeded.current = true;
    }
  }, [test, existingQuestions]);

  const activeIndex = questions.findIndex((q) => q.localId === activeLocalId);
  const activeDraft = activeIndex >= 0 ? questions[activeIndex] : null;

  function updateDraft(next: DraftQuestion) {
    setQuestions((qs) => qs.map((q) => (q.localId === next.localId ? next : q)));
    setErrors({});
  }

  function selectQuestion(localId: string) {
    setActiveLocalId(localId);
    setErrors({});
  }

  function addNewQuestion() {
    if (!test) return;
    const blank = makeBlankDraft(test.id, test.subject);
    setQuestions((qs) => [...qs, blank]);
    setActiveLocalId(blank.localId);
    setErrors({});
  }

  function deleteQuestion(localId: string) {
    setQuestions((qs) => {
      const next = qs.filter((q) => q.localId !== localId);
      if (localId === activeLocalId) {
        setActiveLocalId(next.length > 0 ? next[0].localId : null);
      }
      return next;
    });
    setErrors({});
  }

  async function handleSaveAndContinue() {
    if (!test) return;

    if (questions.length === 0) {
      toast.error("Add at least 1 question before continuing");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const result = questionDraftSchema.safeParse(questions[i]);
      if (!result.success) {
        setActiveLocalId(questions[i].localId);
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          fieldErrors[String(issue.path[0])] = issue.message;
        }
        setErrors(fieldErrors);
        toast.error(`Question ${i + 1} is incomplete`);
        return;
      }
    }

    try {
      const payload = questions.map((q) => toBulkCreateInput(q, test.id));
      const created = await bulkCreate.mutateAsync(payload);
      const questionIds = created.map((q) => q.id);
      await updateTest.mutateAsync({
        questions: questionIds,
        total_questions: questionIds.length,
        total_marks: questionIds.length * test.correct_marks,
      });
      toast.success("Questions saved");
      navigate(`/tests/${test.id}/preview`);
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to save questions"));
    }
  }

  if (loadingTest || !test) {
    return <PageLoader label="Loading..." />;
  }

  const topicOptions = (test.topics ?? []).map((t) => ({ id: t, name: t }));
  const subTopicOptions = (test.sub_topics ?? []).map((t) => ({ id: t, name: t }));
  const saving = bulkCreate.isPending || updateTest.isPending;

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumb items={["Test Creation", "Create Test", "Chapter Wise"]} />

      <TestSummaryCard test={test} onEdit={() => navigate(`/tests/${test.id}/edit`)} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <QuestionListRail
          questions={questions}
          activeLocalId={activeLocalId}
          totalTarget={test.total_questions}
          onSelect={selectQuestion}
          onDelete={deleteQuestion}
          onAddNew={addNewQuestion}
        />

        <Card className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Question {activeIndex + 1}
              <span className="text-slate-300">/{test.total_questions || questions.length}</span>
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={addNewQuestion}>
                <Plus className="h-4 w-4" />
                MCQ
              </Button>
              <Button
                size="sm"
                variant="secondary"
                disabled
                title="Bulk CSV upload — coming soon"
              >
                <Download className="h-4 w-4" />
                CSV
              </Button>
            </div>
          </div>

          {activeDraft ? (
            <QuestionForm
              draft={activeDraft}
              onChange={updateDraft}
              errors={errors}
              topicOptions={topicOptions}
              subTopicOptions={subTopicOptions}
            />
          ) : (
            <p className="py-10 text-center text-sm text-slate-400">
              No questions yet — click "+ MCQ" to add one.
            </p>
          )}
        </Card>
      </div>

      <div className="flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-5">
        <Button variant="danger" onClick={() => setShowExitConfirm(true)}>
          Exit Test Creation
        </Button>
        <Button onClick={handleSaveAndContinue} disabled={saving}>
          {saving && <Spinner className="text-white" />}
          {saving ? "Saving…" : "Save & Continue"}
        </Button>
      </div>

      <ConfirmDialog
        open={showExitConfirm}
        title="Exit test creation"
        description="Unsaved changes to questions on this page will be lost. The test remains saved as a draft."
        confirmLabel="Exit"
        danger
        onConfirm={() => navigate("/dashboard")}
        onCancel={() => setShowExitConfirm(false)}
      />
    </div>
  );
}

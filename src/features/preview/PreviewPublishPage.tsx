import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { PencilLine, ListChecks } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { PageLoader, Spinner } from "@/components/ui/Spinner";
import { useTest, useUpdateTest } from "@/hooks/useTests";
import { useQuestionsBulk } from "@/hooks/useQuestions";
import { extractErrorMessage } from "@/api/client";
import { TestSummaryCard } from "@/features/questions/TestSummaryCard";
import { QuestionPreviewCard } from "@/features/preview/QuestionPreviewCard";
import {
  LIVE_UNTIL_OPTIONS,
  computeExpiryDate,
  type LiveUntilOption,
} from "@/features/preview/publishOptions";

export function PreviewPublishPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: test, isLoading: loadingTest } = useTest(id);
  const { data: questions = [], isLoading: loadingQuestions } = useQuestionsBulk(
    test?.questions ?? [],
  );
  const updateTest = useUpdateTest(id);

  const [publishMode, setPublishMode] = useState<"now" | "schedule">("now");
  const [liveUntil, setLiveUntil] = useState<LiveUntilOption>("always");
  const [customDate, setCustomDate] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  if (loadingTest || !test) {
    return <PageLoader label="Loading..." />;
  }

  async function handlePublish() {
    if (!test) return;
    if (publishMode === "schedule" && !scheduleDate) {
      toast.error("Pick a date and time to schedule this test");
      return;
    }
    if (liveUntil === "custom" && !customDate) {
      toast.error("Pick a custom end date for 'Live Until'");
      return;
    }

    const expiryDate = computeExpiryDate(liveUntil, customDate, customTime);
    const scheduledDate =
      publishMode === "schedule" && scheduleDate
        ? new Date(`${scheduleDate}T${scheduleTime || "00:00"}:00`).toISOString()
        : null;

    // The API rejects expiry_date/scheduled_date: null with a validation error —
    // it only accepts a valid ISO string or the key being absent entirely.
    try {
      await updateTest.mutateAsync({
        status: publishMode === "schedule" ? "scheduled" : "live",
        ...(expiryDate ? { expiry_date: expiryDate } : {}),
        ...(scheduledDate ? { scheduled_date: scheduledDate } : {}),
      });
      toast.success(
        publishMode === "schedule" ? "Test scheduled" : "Test published",
      );
      navigate("/dashboard");
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to publish test"));
    }
  }

  const allQuestionsDone =
    questions.length > 0 && questions.length >= test.total_questions;

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumb items={["Test Creation", "Create Test", "Preview & Publish"]} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Badge tone={allQuestionsDone ? "success" : "warning"}>
          {allQuestionsDone
            ? `All ${questions.length} Questions done`
            : `${questions.length}/${test.total_questions} Questions done`}
        </Badge>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/tests/${test.id}/edit`)}
          >
            <PencilLine className="h-4 w-4" />
            Edit Test
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => navigate(`/tests/${test.id}/questions`)}
          >
            <ListChecks className="h-4 w-4" />
            Edit Questions
          </Button>
        </div>
      </div>

      <TestSummaryCard test={test} onEdit={() => navigate(`/tests/${test.id}/edit`)} />

      {loadingQuestions ? (
        <PageLoader label="Loading questions…" />
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map((q, i) => (
            <QuestionPreviewCard key={q.id} question={q} index={i} />
          ))}
        </div>
      )}

      <Card className="p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap gap-1 border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={() => setPublishMode("now")}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
              publishMode === "now"
                ? "bg-primary-50 text-primary-600"
                : "text-slate-400 hover:bg-slate-50"
            }`}
          >
            Publish Now
          </button>
          <button
            type="button"
            onClick={() => setPublishMode("schedule")}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
              publishMode === "schedule"
                ? "bg-primary-50 text-primary-600"
                : "text-slate-400 hover:bg-slate-50"
            }`}
          >
            Schedule Publish
          </button>
        </div>

        {publishMode === "schedule" && (
          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Select Date">
              <Input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
            </Field>
            <Field label="Select Time">
              <Input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </Field>
          </div>
        )}

        <p className="mb-1 text-sm font-medium text-slate-700">Live Until</p>
        <p className="mb-3 text-xs text-slate-400">
          Choose how long this test should remain available on the platform.
        </p>
        <RadioGroup
          name="liveUntil"
          value={liveUntil}
          onChange={(v) => setLiveUntil(v as LiveUntilOption)}
          options={LIVE_UNTIL_OPTIONS}
          className="grid grid-cols-2 gap-3 md:grid-cols-3"
        />

        {liveUntil === "custom" && (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Select End Date">
              <Input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
            </Field>
            <Field label="Select End Time">
              <Input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
              />
            </Field>
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
          <Button onClick={handlePublish} disabled={updateTest.isPending}>
            {updateTest.isPending && <Spinner className="text-white" />}
            {updateTest.isPending ? "Publishing…" : "Confirm"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

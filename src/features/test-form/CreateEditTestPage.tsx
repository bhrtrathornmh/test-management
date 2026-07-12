import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { MultiSelect } from "@/components/ui/MultiSelect";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { Button } from "@/components/ui/Button";
import { PageLoader, Spinner } from "@/components/ui/Spinner";
import { useSubjects } from "@/hooks/useSubjects";
import { useSubTopicsByTopics, useTopicsBySubject } from "@/hooks/useTopics";
import { useCreateTest, useTest, useUpdateTest } from "@/hooks/useTests";
import { extractErrorMessage } from "@/api/client";
import {
  TEST_FORM_DEFAULTS,
  testFormSchema,
  type TestFormValues,
} from "@/features/test-form/testSchema";
import type { TestType } from "@/types";

const TYPE_TABS: { value: TestType; label: string }[] = [
  { value: "chapterwise", label: "Chapterwise" },
  { value: "pyq", label: "PYQ" },
  { value: "mock", label: "Mock Test" },
];

export function CreateEditTestPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const { data: existingTest, isLoading: loadingTest } = useTest(id);
  const { data: subjects = [], isLoading: loadingSubjects } = useSubjects();
  const createTest = useCreateTest();
  const updateTest = useUpdateTest(id);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TestFormValues>({
    resolver: zodResolver(testFormSchema),
    defaultValues: TEST_FORM_DEFAULTS,
  });

  const subjectId = watch("subject");
  const topicIds = watch("topics");
  const testType = watch("type");

  const { data: topics = [], isLoading: loadingTopics } =
    useTopicsBySubject(subjectId || null);
  const { data: subTopics = [], isLoading: loadingSubTopics } =
    useSubTopicsByTopics(topicIds);

  // Pre-fill form in edit mode once the test + subjects + topics are available.
  useEffect(() => {
    if (!existingTest || subjects.length === 0) return;
    const matchedSubject = subjects.find((s) => s.name === existingTest.subject);
    reset({
      type: existingTest.type,
      name: existingTest.name,
      subject: matchedSubject?.id ?? "",
      topics: [],
      sub_topics: [],
      total_time: existingTest.total_time,
      difficulty: existingTest.difficulty,
      wrong_marks: existingTest.wrong_marks,
      unattempt_marks: existingTest.unattempt_marks,
      correct_marks: existingTest.correct_marks,
      total_questions: existingTest.total_questions,
      total_marks: existingTest.total_marks,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingTest, subjects]);

  // Once topics for the resolved subject load, resolve topic name -> id from the existing test.
  useEffect(() => {
    if (!existingTest || topics.length === 0) return;
    if (watch("topics").length > 0) return;
    const names = existingTest.topics ?? [];
    const ids = topics.filter((t) => names.includes(t.name)).map((t) => t.id);
    if (ids.length > 0) setValue("topics", ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingTest, topics]);

  useEffect(() => {
    if (!existingTest || subTopics.length === 0) return;
    if (watch("sub_topics").length > 0) return;
    const names = existingTest.sub_topics ?? [];
    const ids = subTopics.filter((st) => names.includes(st.name)).map((st) => st.id);
    if (ids.length > 0) setValue("sub_topics", ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingTest, subTopics]);

  const subjectOptions = useMemo(
    () => subjects.map((s) => ({ value: s.id, label: s.name })),
    [subjects],
  );

  function handleSubjectChange(newSubjectId: string) {
    setValue("subject", newSubjectId);
    setValue("topics", []);
    setValue("sub_topics", []);
  }

  function handleTopicsChange(newTopicIds: string[]) {
    setValue("topics", newTopicIds);
    setValue("sub_topics", []);
  }

  async function onSubmit(values: TestFormValues) {
    try {
      if (isEdit && id) {
        await updateTest.mutateAsync(values);
        toast.success("Test updated");
        navigate("/dashboard");
      } else {
        const created = await createTest.mutateAsync(values);
        toast.success("Test created — now add some questions");
        navigate(`/tests/${created.id}/questions`);
      }
    } catch (error) {
      toast.error(extractErrorMessage(error, "Failed to save test"));
    }
  }

  const saving = createTest.isPending || updateTest.isPending;

  if (isEdit && loadingTest) {
    return <PageLoader label="Loading..." />;
  }

  return (
    <div className="flex flex-col gap-5">
      <Breadcrumb
        items={["Test Creation", isEdit ? "Edit Test" : "Create Test", TYPE_TABS.find((t) => t.value === testType)?.label ?? ""]}
      />

      <Card className="p-4 sm:p-6">
        <div className="mb-6 flex flex-wrap gap-1 border-b border-slate-100 pb-3">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setValue("type", tab.value)}
              className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                testType === tab.value
                  ? "bg-primary-50 text-primary-600"
                  : "text-slate-400 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
            <Field label="Subject" required error={errors.subject?.message}>
              <Select
                value={subjectId}
                disabled={loadingSubjects}
                invalid={!!errors.subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
              >
                <option value="">Choose from Drop-down</option>
                {subjectOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Name of Test" htmlFor="name" required error={errors.name?.message}>
              <Input
                id="name"
                placeholder="Enter name of Test"
                invalid={!!errors.name}
                {...register("name")}
              />
            </Field>

            <Field label="Topic" required error={errors.topics?.message}>
              <Controller
                control={control}
                name="topics"
                render={({ field }) => (
                  <MultiSelect
                    options={topics.map((t) => ({ id: t.id, name: t.name }))}
                    value={field.value}
                    onChange={handleTopicsChange}
                    disabled={!subjectId || loadingTopics}
                    invalid={!!errors.topics}
                  />
                )}
              />
            </Field>

            <Field label="Sub Topic">
              <Controller
                control={control}
                name="sub_topics"
                render={({ field }) => (
                  <MultiSelect
                    options={subTopics.map((st) => ({ id: st.id, name: st.name }))}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={topicIds.length === 0 || loadingSubTopics}
                  />
                )}
              />
            </Field>

            <Field label="Duration (Minutes)" htmlFor="total_time" required error={errors.total_time?.message}>
              <Input
                id="total_time"
                type="number"
                placeholder="Enter the time"
                invalid={!!errors.total_time}
                {...register("total_time", { valueAsNumber: true })}
              />
            </Field>

            <Field label="Test Difficulty Level" required>
              <Controller
                control={control}
                name="difficulty"
                render={({ field }) => (
                  <RadioGroup
                    name="difficulty"
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: "easy", label: "Easy" },
                      { value: "medium", label: "Medium" },
                      { value: "hard", label: "Difficult" },
                    ]}
                    className="flex h-10 items-center gap-5"
                  />
                )}
              />
            </Field>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-slate-700">
              Marking Scheme:
            </p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-5">
              <Field label="Wrong Answer">
                <Controller
                  control={control}
                  name="wrong_marks"
                  render={({ field }) => (
                    <NumberStepper value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
              <Field label="Unattempted">
                <Controller
                  control={control}
                  name="unattempt_marks"
                  render={({ field }) => (
                    <NumberStepper value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
              <Field label="Correct Answer">
                <Controller
                  control={control}
                  name="correct_marks"
                  render={({ field }) => (
                    <NumberStepper value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
              <Field label="No of Questions" error={errors.total_questions?.message}>
                <Input
                  type="number"
                  placeholder="Ex: 50"
                  invalid={!!errors.total_questions}
                  {...register("total_questions", { valueAsNumber: true })}
                />
              </Field>
              <Field label="Total Marks" error={errors.total_marks?.message}>
                <Input
                  type="number"
                  placeholder="Ex: 250 Marks"
                  invalid={!!errors.total_marks}
                  {...register("total_marks", { valueAsNumber: true })}
                />
              </Field>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving && <Spinner className="text-white" />}
              {saving ? "Saving…" : isEdit ? "Save" : "Next"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

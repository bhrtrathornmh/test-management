import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Search, Eye, PencilLine, Trash2, ListChecks } from "lucide-react";
import { useDeleteTest, useTests } from "@/hooks/useTests";
import { extractErrorMessage } from "@/api/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PageLoader } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";
import { statusLabel, statusTone } from "@/lib/testStatus";
import type { Test, TestStatus } from "@/types";

const PAGE_SIZE = 10;

const STATUS_TABS: { label: string; value: TestStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Live", value: "live" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Expired", value: "expired" },
];

export function DashboardPage() {
  const { data: tests, isLoading, isError, error, refetch } = useTests();
  const deleteTest = useDeleteTest();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TestStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Test | null>(null);

  const filtered = useMemo(() => {
    if (!tests) return [];
    const q = search.trim().toLowerCase();
    return [...tests]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .filter((t) => {
        const matchesStatus =
          statusFilter === "all"
            ? true
            : statusFilter === "draft"
              ? !t.status || t.status === "draft"
              : t.status === statusFilter;
        const matchesSearch =
          q.length === 0 ||
          t.name.toLowerCase().includes(q) ||
          t.subject?.toLowerCase().includes(q);
        return matchesStatus && matchesSearch;
      });
  }, [tests, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateStatusFilter(value: TestStatus | "all") {
    setStatusFilter(value);
    setPage(1);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteTest.mutateAsync(pendingDelete.id);
      toast.success("Test deleted");
      setPendingDelete(null);
    } catch (err) {
      toast.error(
        extractErrorMessage(
          err,
          "Delete isn't supported by the server for this test",
        ),
      );
      setPendingDelete(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Tests</h1>
          <p className="text-sm text-slate-400">
            Manage and track all tests created on the platform
          </p>
        </div>
        <Link to="/tests/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Create New Test
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => updateStatusFilter(tab.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  statusFilter === tab.value
                    ? "bg-primary-50 text-primary-600"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name or subject"
              className="pl-9"
              value={search}
              onChange={(e) => updateSearch(e.target.value)}
            />
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {isLoading && <PageLoader label="Loading..." />}
        {isError && (
          <div className="p-8 text-center text-sm text-danger-600">
            {extractErrorMessage(error, "Failed to load tests")}
            <button
              onClick={() => refetch()}
              className="ml-2 font-medium text-primary-500 hover:underline"
            >
              Retry
            </button>
          </div>
        )}
        {!isLoading && !isError && filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-400">
            No tests found. Try creating one.
          </p>
        )}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Subject</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Questions</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pageItems.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-25">
                    <td className="px-5 py-3 font-medium text-slate-800">
                      {test.name}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{test.subject}</td>
                    <td className="px-5 py-3 capitalize text-slate-500">
                      {test.type}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {test.questions?.length ?? 0} / {test.total_questions ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={statusTone(test.status)}>
                        {statusLabel(test.status)}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {formatDate(test.created_at)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/tests/${test.id}/preview`}
                          title="View"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/tests/${test.id}/questions`}
                          title="Manage questions"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                          <ListChecks className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/tests/${test.id}/edit`}
                          title="Edit"
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                          <PencilLine className="h-4 w-4" />
                        </Link>
                        <button
                          title="Delete"
                          onClick={() => setPendingDelete(test)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-danger-50 hover:text-danger-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </Card>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete test"
        description={`Are you sure you want to delete "${pendingDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleteTest.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

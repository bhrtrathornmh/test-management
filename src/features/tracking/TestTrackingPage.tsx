import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageLoader } from "@/components/ui/Spinner";
import { useTests } from "@/hooks/useTests";
import { extractErrorMessage } from "@/api/client";
import { formatDate, formatDateTime } from "@/lib/utils";
import { statusLabel, statusTone } from "@/lib/testStatus";

export function TestTrackingPage() {
  const { data: tests, isLoading, isError, error } = useTests();

  const liveOrScheduled = useMemo(() => {
    if (!tests) return [];
    return tests
      .filter((t) => t.status === "live" || t.status === "scheduled")
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  }, [tests]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">Test Tracking</h1>
        <p className="text-sm text-slate-400">
          Tests that are currently live or scheduled to go live
        </p>
      </div>

      <Card className="overflow-hidden">
        {isLoading && <PageLoader />}
        {isError && (
          <p className="p-8 text-center text-sm text-danger-600">
            {extractErrorMessage(error, "Failed to load tests")}
          </p>
        )}
        {!isLoading && !isError && liveOrScheduled.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-400">
            No live or scheduled tests yet.
          </p>
        )}
        {!isLoading && !isError && liveOrScheduled.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Subject</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Scheduled</th>
                  <th className="px-5 py-3 font-medium">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {liveOrScheduled.map((test) => (
                  <tr key={test.id}>
                    <td className="px-5 py-3 font-medium text-slate-800">
                      <Link
                        to={`/tests/${test.id}/preview`}
                        className="hover:text-primary-600 hover:underline"
                      >
                        {test.name}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{test.subject}</td>
                    <td className="px-5 py-3">
                      <Badge tone={statusTone(test.status)}>
                        {statusLabel(test.status)}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {formatDateTime(test.scheduled_date)}
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      {formatDate(test.expiry_date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

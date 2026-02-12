import Link from "next/link";
import { fetchImportLogs, ImportLog } from "./lib/api";

export default async function HomePage() {
  let logs: ImportLog[] = [];

  try {
    const data = await fetchImportLogs({
      page: 1,
      limit: 10,
    });

    logs = data.data ?? [];
  } catch (error) {
    console.error("Error fetching import logs:", error);
  }

  // Sort latest first (extra safety)
  const sortedLogs = [...logs].sort(
    (a, b) =>
      new Date(b.startedAt).getTime() -
      new Date(a.startedAt).getTime()
  );

  const latest = sortedLogs[0];

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">
          📊 System Overview
        </h2>

        <p className="text-gray-600">
          This admin panel monitors automated job imports,
          worker processing, and database synchronization.
        </p>

        <div className="mt-4">
          <Link
            href="/import-logs"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            View Import History
          </Link>
        </div>
      </div>

      {/* Latest Import Section */}
      {latest ? (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              🚀 Latest Import
            </h2>

            <StatusBadge finishedAt={latest.finishedAt} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Fetched" value={latest.totalFetched} />
            <StatCard label="New Jobs" value={latest.newJobs} />
            <StatCard label="Updated Jobs" value={latest.updatedJobs} />
            <StatCard label="Failed Jobs" value={latest.failedJobs} />
          </div>

          <div className="mt-4 text-sm text-gray-500 space-y-1">
            <div>
              <strong>Source:</strong> {latest.source}
            </div>
            <div>
              <strong>Started:</strong>{" "}
              {new Date(latest.startedAt).toLocaleString()}
            </div>
            {latest.finishedAt && (
              <div>
                <strong>Finished:</strong>{" "}
                {new Date(latest.finishedAt).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6 text-gray-500">
          No import logs found.
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function StatusBadge({
  finishedAt,
}: {
  finishedAt?: string;
}) {
  if (!finishedAt) {
    return (
      <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
        Running
      </span>
    );
  }

  return (
    <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
      Completed
    </span>
  );
}

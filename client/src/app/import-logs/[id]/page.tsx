import { fetchImportById } from "@/app/lib/api";
import Link from "next/link";

interface ImportFailure {
    error: string;
    payload: unknown;
}

interface ImportLog {
    id: string;
    source: string;
    startedAt: string;
    finishedAt?: string | null;
    totalFetched: number;
    newJobs: number;
    updatedJobs: number;
    failedJobs: number;
    failures?: ImportFailure[];
}

interface Props {
    params: {
        id: string;
    };
}

export default async function ImportDetailsPage({ params }: Props) {
    const importLog = (await fetchImportById(
        params.id
    )) as ImportLog;

    const duration =
        importLog.finishedAt && importLog.startedAt
            ? Math.round(
                (new Date(importLog.finishedAt).getTime() -
                    new Date(importLog.startedAt).getTime()) /
                1000
            )
            : null;

    return (
        <div className="space-y-8">
            <Link
                href="/import-logs"
                className="text-blue-600 underline"
            >
                ← Back to Import Logs
            </Link>

            <div className="bg-black rounded-xl shadow p-6">
                <h2 className="text-2xl font-semibold mb-4">
                    Import Overview
                </h2>

                <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <DetailItem label="Source" value={importLog.source} />
                    <DetailItem
                        label="Status"
                        value={importLog.finishedAt ? "Completed" : "Running"}
                    />
                    <DetailItem
                        label="Started At"
                        value={new Date(importLog.startedAt).toLocaleString()}
                    />
                    <DetailItem
                        label="Finished At"
                        value={
                            importLog.finishedAt
                                ? new Date(importLog.finishedAt).toLocaleString()
                                : "Still Running"
                        }
                    />
                    {duration !== null && (
                        <DetailItem
                            label="Duration"
                            value={`${duration} seconds`}
                        />
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Statistics
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Total Fetched" value={importLog.totalFetched} />
                    <StatCard label="New Jobs" value={importLog.newJobs} />
                    <StatCard label="Updated Jobs" value={importLog.updatedJobs} />
                    <StatCard label="Failed Jobs" value={importLog.failedJobs} />
                </div>
            </div>

            {importLog.failures && importLog.failures.length > 0 && (
                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4 text-red-600">
                        Failed Records ({importLog.failures.length})
                    </h2>

                    <div className="space-y-4">
                        {importLog.failures.map((failure, index) => (
                            <div
                                key={index}
                                className="border rounded-lg p-4 bg-red-50"
                            >
                                <div className="text-sm font-semibold text-red-700">
                                    Error:
                                </div>
                                <div className="text-sm mb-2">
                                    {failure.error}
                                </div>

                                <details className="text-sm">
                                    <summary className="cursor-pointer text-blue-600">
                                        View Payload
                                    </summary>
                                    <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto text-xs">
                                        {JSON.stringify(failure.payload, null, 2)}
                                    </pre>
                                </details>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <div className="text-gray-500">{label}</div>
            <div className="font-medium">{value}</div>
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

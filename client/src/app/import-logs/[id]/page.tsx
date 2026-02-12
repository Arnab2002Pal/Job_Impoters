import { fetchImportById } from "@/app/lib/api";
import Link from "next/link";
import { Clock, AlertCircle, ArrowLeft, FileJson, Globe } from "lucide-react";

interface ImportFailure {
    reason: string;
    externalId: string;
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
    params: { id: string };
}

export default async function ImportDetailsPage({ params }: Props) {
    const importLog = (await fetchImportById(params.id)) as ImportLog;
    const isCompleted = !!importLog.finishedAt;

    const duration = isCompleted
        ? Math.round((new Date(importLog.finishedAt!).getTime() - new Date(importLog.startedAt).getTime()) / 1000)
        : null;

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
            <Link
                href="/import-logs"
                className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Import Logs
            </Link>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Import Overview</h2>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isCompleted ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700 animate-pulse"
                        }`}>
                        {isCompleted ? "Completed" : "Running"}
                    </span>
                </div>

                <div className="p-6 space-y-6">
                    <div className="pb-6 border-b border-slate-100">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Source URL</div>
                        <div className="flex items-center gap-2 text-blue-600 font-medium break-all">
                            <Globe className="w-4 h-4 flex-shrink-0 text-slate-400" />
                            {importLog.source}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <DetailItem
                            label="Started"
                            value={new Date(importLog.startedAt).toLocaleString()}
                        />
                        <DetailItem
                            label="Finished"
                            value={importLog.finishedAt ? new Date(importLog.finishedAt).toLocaleString() : "—"}
                        />
                        <DetailItem
                            label="Duration"
                            value={duration !== null ? `${duration} seconds` : "In progress..."}
                            icon={<Clock className="w-4 h-4 text-slate-400" />}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Fetched" value={importLog.totalFetched} color="text-slate-700" />
                <StatCard label="New Jobs" value={importLog.newJobs} color="text-green-600" />
                <StatCard label="Updated" value={importLog.updatedJobs} color="text-blue-600" />
                <StatCard label="Failed" value={importLog.failedJobs} color="text-red-600" />
            </div>

            {importLog.failures && importLog.failures.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <h2 className="text-lg font-bold text-slate-800">
                            Failure Logs ({importLog.failures.length})
                        </h2>
                    </div>

                    <div className="grid gap-3">
                        {importLog.failures.map((failure, index) => (
                            <div key={index} className="group border border-red-100 rounded-lg bg-white overflow-hidden shadow-sm hover:border-red-200 transition-all">
                                <div className="bg-red-50/30 px-4 py-3 border-b border-red-50">
                                    <p className="text-sm font-mono text-red-700 font-semibold whitespace-pre-line">
                                        {failure.reason}
                                    </p>
                                </div>
                                <details className="group/details">
                                    <summary className="flex items-center justify-between px-4 py-2 text-xs font-medium text-slate-500 cursor-pointer hover:bg-slate-50 list-none">
                                        <span className="flex items-center gap-2">
                                            <FileJson className="w-3.5 h-3.5" /> ID: {failure.externalId}
                                        </span>
                                        <span className="text-[10px] text-slate-400 group-open/details:rotate-180 transition-transform italic">
                                            Click to toggle details
                                        </span>
                                    </summary>
                                    <div className="p-4 bg-slate-900 overflow-x-auto">
                                        <pre className="text-[11px] leading-relaxed text-red-400 font-mono">
                                            {JSON.stringify(failure, null, 2)}
                                        </pre>
                                    </div>
                                </details>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}


// Helper
function DetailItem({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                {icon}
                {value}
            </div>
        </div>
    );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col items-center justify-center space-y-1">
            <div className={`text-3xl font-extrabold tracking-tight ${color}`}>{value.toLocaleString()}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</div>
        </div>
    );
}

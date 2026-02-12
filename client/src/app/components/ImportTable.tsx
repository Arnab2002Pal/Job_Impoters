"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";
import Pagination from "./Pagination";
import { ImportLog, PaginationMeta } from "../lib/api";

interface Props {
    logs: ImportLog[];
    pagination: PaginationMeta;
}

export default function ImportTable({ logs, pagination }: Props) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Source
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Started
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">
                                Total
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">
                                New
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">
                                Updated
                            </th>
                            <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-center">
                                Failed
                            </th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-right">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {logs.length > 0 ? (
                            logs.map((log) => (
                                <tr
                                    key={log._id}
                                    className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                        <Link
                                            href={`/import-logs/${log._id}`}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                        >
                                            {log.source}
                                        </Link>
                                    </td>

                                    <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                        {new Date(log.startedAt).toLocaleDateString()}
                                        <span className="block text-xs opacity-60">
                                            {new Date(log.startedAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4 text-sm text-center text-white font-mono">
                                        {log.totalFetched ?? 0}
                                    </td>

                                    <td className="px-4 py-4 text-sm text-center font-mono text-green-600 dark:text-green-400">
                                        {log.newJobs ?? 0}
                                    </td>

                                    <td className="px-4 py-4 text-sm text-center font-mono text-white">
                                        {log.updatedJobs ?? 0}
                                    </td>

                                    <td
                                        className={`px-4 py-4 text-sm text-center font-mono ${(log.failedJobs ?? 0) > 0
                                                ? "text-red-500 font-bold"
                                                : "text-gray-400"
                                            }`}
                                    >
                                        {log.failedJobs ?? 0}
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <StatusBadge finishedAt={log.finishedAt} />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                >
                                    No import logs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-800/20">
                <Pagination pagination={pagination} />
            </div>
        </div>
    );
}

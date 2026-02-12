"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
    pagination: {
        page: number;
        totalPages: number;
    };
}

export default function Pagination({ pagination }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const goToPage = (page: number) => {
        if (page < 1 || page > pagination.totalPages) return;

        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex justify-between items-center mt-6">
            <button
                disabled={pagination.page <= 1}
                onClick={() => goToPage(pagination.page - 1)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
            >
                Previous
            </button>

            <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {pagination.page} of {pagination.totalPages || 1}
            </span>

            <button
                disabled={
                    pagination.page >= pagination.totalPages ||
                    pagination.totalPages === 0
                }
                onClick={() => goToPage(pagination.page + 1)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:text-gray-400"
            >
                Next
            </button>
        </div>
    );
}

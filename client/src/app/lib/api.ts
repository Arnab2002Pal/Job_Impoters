export interface ImportFailure {
    _id: string;
    reason: string;
    externalId: string;
}

export interface ImportLog {
    _id: string;
    source: string;
    startedAt: string;
    totalFetched: number;
    newJobs: number;
    updatedJobs: number;
    failedJobs: number;
    failures: ImportFailure[];
    createdAt: string;
    updatedAt: string;
    finishedAt?: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface FetchParams {
    page?: number;
    limit?: number;
    source?: string;
}


export async function fetchImportLogs({
    page = 1,
    limit = 10,
    source,
}: FetchParams) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (source) params.set("source", source);

    const res = await fetch(
        `${API_URL}/import-logs?${params.toString()}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch import logs");
    }

    return res.json();
}

export async function fetchImportById(id: string) {
    const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

    const res = await fetch(
        `${API_URL}/import-logs/${id}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch import log");
    }

    return res.json();
}

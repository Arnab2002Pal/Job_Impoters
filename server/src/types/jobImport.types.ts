export interface JobImportPayload {
    importLogId: string;
    source: string;
    jobs: NormalizedJob[];
}

export interface NormalizedJob {
    externalId: string;
    title: string;
    company: string;
    location: string;
    source: string;
    url?: string;
}

export interface ImportLogQuery {
    page?: number;
    limit?: number;
    source?: string;
}

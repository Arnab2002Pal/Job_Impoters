import ImportTable from "../components/ImportTable";
import { fetchImportLogs } from "../lib/api";

interface Props {
    searchParams?: {
        page?: string;
        limit?: string;
        source?: string;
    };
}

export default async function ImportLogsPage({ searchParams }: Props) {
    const page = Number(searchParams?.page) || 1;
    const limit = Number(searchParams?.limit) || 3;

    const data = await fetchImportLogs({
        page,
        limit,
        source: searchParams?.source,
    });

    const logs = Array.isArray(data.data) ? data.data : [];

    return (
        <ImportTable
            logs={logs}
            pagination={data.pagination}
        />
    );
}

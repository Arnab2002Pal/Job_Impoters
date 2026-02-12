export default function StatusBadge({
    finishedAt,
}: {
    finishedAt?: string | null;
}) {
    if (!finishedAt) {
        return (
            <span className="px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded">
                Failed
            </span>
        );
    }

    return (
        <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded">
            Completed
        </span>
    );
}

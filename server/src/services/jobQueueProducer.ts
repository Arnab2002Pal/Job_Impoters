import { jobImportQueue } from "../queues/jobImport.queue";
import { JobImportPayload, NormalizedJob } from "../types/jobImport.types";
import { batchArray } from "../utils/batch";

export class JobQueueProducerService {
    private BATCH_SIZE = 100;

    async enqueueJobs(
        jobs: NormalizedJob[],
        importLogId: string,
        source: string
    ) {
        const batches = batchArray(jobs, this.BATCH_SIZE);

        console.log(`Total batches created: ${batches.length}`);

        await jobImportQueue.addBulk(
            batches.map((batch) => ({
                name: "job-batch",
                data: {
                    importLogId,
                    source,
                    jobs: batch
                }
            }))
        );

        console.log("All batches pushed to Redis");
    }
}

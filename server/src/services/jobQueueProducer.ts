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

        for (let i = 0; i < batches.length; i++) {
            const payload: JobImportPayload = {
                importLogId,
                source,
                jobs: batches[i]
            };

            await jobImportQueue.add("job-batch", payload);
        }

        console.log("All batches pushed to Redis");
    }
}

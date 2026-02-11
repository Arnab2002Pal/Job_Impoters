import { Worker, Job } from "bullmq";
import { JOB_IMPORT_QUEUE } from "../queues/jobImport.queue";
import { redisConnection } from "../configs/redis";
import { JobImportPayload } from "../types/jobImport.types";

export const jobImportWorker = new Worker<JobImportPayload>(
    JOB_IMPORT_QUEUE,
    async (job: Job<JobImportPayload>) => {
        const { jobs, source, importLogId } = job.data;

        console.log(`🧵 Processing batch from ${source}`);
        console.log(`📦 Jobs in batch: ${jobs.length}`);
        console.log(`🆔 ImportLog: ${importLogId}`);

        // PHASE 5 will add real DB logic here
        // For now, we just simulate success

        return {
            processed: jobs.length
        };
    },
    {
        connection: redisConnection,
        concurrency: 10   // max 10 jobs processed in parallel
    }
);

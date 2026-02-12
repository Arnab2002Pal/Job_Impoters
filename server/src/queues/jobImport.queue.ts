import { Queue } from "bullmq";
import { redisConnection } from "../configs/redis";

export const JOB_IMPORT_QUEUE = "job-import-queue";

export const jobImportQueue = new Queue(JOB_IMPORT_QUEUE, {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,             
        backoff: {
            type: "exponential",
            delay: 2000
        },
        removeOnComplete: true,
        removeOnFail: false
    }
});

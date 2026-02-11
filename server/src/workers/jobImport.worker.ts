import { Worker, Job } from "bullmq";
import { JOB_IMPORT_QUEUE } from "../queues/jobImport.queue";
import { JobModel } from "../models/job.model";
import { ImportLogModel } from "../models/importLog.model";
import { JobImportPayload } from "../types/jobImport.types";
import { redisConnection } from "../configs/redis";
import { jobImportQueue } from "../queues/jobImport.queue";

export const jobImportWorker = new Worker<JobImportPayload>(
    JOB_IMPORT_QUEUE,
    async (job: Job<JobImportPayload>) => {
        console.log("Worker Picked the task!!!")
        const { jobs, importLogId } = job.data;

        let newJobs = 0;
        let updatedJobs = 0;
        let failedJobs = 0;
        const failures: { externalId: string; reason: string }[] = [];

        try {
            const bulkOps = jobs.map((jobItem) => ({
                updateOne: {
                    filter: { externalId: jobItem.externalId },
                    update: { $set: jobItem },
                    upsert: true
                }
            }));

            const result = await JobModel.bulkWrite(bulkOps);

            // detect new vs updated:
            newJobs = result.upsertedCount;
            updatedJobs = result.modifiedCount;

        } catch (error: any) {
            console.error("Bulk operation failed", error);

            failedJobs = jobs.length;
            jobs.forEach((i) =>
                failures.push({
                    externalId: i.externalId,
                    reason: error.message || "Bulk write failed"
                })
            );
        }

        // Update Import Log incrementally
        await ImportLogModel.findByIdAndUpdate(importLogId, {
            $inc: {
                newJobs,
                updatedJobs,
                failedJobs
            },
            ...(failures.length > 0 && {
                $push: { failures: { $each: failures } }
            })
        });
        await checkAndMarkImportComplete(importLogId);

        return {
            newJobs,
            updatedJobs,
            failedJobs
        };
    },
    {
        connection: redisConnection,
        concurrency: 10
    }
);

jobImportWorker.on("completed", async (job) => {
    console.log(`Batch completed: ${job.id}`);
});

jobImportWorker.on("failed", (job, err) => {
    console.error(`Batch failed: ${job?.id}`, err);
});


// Helper
async function checkAndMarkImportComplete(importLogId: string) {
    const waiting = await jobImportQueue.getWaiting();
    const active = await jobImportQueue.getActive();

    const remaining = [...waiting, ...active].filter(
        (j) => {
            if(j.data) {
                j.data.importLogId === importLogId
            }
        }
    );

    if (remaining.length === 0) {
        await ImportLogModel.findByIdAndUpdate(importLogId, {
            finishedAt: new Date()
        });

        console.log(`Import ${importLogId} marked as finished`);
    }
}

import { ImportLogModel } from "../models/importLog.model";

export class ImportLogService {
    async createLog(source: string) {
        const log = await ImportLogModel.create({
            source,
            startedAt: new Date(),
            totalFetched: 0,
            newJobs: 0,
            updatedJobs: 0,
            failedJobs: 0,
            failures: []
        });

        return log;
    }

    async updateTotalFetched(importLogId: string, total: number) {
        await ImportLogModel.findByIdAndUpdate(importLogId, {
            totalFetched: total
        });
    }

    async markAsFailed(importLogId: string, reason: string) {
        await ImportLogModel.findByIdAndUpdate(importLogId, {
            failedJobs: 1,
            failures: [
                {
                    externalId: "SOURCE_LEVEL",
                    reason
                }
            ],
            finishedAt: new Date()
        });
    }

}

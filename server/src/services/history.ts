import { ImportLogModel } from "../models/importLog.model";
import { ImportLogQuery } from "../types/jobImport.types";
import mongoose from "mongoose";

export class ImportHistoryService {
    async getImportLogs(query: ImportLogQuery) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (query.source) {
            filter.source = query.source;
        }

        const [data, total] = await Promise.all([
            ImportLogModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select(' -__v')
                .lean(),
            ImportLogModel.countDocuments(filter)
        ]);

        return {
            data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
    
    async getImportById(id: string) {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid import ID");
        }

        const importLog = await ImportLogModel.findById(id).lean();

        if (!importLog) return null;

        const durationSeconds =
            importLog.finishedAt && importLog.startedAt
                ? Math.round(
                    (new Date(importLog.finishedAt).getTime() -
                        new Date(importLog.startedAt).getTime()) /
                    1000
                )
                : null;

        return {
            id: importLog._id,
            source: importLog.source,
            status: importLog.finishedAt ? "Completed" : "Failed",
            startedAt: importLog.startedAt,
            finishedAt: importLog.finishedAt,
            durationSeconds,
            totalFetched: importLog.totalFetched,
            newJobs: importLog.newJobs,
            updatedJobs: importLog.updatedJobs,
            failedJobs: importLog.failedJobs,
            failures: (importLog.failures || []).map((failure: any) => ({
                reason: failure.reason,
                externalId: failure.externalId
            })),
            createdAt: importLog.createdAt,
            updatedAt: importLog.updatedAt
        };
    }
}

import { ImportLogModel } from "../models/importLog.model";
import { ImportLogQuery } from "../types/jobImport.types";

export class ImportHistoryService {
    async getImportLogs(query: ImportLogQuery) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter: any = {};
        console.log(query.source)
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
        const importLog = await ImportLogModel.findById(id).lean();
        return importLog;
    }
}

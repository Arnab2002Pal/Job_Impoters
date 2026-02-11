import { Schema, model } from "mongoose";

const ImportLogSchema = new Schema(
    {
        source: String,
        startedAt: Date,
        finishedAt: Date,
        totalFetched: Number,
        newJobs: Number,
        updatedJobs: Number,
        failedJobs: Number,
        failures: [
            {
                reason: String,
                externalId: String
            }
        ]
    },
    { timestamps: true }
);

export const ImportLogModel = model("ImportLog", ImportLogSchema);

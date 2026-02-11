import { Schema, model } from "mongoose";

const JobSchema = new Schema(
    {
        externalId: { type: String, required: true, index: true, unique: true },
        title: String,
        company: String,
        location: String,
        source: String,
        url: String
    },
    { timestamps: true }
);

export const JobModel = model("Job", JobSchema);

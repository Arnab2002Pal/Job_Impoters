import crypto from "crypto";
import { NormalizedJob } from "../types/jobImport.types";

export class JobNormalizerService {
    normalizeFromJobicy(parsedData: any, source: string): NormalizedJob[] {
        const items = parsedData?.rss?.channel?.item;

        if (!items) return [];

        const jobsArray = Array.isArray(items) ? items : [items];
        
        return jobsArray.map((item: any) => {
            const title = item.title || "";
            const company = item["job_listing:company"] || "Unknown";
            const location = item["job_listing:location"] || "Remote";
            const link = item.link || "";

            const externalId = this.generateExternalId(title, company, link);

            return {
                externalId,
                title,
                company,
                location,
                source,
                url: link
            };
        });
    }

    private generateExternalId(
        title: string,
        company: string,
        link: string
    ): string {
        return crypto
            .createHash("sha256")
            .update(title + company + link)
            .digest("hex");
    }
}

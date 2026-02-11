import { NormalizedJob } from "../types/jobImport.types";
import { JobFetcherService } from "./jobFetcher";
import { JobNormalizerService } from "./jobNormalizer";
import { JobParserService } from "./jobParser";

export class JobImportOrchestratorService {
    private fetcher = new JobFetcherService();
    private parser = new JobParserService();
    private normalizer = new JobNormalizerService();

    async importFromSource(url: string): Promise<NormalizedJob[]> {
        console.log(`🌐 Fetching jobs from ${url}`);

        const xml = await this.fetcher.fetchXML(url);
        // console.log("xml:----:", xml)
        const parsed = await this.parser.parseXML(xml);
        // console.log("parsed:----:", parsed)
        const jobs = this.normalizer.normalizeFromJobicy(parsed, url);
        console.log(`jobs:---:`, jobs)
        console.log(`✅ Normalized ${jobs.length} jobs from ${url}`);

        return jobs;
    }
}

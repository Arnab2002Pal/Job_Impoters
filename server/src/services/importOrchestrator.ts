import { NormalizedJob } from "../types/jobImport.types";
import { JobFetcherService } from "./fetcher";
import { JobNormalizerService } from "./normalizer";
import { JobParserService } from "./jobParser";

export class JobImportOrchestratorService {
    private fetcher = new JobFetcherService();
    private parser = new JobParserService();
    private normalizer = new JobNormalizerService();

    async importFromSource(url: string): Promise<NormalizedJob[]> {
        console.log(`Fetching jobs from ${url}`);

        const xml = await this.fetcher.fetchXML(url);
        const parsed = await this.parser.parseXML(xml);
        const jobs = this.normalizer.normalizeFromJobicy(parsed, url);
        console.log(`Normalized ${jobs.length} jobs from ${url}`);

        return jobs;
    }
}

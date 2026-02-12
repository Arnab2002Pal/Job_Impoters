import { ImportLogService } from "./log";
import { JobImportOrchestratorService } from "./importOrchestrator";
import { JobQueueProducerService } from "./jobQueueProducer";

export class JobImportRunnerService {
    private orchestrator = new JobImportOrchestratorService();
    private importLogService = new ImportLogService();
    private queueProducer = new JobQueueProducerService();

    async runImport(sourceUrl: string) {
        console.log("Starting import process");

        const log = await this.importLogService.createLog(sourceUrl);

        try {
            // Fetch from src and normalize
            const jobs = await this.orchestrator.importFromSource(sourceUrl);

            // Update the log
            await this.importLogService.updateTotalFetched(
                log._id.toString(),
                jobs.length
            );

            //  Push to queue
            await this.queueProducer.enqueueJobs(
                jobs,
                log._id.toString(),
                sourceUrl
            );

            console.log("Import process initiated successfully");

        } catch (error: any) {
            console.error("Source-level failure", error);

            await this.importLogService.markAsFailed(
                log._id.toString(),
                error.message || "Unknown source error"
            );

            throw error; // so cron logs it
        }
    }

}

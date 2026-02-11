import cron from "node-cron";
import { CRON_SCHEDULE, JOB_SOURCES } from "../configs/import";
import { JobImportRunnerService } from "../services/importRunner";

const runner = new JobImportRunnerService();

let isRunning = false;

export const startJobImportCron = () => {
    cron.schedule(CRON_SCHEDULE, async () => {
        if (isRunning) {
            console.log("Skipped the cycle, Previous cycle still running.");
            return;
        }

        try {
            isRunning = true;
            console.log("Cron triggered job import");

            for (const source of JOB_SOURCES) {
                console.log(`Running import for: ${source}`);

                try {
                    await runner.runImport(source);
                    console.log(`Completed: ${source}`);
                } catch (error: any) {
                    console.error(
                        `Failed source: ${source} →`,
                        error.message
                    );
                    continue;
                }
            }

            console.log("Cron import cycle completed");
        } catch (error) {
            console.error("Cron job failed", error);
        } finally {
            isRunning = false;
        }
    });

    console.log("Job import cron scheduled");
};

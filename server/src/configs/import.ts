import dotenv from 'dotenv'
dotenv.config()

export const JOB_SOURCES: string[] = process.env.JOB_SOURCES
    ? process.env.JOB_SOURCES.split(",")
    : [
        "https://jobicy.com/?feed=job_feed&job_categories=management",
        "https://jobicy.com/?feed=job_feed",
        "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
        "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
        "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
        "https://jobicy.com/?feed=job_feed&job_categories=data-science",
        "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
        "https://jobicy.com/?feed=job_feed&job_categories=business",
        "https://www.higheredjobs.com/rss/articleFeed.cfm"
    ];

// Every hour at minute 0
export const CRON_SCHEDULE = "0 * * * *";

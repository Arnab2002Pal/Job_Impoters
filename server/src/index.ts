import express from "express";
import dotenv from "dotenv";
import { connectMongo } from "./db/mongo";
import "./workers/jobImport.worker";
import { startJobImportCron } from "./cron/jobImport";
import importHistoryRoutes from "./router/routes"

dotenv.config();

const app = express();
app.use(express.json());
app.use("/api", importHistoryRoutes)

const PORT = process.env.PORT || 5000;


// To keep server offline until DB is ready
(async () => {
    await connectMongo();
    startJobImportCron();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})();

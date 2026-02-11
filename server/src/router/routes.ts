import { Router } from "express";
import { ImportHistoryService } from "../services/history";

const router = Router();
const service = new ImportHistoryService();

router.get("/import-logs", async (req, res) => {
    try {
        const result = await service.getImportLogs(req.query);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch import logs",
            error
        });
    }
});

router.get("/import-logs/:id", async (req, res) => {
    try {
        const importLog = await service.getImportById(req.params.id);

        if (!importLog) {
            return res.status(404).json({ message: "Import not found" });
        }

        res.json(importLog);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch import details",
            error
        });
    }
});

export default router;

import { Router } from "express";
import { webhookController } from "../controllers/webhook.controller.js";

const router = Router();

// Final path after mount: /api/webhook
router.post("/webhook", webhookController);

export default router;
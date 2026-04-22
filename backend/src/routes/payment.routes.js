import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createSubscriptionOrderController,
  verifySubscriptionPaymentController
} from "../controllers/payment.controller.js";

const router = Router();

router.post("/payments/create-order", authMiddleware, createSubscriptionOrderController);
router.post("/payments/verify", authMiddleware, verifySubscriptionPaymentController);

export default router;

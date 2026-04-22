import { Router } from "express";
import courseRoutes from "./course.routes.js";
import moduleRoutes from "./module.routes.js";
import contentRoutes from "./content.routes.js";
import quizRoutes from "./quiz.routes.js";
import progressRoutes from "./progress.routes.js";
import webhookRoutes from "./webhook.routes.js";
import paymentRoutes from "./payment.routes.js";
import profileRoutes from "./profile.route.js";

const router = Router();

router.use(courseRoutes);
router.use(moduleRoutes);
router.use(contentRoutes);
router.use(quizRoutes);
router.use(progressRoutes);
router.use(webhookRoutes);
router.use(paymentRoutes);
router.use(profileRoutes);

export default router;

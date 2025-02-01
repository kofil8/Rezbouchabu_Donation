import express from "express";
import { PaymentControllers } from "./payment.controller";
import auth from "../../middlewares/auth";
import { SubscriptionWebhook } from "./subscription.webhook";
const router = express.Router();

// stirpe
router.post("/", auth(), PaymentControllers.cretePayment);

router.post("/webhook", auth(), SubscriptionWebhook.webhookHandler);

export const PaymentRouters = router;

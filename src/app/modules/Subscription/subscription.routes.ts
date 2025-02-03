import express from "express";
import { PaymentControllers } from "./subscription.controller";
import auth from "../../middlewares/auth";
import { SubscriptionWebhook } from "./subscription.webhook";
const router = express.Router();

// // stirpe
// router.post("/customers", createCustomer);
// router.post("/subscriptions", createSubscription);

export const PaymentRouters = router;

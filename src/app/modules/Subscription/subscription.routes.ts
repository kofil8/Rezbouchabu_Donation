import express from "express";
import auth from "../../middlewares/auth";
import { SubscriptionControllers } from "./subscription.controller";
const router = express.Router();

//stirpe
router.post(
  "/create-customer",
  auth(),
  SubscriptionControllers.creteStripeUser
);

router.post(
  "/create-subscription",
  auth(),
  SubscriptionControllers.createSubscription
);
export const SubscriptionRouters = router;

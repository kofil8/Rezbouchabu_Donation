import express from "express";
import { PaymentControllers } from "./payment.controller";
import auth from "../../middlewares/auth";
const router = express.Router();

// stirpe
router.post("/", auth(), PaymentControllers.cretePayment);

export const PaymentRouters = router;

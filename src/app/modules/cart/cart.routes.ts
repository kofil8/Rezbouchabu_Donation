import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CartControllers } from "./cart.controller";
import { CartValidations } from "./cart.validation";
const router = express.Router();

router.post(
  "/",
  auth("BUSINESS", "ADMIN"),
  validateRequest(CartValidations.addToCart),
  CartControllers.addToCart
);

router.get(
  "/",
  auth("USER", "ADMIN", "BUSINESS"),
  CartControllers.getMyCartList
);

router.delete(
  "/:DonationId",
  auth("BUSINESS", "ADMIN"),
  CartControllers.removeDonationFromCart
);

export const CartRouters = router;

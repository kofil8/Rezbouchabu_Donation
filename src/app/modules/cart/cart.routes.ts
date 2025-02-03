import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { CartControllers } from "./cart.controller";
import { CartValidations } from "./cart.validation";
const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(CartValidations.addToCart),
  CartControllers.addToCart
);

router.get("/", auth(), CartControllers.getMyCartList);

router.delete("/:id", auth(), CartControllers.removeDonationFromCart);

export const CartRouters = router;

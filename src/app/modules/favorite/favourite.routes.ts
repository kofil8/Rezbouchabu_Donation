import express from "express";
import auth from "../../middlewares/auth";
import { FavouriteControllers } from "./favourite.controller";
const router = express.Router();

router.post(
  "/:DonationId",
  auth("DONOR", "ADMIN"),
  FavouriteControllers.addToFavourite
);

router.get("/", auth("DONOR", "ADMIN"), FavouriteControllers.getMyFavourite);

router.delete(
  "/:DonationId",
  auth("DONOR", "ADMIN"),
  FavouriteControllers.removeFromFavourite
);

export const FavouriteRouters = router;

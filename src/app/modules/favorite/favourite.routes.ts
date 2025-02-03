import express from "express";
import auth from "../../middlewares/auth";
import { FavouriteControllers } from "./favourite.controller";
const router = express.Router();

router.post(
  "/donations/:donationId",
  auth(),
  FavouriteControllers.addToFavouriteDonation
);
router.post(
  "/requests/:requestId",
  auth(),
  FavouriteControllers.addToFavouriteRequest
);

router.get("/donations/", auth(), FavouriteControllers.getMyFavouriteDonation);
router.get("/requests/", auth(), FavouriteControllers.getMyFavouriteRequest);

router.delete(
  "/donations/:donationId",
  auth(),
  FavouriteControllers.removeFromFavouriteDonation
);
router.delete(
  "/requests/:requestId",
  auth(),
  FavouriteControllers.removeFromFavouriteRequest
);

export const FavouriteRouters = router;

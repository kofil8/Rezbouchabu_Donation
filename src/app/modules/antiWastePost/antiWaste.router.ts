import express from "express";
import parseBodyData from "../../../../helpars/parseBodyData";
import auth from "../../../middlewares/auth";
import { DonationControllers } from "./donation.controller";
import { fileUploader } from "../../../../helpars/fileUploader";

const router = express.Router();

router.post(
  "/",
  auth("ADMIN", "SELLER"),
  fileUploader.uploadDonationImages,
  parseBodyData,
  DonationControllers.createDonation
);

router.get("/", auth(), DonationControllers.getAllDonations);

router.get("/:id", auth(), DonationControllers.getSingleDonation);

router.patch(
  "/:id",
  auth("ADMIN", "DONOR"),
  fileUploader.uploadDonationImages,
  parseBodyData,
  DonationControllers.updateDonation
);

router.delete(
  "/:id",
  auth("ADMIN", "DONOR"),
  DonationControllers.deleteDonation
);

export const AntiWastePostRouters = router;

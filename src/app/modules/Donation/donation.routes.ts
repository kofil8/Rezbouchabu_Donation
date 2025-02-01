import express from "express";
import parseBodyData from "../../../helpars/parseBodyData";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploaderS3";
import { DonationControllers } from "./donation.controller";
const router = express.Router();

router.post(
  "/",
  auth("DONOR", "SUPER_ADMIN", "ADMIN"),
  fileUploader.uploadDonationImage,
  parseBodyData,
  DonationControllers.createDonation
);

router.get("/", DonationControllers.getAllDonations);

router.get("/:id", DonationControllers.getSingleDonation);

router.put(
  "/:id",
  auth("DONOR", "SUPERADMIN", "ADMIN"),
  fileUploader.uploadDonationImage,
  parseBodyData,
  DonationControllers.updateDonation
);

router.delete(
  "/:id",
  auth("DONOR", "SUPER_ADMIN", "ADMIN"),
  DonationControllers.deleteDonation
);

export const DonationRouters = router;

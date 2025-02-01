import express from "express";
import parseBodyData from "../../../helpars/parseBodyData";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploaderS3";
import { DonationControllers } from "./donation.controller";
const router = express.Router();

router.post(
  "/",
  auth(),
  fileUploader.uploadDonationImage,
  parseBodyData,
  DonationControllers.createDonation
);

router.get("/", auth(), DonationControllers.getAllDonations);

router.get("/:id", auth(), DonationControllers.getSingleDonation);

router.put(
  "/:id",
  auth(),
  fileUploader.uploadDonationImage,
  parseBodyData,
  DonationControllers.updateDonation
);

router.delete("/:id", auth(), DonationControllers.deleteDonation);

export const DonationRouters = router;

import express from "express";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploaderS3";
import { ProfileControllers } from "./profile.controller";

const router = express.Router();

router.get(
  "/me",
  auth("DONOR", "ADMIN", "SELLER"),
  ProfileControllers.getMyProfile
);
router.put(
  "/update",
  auth("DONOR", "ADMIN", "SELLER"),
  fileUploader.uploadProfileImage,
  ProfileControllers.updateMyProfile
);

export const ProfileRouters = router;

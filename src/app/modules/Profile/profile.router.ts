import express from "express";
import { fileUploader } from "../../../helpars/fileUploader";
import parseBodyData from "../../../helpars/parseBodyData";
import auth from "../../middlewares/auth";
import { ProfileControllers } from "./profile.controller";

const router = express.Router();

router.get(
  "/me",
  auth("DONOR", "ADMIN", "SELLER", "ADOPTER"),
  ProfileControllers.getMyProfile
);
router.patch(
  "/update",
  auth("DONOR", "ADMIN", "SELLER", "ADOPTER"),
  parseBodyData,
  fileUploader.uploadprofileImage,
  ProfileControllers.updateMyProfile
);

export const ProfileRouters = router;

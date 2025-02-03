import express from "express";
import auth from "../../middlewares/auth";
import { ProfileControllers } from "./profile.controller";
import parseBodyData from "../../../helpars/parseBodyData";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

router.get(
  "/me",
  auth("DONOR", "ADMIN", "SELLER", "RECEIVER"),
  ProfileControllers.getMyProfile
);
router.patch(
  "/update",
  auth("DONOR", "ADMIN", "SELLER", "RECEIVER"),
  parseBodyData,
  fileUploader.uploadprofileImage,
  ProfileControllers.updateMyProfile
);

export const ProfileRouters = router;

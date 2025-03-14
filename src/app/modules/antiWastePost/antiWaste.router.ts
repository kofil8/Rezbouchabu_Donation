import express from "express";
import auth from "../../middlewares/auth";
import { AnitWasteControllers } from "./antiWaste.controlller";
import { fileUploader } from "../../../helpars/fileUploader";
import parseBodyData from "../../../helpars/parseBodyData";

const router = express.Router();

router.post(
  "/create",
  auth(),
  parseBodyData,
  fileUploader.uploadWasteImages,
  AnitWasteControllers.createAntiWastePost
);

router.get("/", auth(), AnitWasteControllers.getAllAnitWastes);

router.get("/:id", auth(), AnitWasteControllers.getSingleAnitWaste);

router.patch(
  "/update/:id",
  auth(),
  parseBodyData,
  fileUploader.uploadWasteImages,
  AnitWasteControllers.updateAnitWaste
);

router.delete("/:id", auth(), AnitWasteControllers.deleteAnitWaste);

export const AntiWastePostRouters = router;

import express from "express";
import { parseBodyData } from "../../middlewares/parseBodyData";
import auth from "../../middlewares/auth";
import { AnitWasteControllers } from "./antiWaste.controlller";

const router = express.Router();

router.post(
  "/",
  auth(),
  parseBodyData,
  AnitWasteControllers.createAntiWastePost
);

router.get("/", auth(), AnitWasteControllers.getAllAnitWastes);

router.get("/:id", auth(), AnitWasteControllers.getSingleAnitWaste);

router.patch(
  "/:id",
  auth(),
  parseBodyData,
  AnitWasteControllers.updateAnitWaste
);

router.delete("/:id", auth(), AnitWasteControllers.deleteAnitWaste);

export const AntiWastePostRouters = router;

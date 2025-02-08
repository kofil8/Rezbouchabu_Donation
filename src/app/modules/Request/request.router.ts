import express from "express";
import parseBodyData from "../../../helpars/parseBodyData";
import auth from "../../middlewares/auth";
import { RequestControllers } from "./request.controller";

const router = express.Router();

router.post("/", auth(), parseBodyData, RequestControllers.createRequest);

router.get("/", auth(), RequestControllers.getAllRequests);

router.get("/:id", auth(), RequestControllers.getSingleRequest);

router.patch("/:id", auth(), parseBodyData, RequestControllers.updateRequest);

router.delete("/:id", auth(), RequestControllers.deleteRequest);

export const RequestRouters = router;

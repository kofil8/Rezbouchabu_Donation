import express from "express";
import auth from "../../middlewares/auth";
import { ConditionControllers } from "./conditon.controller";

const router = express.Router();

router.post("/create", auth("ADMIN"), ConditionControllers.addCondition);

router.get("/", auth("ADMIN", "USER"), ConditionControllers.getConditionList);

router.delete(
  "/:conditionId",
  auth("ADMIN"),
  ConditionControllers.removeConditionDB
);

export const ConditionRouters = router;

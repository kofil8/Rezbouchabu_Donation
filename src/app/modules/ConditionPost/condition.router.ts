import express from "express";
import auth from "../../middlewares/auth";
import { ConditionControllers } from "./conditon.controller";

const router = express.Router();

router.post("/create", auth(), ConditionControllers.addCondition);

router.get("/", auth(), ConditionControllers.getConditionList);

router.delete("/:conditionId", auth(), ConditionControllers.removeConditionDB);

export const ConditionRouters = router;

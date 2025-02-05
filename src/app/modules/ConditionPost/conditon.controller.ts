import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { ConditionServices } from "./condition.service";

const addCondition = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const payload = req.body;
  const result = await ConditionServices.addCondition(userId, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Condition created successfully",
    data: result,
  });
});

const getConditionList = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await ConditionServices.getConditionList(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Condition List Retrieve successfully",
    data: result,
  });
});

const removeConditionDB = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const conditionId = req.params.conditionId;
  const result = await ConditionServices.removeConditionDB(userId, conditionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Condition deleted successfully",
    data: result,
  });
});

export const ConditionControllers = {
  addCondition,
  getConditionList,
  removeConditionDB,
};

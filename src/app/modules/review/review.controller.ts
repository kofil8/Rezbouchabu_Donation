import httpStatus from "http-status";

import { Request, Response } from "express";
import { ReviewServices } from "./review.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../utils/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;
  const payload = req.body;
  const result = await ReviewServices.createReview(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Review created successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const id = req.params.id;
  const result = await ReviewServices.deleteReview(userId, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Review deleted successfully",
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
  deleteReview,
};

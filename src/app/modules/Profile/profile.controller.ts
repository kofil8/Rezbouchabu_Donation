import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { ProfileServices } from "./profile.service";
import { json } from "body-parser";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;
  const result = await ProfileServices.getMyProfileFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;
  const payload = req.body.bodyData;
  const file = req.file as any;
  const result = await ProfileServices.updateMyProfileIntoDB(id, payload, file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: result,
  });
});
export const ProfileControllers = {
  getMyProfile,
  updateMyProfile,
};

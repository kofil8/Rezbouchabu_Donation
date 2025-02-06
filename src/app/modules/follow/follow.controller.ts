import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { FollowServices } from "./follow.service";

const followUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;
  const result = await FollowServices.followUser(currentUserId, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Followed user successfully",
    data: result,
  });
});

const unfollowUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const currentUserId = req.user.id;
  const result = await FollowServices.unfollowUser(currentUserId, userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Unfollowed user successfully",
    data: result,
  });
});

const getFollowing = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await FollowServices.getFollowing(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Following List Retrieve successfully",
    data: result,
  });
});

const getFollowers = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await FollowServices.getFollowers(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Followers List Retrieve successfully",
    data: result,
  });
});

export const FollowController = {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
};

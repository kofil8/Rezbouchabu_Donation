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
    message: "",
    data: result,
  });
});

const getFollowingList = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const followingList = await FollowServices.getFollowing(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Following list retrieved successfully",
    data: followingList,
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
  getFollowingList,
  getFollowers,
};

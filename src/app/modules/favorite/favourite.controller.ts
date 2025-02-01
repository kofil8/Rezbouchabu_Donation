import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { FavouriteServices } from "./favourite.service";

const addToFavourite = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const DonationId = req.params.DonationId;
  const result = await FavouriteServices.addToFavourite(userId, DonationId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Donation added to favourite successfully",
    data: result,
  });
});

const getMyFavourite = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await FavouriteServices.getMyFavourite(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Success",
    data: result,
  });
});

const removeFromFavourite = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const DonationId = req.params.DonationId;
  const result = await FavouriteServices.removeFromFavourite(
    userId,
    DonationId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Donation removed from favourite successfully",
    data: result,
  });
});

export const FavouriteControllers = {
  addToFavourite,
  getMyFavourite,
  removeFromFavourite,
};

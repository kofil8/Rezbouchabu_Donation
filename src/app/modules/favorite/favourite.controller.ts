import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { FavouriteServices } from "./favourite.service";

// Donation to favourite
const addToFavouriteDonation = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const donationId = req.params.donationId;
    const result = await FavouriteServices.addToFavouriteDonation(
      userId,
      donationId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Donation added to favourite successfully",
      data: result,
    });
  }
);

const getMyFavouriteDonation = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await FavouriteServices.getMyFavouriteDonation(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Success",
      data: result,
    });
  }
);

const removeFromFavouriteDonation = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const donationId = req.params.donationId;
    const result = await FavouriteServices.removeFromFavouriteDonation(
      userId,
      donationId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Donation removed from favourite successfully",
      data: result,
    });
  }
);

// request to favourite
const addToFavouriteRequest = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const requestId = req.params.requestId;
    const result = await FavouriteServices.addToFavouriteRequest(
      userId,
      requestId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Request added to favourite successfully",
      data: result,
    });
  }
);

const getMyFavouriteRequest = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const result = await FavouriteServices.getMyFavouriteRequest(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Success",
      data: result,
    });
  }
);

const removeFromFavouriteRequest = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const requestId = req.params.requestId;
    const result = await FavouriteServices.removeFromFavouriteRequest(
      userId,
      requestId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Request removed from favourite successfully",
      data: result,
    });
  }
);

export const FavouriteControllers = {
  addToFavouriteDonation,
  getMyFavouriteDonation,
  removeFromFavouriteDonation,
  addToFavouriteRequest,
  getMyFavouriteRequest,
  removeFromFavouriteRequest,
};

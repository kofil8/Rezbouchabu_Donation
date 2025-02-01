import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { CartServices } from "./cart.service";

const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const payload = req.body;
  const result = await CartServices.addToCart(userId, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Donation added to cart successfully",
    data: result,
  });
});

const getMyCartList = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await CartServices.getMyCartList(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Cart List Retrieve successfully",
    data: result,
  });
});

const removeDonationFromCart = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const DonationId = req.params.DonationId;
    const result = await CartServices.removeDonationFromCart(
      userId,
      DonationId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: "Donation removed from cart successfully",
      data: result,
    });
  }
);

export const CartControllers = {
  addToCart,
  getMyCartList,
  removeDonationFromCart,
};

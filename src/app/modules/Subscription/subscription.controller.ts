import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import ApiError from "../../../errors/ApiErrors";
import sendResponse from "../../../shared/sendResponse";
import { SubscriptionServices } from "./subscription.service";

const creteStripeUser = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user.id;
    const paymentMethodId = req.body.paymentMethodId;
    if (!userId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    const result = await SubscriptionServices.creteStripeUser(
      userId,
      paymentMethodId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Stripe user created successfully",
      data: result,
    });
  }
);

export const SubscriptionControllers = {
  creteStripeUser,
};

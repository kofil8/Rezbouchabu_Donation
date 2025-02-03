import { Request, Response } from "express";
import httpStatus from "http-status";

import { PaymentServices } from "./subscription.service";
import catchAsync from "../../../shared/catchAsync";
import ApiError from "../../../errors/ApiErrors";
import sendResponse from "../../../shared/sendResponse";

const cretePayment = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user.id;
    const payload = req.body;
    if (!userId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
    }
    const result = await PaymentServices.createPayment(userId, payload);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment created successfully",
      data: result,
    });
  }
);

// const createPaypalSubscription = catchAsync(
//   async (req: Request & { user?: any }, res: Response) => {
//     const userId = req.user.id;
//     const payload = req.body;
//     if (!userId) {
//       throw new ApiError(httpStatus.UNAUTHORIZED, "User not authenticated");
//     }
//     const result = await PaymentServices.createPaypalSubscription(
//       userId,
//       payload
//     );
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Paypal Subscription created successfully",
//       data: result,
//     });
//   }
// );

export const PaymentControllers = {
  cretePayment,
  // createPaypalSubscription,
};

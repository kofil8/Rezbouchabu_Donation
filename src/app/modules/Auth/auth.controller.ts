import httpStatus from "http-status";

import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserFromDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User successfully logged in",
    data: result,
  });
});

const socialLogin = catchAsync(async (req, res) => {
  const result = await AuthServices.socialLogin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User successfully logged in with google",
    data: result,
  });
});

const logoutUser = catchAsync(async (req, res) => {
  const id = req.user.id;
  await AuthServices.logoutUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User Successfully logged out",
    data: null,
  });
});

export const AuthControllers = { loginUser, socialLogin, logoutUser };

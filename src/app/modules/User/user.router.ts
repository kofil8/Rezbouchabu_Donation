import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { UserValidations } from "./user.validation";

const router = express.Router();

router.post("/register", UserControllers.registerUser);

router.post(
  "/verify-otp",
  validateRequest(UserValidations.verifyOtp),
  UserControllers.verifyOtp
);

router.post(
  "/resend-otp-reg",
  validateRequest(UserValidations.resendOtp),
  UserControllers.resendOtpReg
);

router.get("/", UserControllers.getAllUsers);

router.get("/:id", auth(), UserControllers.getUserDetails);

router.delete("/:id", auth("ADMIN"), UserControllers.deleteUser);

router.post(
  "/forgot-password",
  validateRequest(UserValidations.forgotPassword),
  UserControllers.forgotPassword
);

router.post(
  "/resend-otp-rest",
  validateRequest(UserValidations.resendOtp),
  UserControllers.resendOtpRest
);

router.post(
  "/change-password",
  validateRequest(UserValidations.changePassword),
  auth(),
  UserControllers.changePassword
);

router.post(
  "/reset-otp",
  validateRequest(UserValidations.verifyOtp),
  UserControllers.ResetOtpVerify
);

router.post(
  "/reset-password",
  validateRequest(UserValidations.resetPassword),
  UserControllers.resetPassword
);

export const UserRouters = router;

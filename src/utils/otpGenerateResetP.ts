import httpStatus from "http-status";
import ApiError from "../errors/ApiErrors";
import { emailTemplate } from "../helpars/emailtempForOTP";
import prisma from "../shared/prisma";
import sentEmailUtility from "./sentEmailUtility";

export const generateOtp = async (payload: { email: string }) => {
  const userData = await prisma.user.findUnique({
    where: { email: payload.email, isVerified: true },
  });

  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  const emailSubject = "OTP Verification for Password Reset";

  // Plain text version
  const emailText = `Your OTP is: ${otp}`;

  const textForResetPassword = `We have received a request to reset your password. Please enter the verification code to reset your password.`;

  // HTML content for the email design
  const emailHTML = emailTemplate(otp, textForResetPassword);

  // Send email with both plain text and HTML
  await sentEmailUtility(payload.email, emailSubject, emailText, emailHTML);

  // Set OTP expiry date (e.g., 10 minutes from now)
  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

  return {
    otp,
    otpExpiry,
  };
};

import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { generateToken } from "../../../utils/generateToken";
import { emailTemplate } from "../../../helpars/emailtempForOTP";
import sentEmailUtility from "../../../utils/sentEmailUtility";

const loginUserFromDB = async (payload: {
  email: string;
  password: string;
  fcmToken?: string;
}) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  // check is user is verified
  if (!userData.isVerified) {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    const emailSubject = "OTP Verification for Registration";

    const emailText = `Your OTP is: ${otp}`;

    const textForRegistration = `Thank you for registering with Rezbouchabu. To complete your registration, please verify your email address by entering the verification code below.`;

    const emailHTML = emailTemplate(otp, textForRegistration);

    await sentEmailUtility(payload.email, emailSubject, emailText, emailHTML);

    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5);

    await prisma.otp.create({
      data: {
        email: payload.email,
        otp,
        expiry: otpExpiry,
      },
    });

    throw new ApiError(
      httpStatus.TEMPORARY_REDIRECT,
      "User is not verified, Please verify your email first"
    );
  }

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password as string
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid credentials");
  }

  if (userData.isOnline === false) {
    await prisma.user.update({
      where: {
        email: payload.email,
      },
      data: {
        isOnline: true,
      },
    });
  }

  if (payload?.fcmToken) {
    await prisma.user.update({
      where: {
        email: payload.email,
      },
      data: {
        fcmToken: payload.fcmToken,
      },
    });
  }

  //  check if user is verified

  const accessToken = generateToken(
    {
      id: userData.id,
      email: userData.email as string,
      role: userData.role,
      isOnline: userData.isOnline,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );
  return {
    accessToken,
    id: userData.id,
    email: userData.email,
    fullName: userData.fullName,
    role: userData.role,
  };
};

const logoutUser = async (id: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (userData.isOnline === false) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is already logged out");
  }

  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      isOnline: false,
      fcmToken: null,
    },
  });
  return;
};

export const AuthServices = { loginUserFromDB, logoutUser };

import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { generateToken } from "../../../utils/generateToken";
import { emailTemplate } from "../../../helpars/emailtempForOTP";
import sentEmailUtility from "../../../utils/sentEmailUtility";
import { generateOtpReg } from "../../../utils/otpGenerateReg";

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
    const { otp, otpExpiry } = await generateOtpReg({ email: payload.email });

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

const socialLogin = async (payload: any) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    const user = await prisma.user.create({
      data: {
        email: payload.email,
        role: payload.role,
        isOnline: true,
        isVerified: true,
      },
    });

    const accessToken = generateToken(
      {
        id: user.id,
        email: user.email as string,
        role: user.role,
        isOnline: user.isOnline,
      },
      config.jwt.jwt_secret as Secret,
      config.jwt.expires_in as string
    );

    return {
      accessToken,
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

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

export const AuthServices = { loginUserFromDB, socialLogin, logoutUser };

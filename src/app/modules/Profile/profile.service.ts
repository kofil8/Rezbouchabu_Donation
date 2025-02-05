import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import config from "../../../config";

const getMyProfileFromDB = async (id: string) => {
  const Profile = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      address: true,
      country: true,
      city: true,
      phoneNumber: true,
      email: true,
      isOnline: true,
      profileImage: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return Profile;
};

const updateMyProfileIntoDB = async (id: string, payload: any, file: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
    select: { id: true, profileImage: true },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  const profileImage =
    file && file.originalname
      ? `${config.backend_image_url}/uploads/profile/${file.originalname}`
      : existingUser.profileImage;

  // Check if payload is a string and parse it if necessary
  let parsedPayload = payload;
  if (typeof payload === "string") {
    try {
      parsedPayload = JSON.parse(payload);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid payload format");
    }
  }

  const { firstName, lastName } = parsedPayload;

  const fullName = `${firstName} ${lastName}`;

  // Now update using only valid keys
  const result = await prisma.user.update({
    where: { id },
    data: {
      profileImage,
      ...parsedPayload,
      fullName,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      fullName: true,
      gender: true,
      address: true,
      city: true,
      country: true,
      dateOfBirth: true,
      phoneNumber: true,
      profileImage: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

export const ProfileServices = {
  getMyProfileFromDB,
  updateMyProfileIntoDB,
};

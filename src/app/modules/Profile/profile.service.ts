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
    select: {
      id: true,
      profileImage: true,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  const profileImage = file?.originalname
    ? `${config.backend_image_url}/uploads/${file.originalname}`
    : existingUser.profileImage;

  const updatedData = {
    ...payload,
    profileImage,
  };

  const result = await prisma.user.update({
    where: {
      id: id,
    },
    data: updatedData,
    select: {
      id: true,
      firstName: true,
      lastName: true,
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

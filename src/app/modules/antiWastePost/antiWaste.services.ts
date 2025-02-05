import { Category, Prisma } from "@prisma/client";
import httpStatus from "http-status";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import { IPaginationOptions } from "../../../interfaces/paginations";
import prisma from "../../../shared/prisma";
import { calculatePagination } from "../../../utils/calculatePagination";
import logger from "../../../utils/logger";

export type Filters = {
  searchTerm: string;
};

const createAnitWasteIntoDB = async (id: string, payload: any, files: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: id },
    select: { id: true },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  const imageURL = files?.antiWasteImages
    ? files.antiWasteImages.map((file: any) =>
        file.originalname
          ? `${config.backend_image_url}/uploads/antiWaste/${file.originalname}`
          : ""
      )
    : [];

  let parsedPayload = payload;
  if (typeof payload === "string") {
    try {
      parsedPayload = JSON.parse(payload);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid payload format");
    }
  }

  const userId = existingUser.id;

  const antiWaste = await prisma.antiWastePost.create({
    data: {
      userId,
      ...parsedPayload,
      antiWasteImages: imageURL,
    },
  });

  return antiWaste;
};

const getAllAnitWastesFromDB = async (
  options: IPaginationOptions,
  params: Filters
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm } = params || {};

  const andConditions: Prisma.antiWastePostWhereInput[] = [];

  // search by user
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.antiWastePostWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.antiWastePost.findMany({
    where: whereConditions,
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.antiWastePost.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit,
    total_docs: total,
    total_pages: Math.ceil(total / limit),
  };

  return { meta, data: result };
};

const getSingleAnitWasteFromDB = async (id: string) => {
  const result = await prisma.antiWastePost.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "AntiWaste is not found");
  }
  return result;
};

const updateAnitWasteIntoDB = async (id: string, payload: any, files: any) => {
  const existingAntiWaste = await prisma.antiWastePost.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingAntiWaste) {
    throw new ApiError(httpStatus.NOT_FOUND, "Donation not found");
  }

  const imageURL = files?.antiWasteImages
    ? files.antiWasteImages.map((file: any) =>
        file.originalname
          ? `${config.backend_image_url}/uploads/antiWaste/${file.originalname}`
          : ""
      )
    : [];

  let parsedPayload = payload;
  if (typeof payload === "string") {
    try {
      parsedPayload = JSON.parse(payload);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid payload format");
    }
  }
  const antiWaste = await prisma.antiWastePost.update({
    where: {
      id,
    },
    data: {
      ...parsedPayload,
      donationImages: imageURL,
    },
  });
  return antiWaste;
};

const deleteAnitWasteIntoDB = async (id: string) => {
  const existingAntiWaste = await prisma.antiWastePost.findUnique({
    where: {
      id,
    },
  });

  if (!existingAntiWaste) {
    throw new ApiError(httpStatus.NOT_FOUND, "AntiWaste is not found");
  }

  const AntiWaste = await prisma.antiWastePost.delete({
    where: {
      id,
    },
  });
  return AntiWaste;
};

export const AnitWasteServices = {
  createAnitWasteIntoDB,
  getAllAnitWastesFromDB,
  getSingleAnitWasteFromDB,
  updateAnitWasteIntoDB,
  deleteAnitWasteIntoDB,
};

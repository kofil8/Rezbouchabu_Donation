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
  category: Category;
  subCategory: string;
  condition: string;
};

const createDonationIntoDB = async (id: string, payload: any, files: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: id },
    select: { id: true },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  const imageURL = files?.donationImages
    ? files.donationImages.map((file: any) =>
        file.originalname
          ? `${config.backend_image_url}/uploads/${file.originalname}`
          : ""
      )
    : [];

  if (payload.category === Category.Food) {
    payload.subcategory = null;
  }

  logger.info(
    "Category: " + payload.category + " Subcategory: " + payload.subcategory
  );

  let parsedPayload = payload;
  if (typeof payload === "string") {
    try {
      parsedPayload = JSON.parse(payload);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid payload format");
    }
  }

  const userId = existingUser.id;

  const donation = await prisma.donation.create({
    data: {
      userId,
      ...parsedPayload,
      donationImages: imageURL,
    },
    select: {
      id: true,
      userId: true,
      name: true,
      description: true,
      donationImages: true,
      category: true,
      subcategory: true,
      latitude: true,
      longitude: true,
      condition: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return donation;
};

const getAllDonationsFromDB = async (
  options: IPaginationOptions,
  params: Filters
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...restParams } = params || {};

  const andConditions: Prisma.DonationWhereInput[] = [];

  // search by user
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
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

  if (Object.keys(restParams).length) {
    andConditions.push({
      AND: Object.keys(restParams).map((key) => ({
        [key]: {
          //category:{equals:Food}
          equals: restParams[key as keyof typeof restParams],
        },
      })),
    });
  }

  const whereConditions: Prisma.DonationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.donation.findMany({
    where: whereConditions,
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.donation.count({
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

const getSingleDonationFromDB = async (id: string) => {
  const result = await prisma.donation.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Donation not found");
  }
  return result;
};

const updateDonationIntoDB = async (id: string, payload: any, files: any) => {
  console.log(id);
  const existingDonation = await prisma.donation.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingDonation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Donation not found");
  }

  const imageURL = files?.donationImages
    ? files.donationImages.map((file: any) =>
        file.originalname
          ? `${config.backend_image_url}/uploads/${file.originalname}`
          : ""
      )
    : [];

  if (payload.category === Category.Food) {
    payload.subcategory = null;
  }
  logger.info(
    "Category: " + payload.category + " Subcategory: " + payload.subcategory
  );

  let parsedPayload = payload;
  if (typeof payload === "string") {
    try {
      parsedPayload = JSON.parse(payload);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid payload format");
    }
  }
  const donation = await prisma.donation.update({
    where: {
      id,
    },
    data: {
      ...parsedPayload,
      donationImages: imageURL,
    },
    select: {
      id: true,
      userId: true,
      name: true,
      description: true,
      donationImages: true,
      latitude: true,
      longitude: true,
      category: true,
      subcategory: true,
      condition: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return donation;
};

const deleteDonationIntoDB = async (id: string) => {
  const existingDonation = await prisma.donation.findUnique({
    where: {
      id,
    },
  });

  if (!existingDonation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Donation not found");
  }

  const donation = await prisma.donation.delete({
    where: {
      id,
    },
  });
  return donation;
};

export const DonationServices = {
  createDonationIntoDB,
  getAllDonationsFromDB,
  getSingleDonationFromDB,
  updateDonationIntoDB,
  deleteDonationIntoDB,
};

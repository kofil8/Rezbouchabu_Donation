import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import { Category, Prisma } from "@prisma/client";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { calculatePagination } from "../../../utils/calculatePagination";
import { toASCII } from "punycode";

export type Filters = {
  searchTerm: string;
  category: Category;
  subCategory: string;
  condition: string;
};
const createRequestIntoDB = async (id: string, payload: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: id },
    select: { id: true },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (payload.category === Category.Food) {
    payload.subcategory = null;
  }

  let parsedPayload = payload;
  if (typeof payload === "string") {
    try {
      parsedPayload = JSON.parse(payload);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid payload format");
    }
  }

  const userId = existingUser.id;

  const request = await prisma.requests.create({
    data: {
      userId,
      ...parsedPayload,
    },
    select: {
      id: true,
      userId: true,
      name: true,
      description: true,
      category: true,
      subcategory: true,
      latitude: true,
      longitude: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return request;
};

const getAllRequestsFromDB = async (
  options: IPaginationOptions,
  params: Filters
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const andConditions: Prisma.RequestsWhereInput[] = [];

  // search by user
  if (params.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: params.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (Object.keys(params).length) {
    andConditions.push({
      AND: Object.keys(params).map((key) => ({
        [key]: {
          equals: (params as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.RequestsWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.requests.findMany({
    where: whereConditions,
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.requests.count({
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

const getSingleRequestFromDB = async (id: string) => {
  const result = await prisma.requests.findUnique({
    where: {
      id,
    },
  });
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  }
  return result;
};

const updateRequestIntoDB = async (id: string, payload: any) => {
  const existingDonation = await prisma.requests.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  });

  if (!existingDonation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  }

  let parsedPayload = payload;
  if (typeof payload === "string") {
    try {
      parsedPayload = JSON.parse(payload);
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid payload format");
    }
  }
  const donation = await prisma.requests.update({
    where: {
      id,
    },
    data: {
      ...parsedPayload,
    },
    select: {
      id: true,
      userId: true,
      name: true,
      description: true,
      latitude: true,
      longitude: true,
      category: true,
      subcategory: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return donation;
};

const deleteRequestIntoDB = async (id: string) => {
  const existingDonation = await prisma.requests.findUnique({
    where: {
      id,
    },
  });

  if (!existingDonation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  }

  const request = await prisma.requests.delete({
    where: {
      id,
    },
  });
  return request;
};

export const RequestServices = {
  createRequestIntoDB,
  getAllRequestsFromDB,
  getSingleRequestFromDB,
  updateRequestIntoDB,
  deleteRequestIntoDB,
};

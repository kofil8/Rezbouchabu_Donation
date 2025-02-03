import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const createRequestIntoDB = async (id: string, payload: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: id },
    select: { id: true },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  console.log(existingUser.id);

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

const getAllRequestsFromDB = async () => {
  const result = await prisma.requests.findMany({
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
  return result;
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

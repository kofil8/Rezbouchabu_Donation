import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const addCondition = async (userId: string, payload: any) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const result = await prisma.conditionPost.create({
    data: {
      userId: userId,
      ...payload,
    },
  });
  return result;
};

const getConditionList = async (userId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.conditionPost.findMany({
    where: {
      userId: userId,
    },
  });

  return result;
};

const removeConditionDB = async (userId: string, conditionId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const existingFavourite = await prisma.conditionPost.findFirst({
    where: {
      id: conditionId,
    },
  });

  if (!existingFavourite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Condition not found");
  }

  const result = await prisma.conditionPost.delete({
    where: {
      userId: userId,
      id: conditionId,
    },
  });
  return;
};

export const ConditionServices = {
  addCondition,
  getConditionList,
  removeConditionDB,
};

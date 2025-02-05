import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const addCategory = async (userId: string, payload: any) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  const result = await prisma.categoryPost.create({
    data: {
      userId: userId,
      ...payload,
    },
  });
  return result;
};

const getCategoryList = async (userId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.categoryPost.findMany({
    where: {
      userId: userId,
    },
  });

  return result;
};

const removeCategoryDB = async (userId: string, categoryId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const existingFavourite = await prisma.categoryPost.findFirst({
    where: {
      id: categoryId,
    },
  });

  if (!existingFavourite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
  }

  const result = await prisma.categoryPost.delete({
    where: {
      userId: userId,
      id: categoryId,
    },
  });
  return;
};

export const CategoryServices = {
  addCategory,
  getCategoryList,
  removeCategoryDB,
};

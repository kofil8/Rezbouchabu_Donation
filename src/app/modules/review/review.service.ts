import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const createReview = async (id: string, payload: any) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.review.create({
    data: {
      userId: id,
      ...payload,
    },
  });
  return result;
};

const deleteReview = async (userId: string, id: string) => {
  const existingReview = await prisma.review.findUnique({
    where: {
      id,
    },
  });

  if (!existingReview) {
    throw new ApiError(httpStatus.NOT_FOUND, "Review not found");
  }

  const result = await prisma.review.delete({
    where: {
      id,
      userId,
    },
  });
  return;
};

export const ReviewServices = {
  createReview,
  deleteReview,
};

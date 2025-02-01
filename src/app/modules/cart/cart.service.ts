import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const addToCart = async (userId: string, payload: any) => {
  const result = await prisma.addToCart.create({
    data: {
      userId: userId,
      ...payload,
    },
  });
  return result;
};

const getMyCartList = async (userId: string) => {
  const result = await prisma.addToCart.findMany({
    where: {
      userId: userId,
    },
    include: {
      Donation: true,
    },
  });

  // // Map the results to include only the necessary Donation details
  // const favourites = result.map((item) => ({
  //   DonationImage: item?.Donation?.DonationImage,
  //   name: item?.Donation?.name,
  //   price: item?.Donation?.price,
  // }));

  return result;
};

const removeDonationFromCart = async (userId: string, DonationId: string) => {
  const existingFavourite = await prisma.addToCart.findFirst({
    where: {
      id: DonationId,
    },
  });

  if (!existingFavourite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Donation not found");
  }

  const result = await prisma.addToCart.delete({
    where: {
      userId: userId,
      id: DonationId,
    },
  });
  return;
};

export const CartServices = {
  addToCart,
  getMyCartList,
  removeDonationFromCart,
};

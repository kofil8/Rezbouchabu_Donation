import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

const addToFavourite = async (userId: string, DonationId: string) => {
  const result = await prisma.favourite.create({
    data: {
      userId: userId,
      DonationId: DonationId,
    },
  });
  return result;
};

const getMyFavourite = async (userId: string) => {
  const result = await prisma.favourite.findMany({
    where: {
      userId: userId,
    },
    include: {
      Donation: true,
    },
  });

  // Map the results to include only the necessary Donation details
  const favourites = result.map((item) => ({
    DonationImage: item?.Donation?.DonationImage,
    name: item?.Donation?.name,
    price: item?.Donation?.price,
  }));

  return favourites;
};

const removeFromFavourite = async (userId: string, DonationId: string) => {
  const existingFavourite = await prisma.favourite.findFirst({
    where: {
      id: DonationId,
    },
  });

  if (!existingFavourite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Favourite not found");
  }

  const result = await prisma.favourite.deleteMany({
    where: {
      userId: userId,
      id: DonationId,
    },
  });
  return;
};

export const FavouriteServices = {
  addToFavourite,
  getMyFavourite,
  removeFromFavourite,
};

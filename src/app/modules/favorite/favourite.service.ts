import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

// donation to favourite
const addToFavouriteDonation = async (userId: string, donationId: string) => {
  const existingDonation = await prisma.donation.findUnique({
    where: {
      id: donationId,
    },
  });

  if (!existingDonation) {
    throw new ApiError(httpStatus.NOT_FOUND, "Donation not found");
  }

  const existingFavourite = await prisma.favourite.findFirst({
    where: {
      userId: userId,
      donationId: donationId,
    },
  });

  if (existingFavourite) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Favourite already exists");
  }

  const result = await prisma.favourite.create({
    data: {
      userId: userId,
      donationId: donationId,
    },
    select: {
      id: true,
      userId: true,
      donationId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const getMyFavouriteDonation = async (userId: string) => {
  const result = await prisma.favourite.findMany({
    where: {
      userId: userId,
    },
    include: {
      donation: true,
    },
  });

  return result;
};

const removeFromFavouriteDonation = async (
  userId: string,
  donationId: string
) => {
  const existingFavourite = await prisma.favourite.findFirst({
    where: {
      id: donationId,
    },
  });

  if (!existingFavourite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Favourite not found");
  }

  const result = await prisma.favourite.deleteMany({
    where: {
      userId: userId,
      id: donationId,
    },
  });
  return;
};

// request to favourite
const addToFavouriteRequest = async (userId: string, requsetId: string) => {
  const existingRequest = await prisma.requests.findUnique({
    where: {
      id: requsetId,
    },
  });

  if (!existingRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, "Request not found");
  }

  const existingFavourite = await prisma.favourite.findFirst({
    where: {
      userId: userId,
      requestId: requsetId,
    },
  });

  if (existingFavourite) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Favourite already exists");
  }
  const result = await prisma.favourite.create({
    data: {
      userId: userId,
      requestId: requsetId,
    },
    select: {
      id: true,
      userId: true,
      requestId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const getMyFavouriteRequest = async (userId: string) => {
  const result = await prisma.favourite.findMany({
    where: {
      userId: userId,
    },
    include: {
      request: true,
    },
  });

  return result;
};

const removeFromFavouriteRequest = async (
  userId: string,
  requestId: string
) => {
  const existingFavourite = await prisma.favourite.findFirst({
    where: {
      id: requestId,
    },
  });

  if (!existingFavourite) {
    throw new ApiError(httpStatus.NOT_FOUND, "Favourite not found");
  }

  const result = await prisma.favourite.deleteMany({
    where: {
      userId: userId,
      id: requestId,
    },
  });
  return;
};

export const FavouriteServices = {
  addToFavouriteDonation,
  getMyFavouriteDonation,
  removeFromFavouriteDonation,
  addToFavouriteRequest,
  getMyFavouriteRequest,
  removeFromFavouriteRequest,
};

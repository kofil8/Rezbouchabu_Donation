import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import config from "../../../config";
import httpStatus from "http-status";

const createDonationIntoDB = async (payload: any, file: any) => {
  const donationImage = file?.originalname
    ? `${process.env.BACKEND_BASE_URL}/uploads/${file.originalname}`
    : null;

  const existingDonation = await prisma.donation.findUnique({
    where: { id: payload.id },
  });
  if (existingDonation) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Donation already exists");
  }

  const donation = await prisma.donation.create({
    data: {
      ...payload,
      donationImage,
    },
    select: {
      id: true,
      name: true,
      description: true,
      donationImage: true,
      category: true,
      condition: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return donation;
};

const getAllDonationsFromDB = async () => {
  const result = await prisma.donation.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      donationImage: true,
      category: true,
      condition: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
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

const updateDonationIntoDB = async (id: string, payload: any, file: any) => {
  const DonationImage = file?.originalname
    ? `${config.backend_image_url}/uploads/${file.originalname}`
    : null;

  const donation = await prisma.donation.update({
    where: {
      id,
    },
    data: {
      ...payload,
      DonationImage,
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

import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { DonationServices } from "./donation.service";

const createDonation = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body.bodyData;
  const file = req.file as any;
  const result = await DonationServices.createDonationIntoDB(payload, file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Donation registered successfully",
    data: result,
  });
});

const getAllDonations = catchAsync(async (req: Request, res: Response) => {
  const result = await DonationServices.getAllDonationsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Donations Retrieve successfully",
    data: result,
  });
});

const getSingleDonation = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await DonationServices.getSingleDonationFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Donation Retrieve successfully",
    data: result,
  });
});

const updateDonation = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body.bodyData;
  const file = req.file as any;
  const result = await DonationServices.updateDonationIntoDB(id, payload, file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Donation updated successfully",
    data: result,
  });
});

const deleteDonation = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await DonationServices.deleteDonationIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Donation deleted successfully",
    data: result,
  });
});
export const DonationControllers = {
  createDonation,
  getAllDonations,
  getSingleDonation,
  updateDonation,
  deleteDonation,
};

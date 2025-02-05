import { Request, Response } from "express";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { AnitWasteServices, Filters } from "./antiWaste.services";

const createAntiWastePost = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;
  const payload = req.body.bodyData;
  const files = req.files as any;
  const result = await AnitWasteServices.createAnitWasteIntoDB(
    id,
    payload,
    files
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "AnitWaste created successfully",
    data: result,
  });
});

const getAllAnitWastes = catchAsync(async (req: Request, res: Response) => {
  const paginationOptions = pick(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
  ]);
  const filters = pick(req.query, [
    "searchTerm",
    "category",
    "subCategory",
    "condition",
  ]);
  const result = await AnitWasteServices.getAllAnitWastesFromDB(
    paginationOptions,
    filters as Filters
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "AnitWastes Retrieve successfully",
    data: result,
  });
});

const getSingleAnitWaste = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AnitWasteServices.getSingleAnitWasteFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "AnitWaste Retrieve successfully",
    data: result,
  });
});

const updateAnitWaste = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body.bodyData;
  const files = req.files as any;
  const result = await AnitWasteServices.updateAnitWasteIntoDB(
    id,
    payload,
    files
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "AnitWaste updated successfully",
    data: result,
  });
});

const deleteAnitWaste = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await AnitWasteServices.deleteAnitWasteIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "AnitWaste deleted successfully",
    data: result,
  });
});
export const AnitWasteControllers = {
  createAntiWastePost,
  getAllAnitWastes,
  getSingleAnitWaste,
  updateAnitWaste,
  deleteAnitWaste,
};

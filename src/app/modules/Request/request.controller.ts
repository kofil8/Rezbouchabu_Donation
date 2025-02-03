import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { RequestServices } from "./request.service";

const createRequest = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;
  const payload = req.body;
  const result = await RequestServices.createRequestIntoDB(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Request created successfully",
    data: result,
  });
});

const getAllRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await RequestServices.getAllRequestsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Request Retrieve successfully",
    data: result,
  });
});

const getSingleRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await RequestServices.getSingleRequestFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Request Retrieve successfully",
    data: result,
  });
});

const updateRequest = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const result = await RequestServices.updateRequestIntoDB(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Request updated successfully",
    data: result,
  });
});

const deleteRequest = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await RequestServices.deleteRequestIntoDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Request deleted successfully",
    data: result,
  });
});
export const RequestControllers = {
  createRequest,
  getAllRequests,
  getSingleRequest,
  updateRequest,
  deleteRequest,
};

import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { CategoryServices } from "./category.service";

const addCategory = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const payload = req.body;
  const result = await CategoryServices.addCategory(userId, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "Category created successfully",
    data: result,
  });
});

const getCategoryList = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await CategoryServices.getCategoryList(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Category List Retrieve successfully",
    data: result,
  });
});

const removeCategoryDB = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const categoryId = req.params.categoryId;
  const result = await CategoryServices.removeCategoryDB(userId, categoryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Category deleted successfully",
    data: result,
  });
});

export const CategoryControllers = {
  addCategory,
  getCategoryList,
  removeCategoryDB,
};

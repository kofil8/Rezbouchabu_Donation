import express from "express";
import auth from "../../middlewares/auth";
import { CategoryControllers } from "./category.controller";

const router = express.Router();

router.post("/create", auth("ADMIN"), CategoryControllers.addCategory);

router.get("/", auth("ADMIN", "USER"), CategoryControllers.getCategoryList);

router.delete(
  "/:categoryId",
  auth("ADMIN"),
  CategoryControllers.removeCategoryDB
);

export const CategoryRouters = router;

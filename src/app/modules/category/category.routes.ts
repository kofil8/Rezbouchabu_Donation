import express from "express";
import auth from "../../middlewares/auth";
import { CategoryControllers } from "./category.controller";

const router = express.Router();

router.post("/create", auth(), CategoryControllers.addCategory);

router.get("/", auth(), CategoryControllers.getCategoryList);

router.delete("/:id", auth(), CategoryControllers.removeCategoryDB);

export const CategoryRouters = router;

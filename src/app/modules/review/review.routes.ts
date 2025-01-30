import express from "express";
import auth from "../../middlewares/auth";
import { ReviewControllers } from "./review.controller";
const router = express.Router();

router.post("/", auth("DONOR", "ADMIN"), ReviewControllers.createReview);

router.delete("/:id", auth("DONOR", "ADMIN"), ReviewControllers.deleteReview);

export const ReviewRouters = router;

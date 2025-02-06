import express from "express";
import { FollowController } from "./follow.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/follow/:userId", auth(), FollowController.followUser);
router.post("/unfollow/:userId", auth(), FollowController.unfollowUser);
router.get("/following/", auth(), FollowController.getFollowingList);
router.get("/followers/", auth(), FollowController.getFollowers);

export const FollowRouters = router;

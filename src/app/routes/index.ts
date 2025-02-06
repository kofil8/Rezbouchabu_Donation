import express from "express";
import { ProfileRouters } from "../modules/profile/profile.router";
import { RequestRouters } from "../modules/request/request.router";
import { SubscriptionRouters } from "../modules/subscription/subscription.routes";
import { UserRouters } from "../modules/user/user.router";
import { AntiWastePostRouters } from "../modules/antiWastePost/antiWaste.router";
import { AuthRouters } from "../modules/auth/auth.router";
import { CategoryRouters } from "../modules/categoryPost/category.routes";
import { ChatRouters } from "../modules/chat/chat.route";
import { ConditionRouters } from "../modules/conditionPost/condition.router";
import { DonationRouters } from "../modules/donation/donation.routes";
import { FavouriteRouters } from "../modules/favorite/favourite.routes";
import { NotificationsRouters } from "../modules/notifications/notification.routes";
import { ReviewRouters } from "../modules/review/review.routes";
import { FollowRouters } from "../modules/follow/follow.router";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRouters,
  },
  {
    path: "/users",
    route: UserRouters,
  },
  {
    path: "/profile",
    route: ProfileRouters,
  },
  {
    path: "/favourites",
    route: FavouriteRouters,
  },
  {
    path: "/reviews",
    route: ReviewRouters,
  },
  {
    path: "/notifications",
    route: NotificationsRouters,
  },
  {
    path: "/chat",
    route: ChatRouters,
  },
  {
    path: "/categories",
    route: CategoryRouters,
  },
  {
    path: "/conditions",
    route: ConditionRouters,
  },
  {
    path: "/donations",
    route: DonationRouters,
  },
  {
    path: "/requests",
    route: RequestRouters,
  },
  {
    path: "/anti-waste",
    route: AntiWastePostRouters,
  },
  {
    path: "/subscription",
    route: SubscriptionRouters,
  },
  {
    path: "/follow",
    route: FollowRouters,
  },
];

moduleRoutes
  .filter((route) => route.route)
  .forEach((route) => router.use(route.path, route.route));

export default router;

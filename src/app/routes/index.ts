import express from "express";
import { UserRouters } from "../modules/User/user.router";
import { AuthRouters } from "../modules/Auth/auth.router";
import { ReviewRouters } from "../modules/review/review.routes";
import { NotificationsRouters } from "../modules/notifications/notification.routes";
import { ChatRouters } from "../modules/chat/chat.route";
import { DonationRouters } from "../modules/Donation/donation.routes";
import { ProfileRouters } from "../modules/Profile/profile.router";
import { RequestRouters } from "../modules/Request/request.router";
import { FavouriteRouters } from "../modules/favorite/favourite.routes";
import { SubscriptionRouters } from "../modules/Subscription/subscription.routes";

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
    path: "/donations",
    route: DonationRouters,
  },
  {
    path: "/requests",
    route: RequestRouters,
  },
  {
    path: "/subscription",
    route: SubscriptionRouters,
  },
];

moduleRoutes
  .filter((route) => route.route)
  .forEach((route) => router.use(route.path, route.route));

export default router;

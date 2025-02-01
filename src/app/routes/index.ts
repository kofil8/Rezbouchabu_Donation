import express from "express";
import { UserRouters } from "../modules/User/user.router";
import { AuthRouters } from "../modules/Auth/auth.router";
import { ReviewRouters } from "../modules/review/review.routes";
import { NotificationsRouters } from "../modules/notifications/notification.routes";
import { ChatRouters } from "../modules/chat/chat.route";
import { DonationRouters } from "../modules/Donation/donation.routes";
import { ProfileRouters } from "../modules/Profile/profile.router";

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
];

moduleRoutes
  .filter((route) => route.route)
  .forEach((route) => router.use(route.path, route.route));

export default router;

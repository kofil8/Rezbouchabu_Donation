import httpStatus from "http-status";
import cron from "node-cron";
import Stripe from "stripe";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { SubscriptionStatus } from "@prisma/client";
import stripe from "../../../helpars/stripe";

// cron.schedule("0 0 * * *", async () => {
//   console.log("Running daily subscription expiration check...");

//   try {
//     // Fetch subscriptions that have expired
//     const expiredSubscriptions = await prisma.subscriptionPlan.findMany({
//       where: {
//         endDate: {
//           lt: new Date(), // Get subscriptions where the end date is in the past
//         },
//         status: "ACTIVE", // Only check active subscriptions
//       },
//     });

//     // Update the status of expired subscriptions
//     for (const subscription of expiredSubscriptions) {
//       await prisma.subscriptionPlan.update({
//         where: { id: subscription.id },
//         data: { status: "CANCELLED" },
//       });

//       console.log(
//         `Subscription with ID ${subscription.id} has expired and was canceled.`
//       );
//     }
//   } catch (error) {
//     console.error("Error during subscription expiration check:", error);
//   }
// });

const creteStripeUser = async (userId: string, paymentMethodId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      stripeCustomerId: true,
    },
  });

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  if (user.stripeCustomerId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already has a Stripe ID");
  }

  const customer = await stripe.customers.create({
    email: user.email,
    payment_method: paymentMethodId,
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: customer.id,
    },
  });

  return customer;
};

const createSubscription = async (userId: string, planId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (!user.stripeCustomerId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User does not have a Stripe customer ID"
    );
  }

  const existingSubscription = await prisma.subscription.findFirst({
    where: {
      userId: userId,
    },
  });

  if (existingSubscription) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User already has a subscription"
    );
  }

  const subscription = await stripe.subscriptions.create({
    customer: user.stripeCustomerId,
    items: [{ price: planId }],
    payment_behavior: "allow_incomplete",
    expand: ["latest_invoice.payment_intent"],
  });

  await prisma.subscription.create({
    data: {
      userId: user.id,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: subscription.id,
      planId: planId,
      status: SubscriptionStatus.ACTIVE,
    },
  });

  return subscription;
};

export const SubscriptionServices = { creteStripeUser, createSubscription };

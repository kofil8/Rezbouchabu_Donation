import httpStatus from "http-status";
import cron from "node-cron";
import Stripe from "stripe";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { SubscriptionStatus } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});

cron.schedule("0 0 * * *", async () => {
  console.log("Running daily subscription expiration check...");

  try {
    // Fetch subscriptions that have expired
    const expiredSubscriptions = await prisma.subscriptionPlan.findMany({
      where: {
        endDate: {
          lt: new Date(), // Get subscriptions where the end date is in the past
        },
        status: "ACTIVE", // Only check active subscriptions
      },
    });

    // Update the status of expired subscriptions
    for (const subscription of expiredSubscriptions) {
      await prisma.subscriptionPlan.update({
        where: { id: subscription.id },
        data: { status: "CANCELLED" },
      });

      console.log(
        `Subscription with ID ${subscription.id} has expired and was canceled.`
      );
    }
  } catch (error) {
    console.error("Error during subscription expiration check:", error);
  }
});

export const createPayment = async (
  userId: string,
  payload: {
    subscriptionPlanId: string;
    paymentMethodId: string;
  }
) => {
  const { subscriptionPlanId, paymentMethodId } = payload;
  // Fetch user details
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      stripeCustomerId: true,
    },
  });

  if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  // Fetch subscription plan details
  const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
    where: { id: subscriptionPlanId },
    select: {
      id: true,
      priceId: true,
      name: true,
    },
  });

  if (!subscriptionPlan)
    throw new ApiError(httpStatus.NOT_FOUND, "Subscription plan not found");

  let customerId = user?.stripeCustomerId as string;

  // Check and cancel the user's existing local subscription
  const existingSubscription = await prisma.subscriptionPlan.findFirst({
    where: { id: subscriptionPlanId, status: "ACTIVE" },
  });

  if (existingSubscription) {
    await prisma.subscriptionPlan.update({
      where: { id: existingSubscription.id },
      data: { status: "CANCELLED" },
    });
  }

  // Handle active Stripe subscriptions
  if (!customerId) {
    // Create a new customer in Stripe
    const customer = await stripe.customers.create({
      metadata: {
        userId: userId,
      },
    });
    let customerId = customer.id;

    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: customerId,
      },
    });
  } else {
    // List and cancel active Stripe subscriptions
    const stripeSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
    });

    for (const sub of stripeSubscriptions.data) {
      await stripe.subscriptions.cancel(sub.id);
    }
  }

  // Attach the payment method to the customer
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId as string,
  });

  // Set the payment method as the default
  await stripe.customers.update(customerId, {
    invoice_settings: { default_payment_method: paymentMethodId as string },
  });

  // Create a new subscription in Stripe
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: subscriptionPlan.priceId as string }],
    default_payment_method: paymentMethodId,
    expand: ["latest_invoice.payment_intent"], // Include payment details
  });

  const paymentIntent = (subscription.latest_invoice as any)?.payment_intent;

  // Save payment information in the Payment table
  const payment = await prisma.subscriptionPlan.create({
    data: {
      userId: userId,
      amount: subscriptionPlan.priceId,
      paymentMethod: paymentMethodId,
      cardName: "Card Name", // Extract from payment method if available
      billingZipCode: "ZipCode", // Extract from payment details
      securityCode: "", // Never store sensitive details
    },
  });

  // Save the new subscription in the Subscription table
  const newSubscription = await prisma.subscriptionPlan.create({
    data: {
      userId: userId,
      planID: subscriptionPlan.id,
      priceId: subscriptionPlan.priceId,
      status: subscription.status.toUpperCase() as SubscriptionStatus,
      startDate: new Date(),
      endDate: new Date(subscription.current_period_end * 1000),
      renewedAt: null,
    },
  });

  // Return details for confirmation
  return {
    subscriptionId: newSubscription.id,
    amount: subscriptionPlan.priceId,
    currency: "USD",
    status: paymentIntent?.status || subscription.status,
    paymentId: payment.id,
  };
};

export const PaymentServices = { createPayment };

import { Request, Response } from "express";
import stripe from "stripe";
import prisma from "../../../shared/prisma";

export const webhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.sendStatus(400);
  }

  // Handle the event
  switch (event.type) {
    case "invoice.payment_succeeded":
      const invoice = event.data.object;
      await handlePaymentSucceeded(invoice);
      break;
    case "invoice.payment_failed":
      const failedInvoice = event.data.object;
      await handlePaymentFailed(failedInvoice);
      break;
    case "customer.subscription.updated":
      const subscription = event.data.object;
      await handleSubscriptionUpdated(subscription);
      break;
    case "customer.subscription.deleted":
      const deletedSubscription = event.data.object;
      await handleSubscriptionDeleted(deletedSubscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.sendStatus(200);
};

// Handler functions
const handlePaymentSucceeded = async (invoice) => {
  // Update your database to reflect the successful payment
  const subscriptionId = invoice.subscription;
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: "ACTIVE" },
  });
};

const handlePaymentFailed = async (invoice) => {
  // Update your database to reflect the failed payment
  const subscriptionId = invoice.subscription;
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: "PAST_DUE" },
  });
};

const handleSubscriptionUpdated = async (subscription) => {
  // Update your database to reflect the subscription update
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status.toUpperCase(),
      startDate: new Date(subscription.current_period_start * 1000),
      endDate: new Date(subscription.current_period_end * 1000),
    },
  });
};

const handleSubscriptionDeleted = async (subscription) => {
  // Update your database to reflect the subscription deletion
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: { status: "CANCELED" },
  });
};

export const SubscriptionWebhook = {
  webhookHandler,
  handlePaymentSucceeded,
  handlePaymentFailed,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
};

import Stripe from "stripe";
import config from "../../../config";

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: "2025-01-27.acacia",
});

export const createStripeCustomer = async (email: string, name?: string) => {
  return stripe.customers.create({
    email,
    name,
  });
};

export const createCheckoutSession = async (
  customerId: string,
  priceId: string,
  isYearly: boolean
) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    subscription_data: {
      trial_period_days: isYearly ? 7 : undefined,
    },
  });

  return session;
};

export const constructWebhookEvent = (body: Buffer, signature: string) => {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    config.stripe_webhook_secret as string
  );
};

import { Request, Response } from "express";
import prisma from "../../../shared/prisma";

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { planId } = req.body;
    const user = req.user; // Assuming authenticated user

    // Get plan details
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) return res.status(404).send("Plan not found");

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripeService.createStripeCustomer(
        user.email,
        user.name
      );
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await stripeService.createCheckoutSession(
      customerId,
      plan.stripePriceId,
      plan.type === "YEARLY"
    );

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  const payload = req.body;

  try {
    const event = stripeService.constructWebhookEvent(payload, sig);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const plan = await subscriptionService.getPlanByPriceId(
          subscription.items.data[0].price.id
        );

        if (!plan) break;

        await subscriptionService.createSubscription(
          subscription.customer as string,
          plan.id,
          subscription.id,
          new Date(subscription.current_period_end * 1000)
        );
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: invoice.subscription as string },
        });

        if (subscription) {
          await subscriptionService.updateSubscription(
            invoice.subscription as string,
            new Date(invoice.period_end * 1000),
            "active"
          );
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await subscriptionService.updateSubscription(
          invoice.subscription as string,
          new Date(invoice.period_end * 1000),
          "past_due"
        );
        break;
      }
    }

    res.status(200).send();
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

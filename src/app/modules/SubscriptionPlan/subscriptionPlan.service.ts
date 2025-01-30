import prisma from "../../../shared/prisma";
export const createSubscription = async (
  userId: string,
  planId: string,
  stripeSubscriptionId: string,
  currentPeriodEnd: Date
) => {
  return prisma.subscription.create({
    data: {
      userId,
      planId,
      status: "ACTIVE",
      currentPeriodEnd,
      stripeSubscriptionId,
    },
  });
};

export const updateSubscription = async (
  stripeSubscriptionId: string,
  currentPeriodEnd: Date,
  status: string
) => {
  return prisma.subscription.update({
    where: { stripeSubscriptionId },
    data: { currentPeriodEnd, status },
  });
};

export const getPlanByPriceId = async (priceId: string) => {
  return prisma.subscriptionPlan.findFirst({
    where: { stripePriceId: priceId },
  });
};

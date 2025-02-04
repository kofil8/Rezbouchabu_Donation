import stripe from "../../helpars/stripe";
import logger from "../logger";

export const createTestPaymentMethod = async () => {
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: "5400741928159189",
        exp_month: 8,
        exp_year: 2028,
        cvc: "394",
      },
    });
    logger.info("PaymentMethod ID:", paymentMethod.id);
    return paymentMethod.id;
  } catch (error) {
    console.error("Error creating PaymentMethod:", error);
  }
};

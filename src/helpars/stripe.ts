import Stripe from "stripe";

console.log("Initializing Stripe with API version 2022-11-15");
const stripe = new Stripe("your-secret-key", {
  apiVersion: "2025-01-27.acacia",
});

console.log("Stripe initialized successfully");

export default stripe;

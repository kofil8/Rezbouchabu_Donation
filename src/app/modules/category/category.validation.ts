import z from "zod";

const category = z.string({
  required_error: "Category is required!",
});

export const CategoryValidations = {
  category,
};

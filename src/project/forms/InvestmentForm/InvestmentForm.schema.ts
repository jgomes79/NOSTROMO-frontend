import { z } from "zod";
/**
 * Schema for investment form validation.
 * Defines the required fields and validation rules for investment submissions.
 */
export const InvestmentFormSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a valid number" })
    .nonnegative("Amount must be a positive number")
    .min(0.01, "Amount must be greater than 0.01")
    .refine((val) => val > 0, { message: "Amount is required" }),
});

import { z } from "zod";

import { Currency } from "@/currency/currency.types";
import { Tier } from "@/tier/tier.types";

import { InvestmentFormSchema } from "./InvestmentForm.schema";

/**
 * Type definition for the values derived from the InvestmentFormSchema using Zod's infer method.
 * Represents the structure of the investment form data.
 */
export type InvestmentFormValues = z.infer<typeof InvestmentFormSchema>;

/**
 * Type definition for the properties expected by the InvestmentForm component.
 *
 * @property {boolean} isLoading - Indicates if the form is in a loading state.
 * @property {Object} user - The user information including tier and investment limits.
 * @property {Object} user.tier - The user's current tier information.
 * @property {string} user.tier.id - The ID of the user's tier.
 * @property {string} user.tier.name - The name of the user's tier.
 * @property {number} user.maxInvestment - The maximum amount the user can invest.
 * @property {(data: InvestmentFormValues) => void} onSubmit - Callback function that executes upon form submission with the form data.
 */
export interface InvestmentFormProps {
  readonly user: {
    tier: Pick<Tier, "id" | "name">;
    maxInvestment: number;
  };
  readonly token: {
    price: number;
    currency: Pick<Currency, "id" | "name">;
  };

  readonly isLoading: boolean;
  readonly onSubmit: (data: InvestmentFormValues) => void;
}

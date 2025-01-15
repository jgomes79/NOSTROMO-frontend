import { z } from "zod";

import { CurrencySchema } from "./currency.schema";

/**
 * Type for the Currency, inferred from the schema.
 */
export type Currency = z.infer<typeof CurrencySchema>;

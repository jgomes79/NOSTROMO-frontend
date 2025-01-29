import { z } from "zod";

import { TierSchema } from "./tier.schema";

/**
 * Enum representing the different tiers.
 */
export enum Tiers {
  TIER_NONE = 1,
  TIER_FACEHUGGER = 2,
  TIER_CHESTBURST = 3,
  TIER_DOG = 4,
  TIER_XENOMORPH = 5,
  TIER_WARRIOR = 6,
}

/**
 * Type representing a Tier, inferred from the TierSchema.
 * This type defines the structure of a tier based on the Zod schema validation.
 */
export type Tier = z.infer<typeof TierSchema>;

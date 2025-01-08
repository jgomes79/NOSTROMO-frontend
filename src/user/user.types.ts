import { z } from "zod";

import { UserSchema } from "./user.schema";

/**
 * Enum representing the different user tiers.
 */
export enum UserTiers {
  TIER_0 = "tier_0",
  TIER_1 = "tier_1",
  TIER_2 = "tier_2",
  TIER_3 = "tier_3",
}

/**
 * Enum representing the different user types.
 */
export enum UserTypes {
  USER = "user",
  ADMIN = "admin",
}

/**
 * Type representing a User, inferred from the UserSchema.
 */
export type User = z.infer<typeof UserSchema>;

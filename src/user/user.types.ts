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
  TIER_4 = "tier_4",
}

/**
 * Enum representing the different user types.
 */
export enum UserTypes {
  USER = "user",
  ADMIN = "admin",
}

/**
 * Enum representing the different tabs available in the user settings.
 *
 * @enum {string}
 * @property {string} TIER - Tab for managing user tier settings
 * @property {string} MY_PROJECTS - Tab for viewing and managing user projects
 * @property {string} CLAIM_TOKENS - Tab for token claim functionality
 */
export enum UserSettingsTabs {
  TIER = "tier",
  MY_PROJECTS = "my-projects",
  CLAIM_TOKENS = "claim-tokens",
}
/**
 * Type representing a User, inferred from the UserSchema.
 */
export type User = z.infer<typeof UserSchema>;

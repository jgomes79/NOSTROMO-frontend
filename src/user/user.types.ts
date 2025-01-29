import { z } from "zod";

import { UserSchema } from "./user.schema";

/**
 * Enum representing the different user tiers.
 */
export enum UserTiers {
  TIER_NONE = 1,
  TIER_FACEHUGGER = 2,
  TIER_CHESTBURST = 3,
  TIER_DOG = 4,
  TIER_XENOMORPH = 5,
  TIER_WARRIOR = 6,
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

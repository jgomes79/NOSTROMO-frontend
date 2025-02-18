import { z } from "zod";

import { UserSchema } from "./user.schema";

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
  MY_TIER = "my-tier",
  CHANGE_TIER = "change-tier",
  MY_PROJECTS = "my-projects",
  CLAIM_TOKENS = "claim-tokens",
}

/**
 * Type representing a User, inferred from the UserSchema.
 */
export type User = z.infer<typeof UserSchema>;

import { UserTiers } from "./user.types";

/**
 * The name of the user module.
 *
 * @type {string}
 */
export const MODULE_USER = "user";

/**
 * Routes configuration for the user module.
 *
 * @type {Object}
 * @property {string} MAIN - The main route for user-related pages.
 * @property {string} SETTINGS - The route for user settings page with an optional tabId parameter.
 */
export const USER_ROUTES = {
  MAIN: "/user",
  SETTINGS: "/user/settings/:tabId?",
};

/**
 * Mapping of user tiers to their respective names.
 *
 * @type {Object}
 * @property {string} TIER_0 - The name for tier 0 users.
 * @property {string} TIER_1 - The name for tier 1 users.
 * @property {string} TIER_2 - The name for tier 2 users.
 * @property {string} TIER_3 - The name for tier 3 users.
 * @property {string} TIER_4 - The name for tier 4 users.
 */
export const TIER_NAMES = {
  [UserTiers.TIER_0]: "Facehugger",
  [UserTiers.TIER_1]: "Chestburst",
  [UserTiers.TIER_2]: "Dog",
  [UserTiers.TIER_3]: "Xenomorph",
  [UserTiers.TIER_4]: "Warrior",
};

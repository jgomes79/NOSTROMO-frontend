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
 * @property {string} TIER_NONE - The name for tier 1 users.
 * @property {string} TIER_FACEHUGGER - The name for tier 2 users.
 * @property {string} TIER_CHESTBURST - The name for tier 3 users.
 * @property {string} TIER_DOG - The name for tier 4 users.
 * @property {string} TIER_XENOMORPH - The name for tier 5 users.
 * @property {string} TIER_WARRIOR - The name for tier 6 users.
 */
export const TIER_NAMES = {
  [UserTiers.TIER_NONE]: "None",
  [UserTiers.TIER_FACEHUGGER]: "Facehugger",
  [UserTiers.TIER_CHESTBURST]: "Chestburst",
  [UserTiers.TIER_DOG]: "Dog",
  [UserTiers.TIER_XENOMORPH]: "Xenomorph",
  [UserTiers.TIER_WARRIOR]: "Warrior",
};

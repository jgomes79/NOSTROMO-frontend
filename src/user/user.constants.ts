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

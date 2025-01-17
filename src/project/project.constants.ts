/**
 * Represents the project module name.
 *
 * @constant
 * @type {string}
 */
export const MODULE_PROJECT = "project";

/**
 * Defines the routes for the project module.
 *
 * @constant
 * @type {Object}
 * @property {string} MAIN - The main route for accessing projects.
 * @property {string} DETAILS - The route for accessing project details, including slug and tab parameters.
 * @property {string} NEW_PROJECT - The route for creating a new project.
 */
export const PROJECT_ROUTES = {
  MAIN: "/projects",
  PROJECT_DETAILS: "/projects/:slug",
  NEW_PROJECT_INIT: "/projects/new/:slug?",
  EDIT_PROJECT: "/projects/:slug/edit",
};

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
 * @property {string} PROJECT_DETAILS - The route for accessing project details, including slug parameter.
 * @property {string} NEW_PROJECT - The route for creating a new project.
 * @property {string} EDIT_PROJECT - The route for editing an existing project, including slug parameter.
 */
export const PROJECT_ROUTES = {
  MAIN: "/projects",
  PROJECT_DETAILS: "/projects/:slug",
  NEW_PROJECT: "/projects/new",
  EDIT_PROJECT: "/projects/:slug/edit",
};

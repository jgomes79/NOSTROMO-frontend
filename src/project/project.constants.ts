import { ProjectDetailsTabs } from "./project.types";

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
  PROJECT_DETAILS: "/projects/:slug/:tab",
  NEW_PROJECT: "/projects/new",
};

/**
 * Lists the project tabs with their respective IDs and labels.
 *
 * @constant
 * @type {Array<{ id: ProjectDetailsTabs, label: string }>}
 * @property {ProjectDetailsTabs} id - The unique identifier for each project tab.
 * @property {string} label - The display label for each project tab.
 */
export const PROJECT_RETAILS_TABS = [
  {
    id: ProjectDetailsTabs.INFORMATION,
    label: "Information",
  },
  {
    id: ProjectDetailsTabs.RAISING_INFORMATION,
    label: "Raising Information",
  },
  {
    id: ProjectDetailsTabs.TOKEN_INFORMATION,
    label: "Token Information",
  },
  {
    id: ProjectDetailsTabs.VESTING_OPTIONS,
    label: "Vesting Options",
  },
  {
    id: ProjectDetailsTabs.STAKE_OPTIONS,
    label: "Stake Options",
  },
  {
    id: ProjectDetailsTabs.PAYMENT_RULES,
    label: "Payment Rules",
  },
];

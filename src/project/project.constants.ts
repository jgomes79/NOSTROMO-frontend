import { ProjectFormTabs, ProjectStates } from "./project.types";

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
  PROJECT_DETAILS: "/projects/:slug/:tabId?",
  NEW_PROJECT: "/projects/new",
  EDIT_PROJECT: "/projects/:slug/edit",
};

/**
 * Maps project states to their string representation without spaces
 */
export const PROJECT_STATE_STRING: { [key in ProjectStates]: string } = {
  [ProjectStates.ALL]: "all",
  [ProjectStates.DRAFT]: "draft",
  [ProjectStates.SENT_TO_REVIEW]: "senttoreview",
  [ProjectStates.REQUEST_MORE_INFO]: "requestmoreinfo",
  [ProjectStates.PENDING_TO_CREATE]: "pendingtocreate",
  [ProjectStates.READY_TO_VOTE]: "readytovote",
  [ProjectStates.REJECTED]: "rejected",
  [ProjectStates.UPCOMING]: "upcoming",
  [ProjectStates.FUNDING_PHASE_1]: "fundingphase1",
  [ProjectStates.FUNDING_PHASE_2]: "fundingphase2",
  [ProjectStates.FUNDING_PHASE_3]: "fundingphase3",
  [ProjectStates.CLOSED]: "closed",
  [ProjectStates.FAILED]: "failed",
};

/**
 * Labels for the project form tabs.
 */
export const ProjectTabLabels = {
  [ProjectFormTabs.BASIC_INFORMATION]: "Basic information",
  [ProjectFormTabs.SOCIAL_NETWORKS]: "Social Networks",
  [ProjectFormTabs.DOCUMENTATION]: "Documentation",
  [ProjectFormTabs.RAISING_FUNDS]: "Raising Funds",
  [ProjectFormTabs.TOKEN_INFORMATION]: "Token Information",
  [ProjectFormTabs.VESTING_OPTIONS]: "Vesting Options",
};

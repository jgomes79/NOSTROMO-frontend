import { ProjectStates } from "@/project/project.types";

/**
 * The module name for the launchpad feature.
 * @constant {string}
 */
export const MODULE_LAUNCHPAD = "launchpad";

/**
 * Routes related to the launchpad feature.
 * @constant {Object}
 * @property {string} MAIN - The main route for the launchpad.
 */
export const LAUNCHPAD_ROUTES = {
  MAIN: "/launchpad",
};

/**
 * Tabs representing different project states in the launchpad.
 * @constant {Array<{ id: ProjectStates, label: string }>}
 * @typedef {Object} ProjectTab
 * @property {ProjectStates} id - The state of the project.
 * @property {string} label - The display label for the tab.
 */
export const launchpadProjectTabs: Array<{ id: ProjectStates; label: string }> = [
  {
    id: ProjectStates.FUNDING_PHASE_1,
    label: "Active",
  },
  {
    id: ProjectStates.UPCOMING,
    label: "Upcoming",
  },
  {
    id: ProjectStates.CLOSED,
    label: "Closed",
  },
];

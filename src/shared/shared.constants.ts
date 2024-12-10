import { LAUNCHPAD_ROUTES } from "@/launchpad/launchpad.constants";

export const MODULE_SHARED = "shared";

/**
 * Navigation menu items for the application.
 * Each item contains a title and a path.
 */
export const navigationMenu = [
  {
    title: "IDO Launchpad",
    path: LAUNCHPAD_ROUTES.MAIN,
  },
  {
    title: "Stake / Farm",
    path: "/",
  },
];

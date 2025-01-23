import { RouteObject } from "react-router-dom";

import { registerModule } from "@/core/modules/modules.helpers";
import { AppLayout } from "@/shared/layouts/AppLayout";

import { UserSettingsPage } from "./pages/UserSettingsPage";
import { MODULE_USER, USER_ROUTES } from "./user.constants";

/**
 * Routes configuration for the user module.
 * Defines the routing structure for user-related pages.
 *
 * @type {RouteObject[]}
 * @property {string} path - The base path for user routes
 * @property {JSX.Element} element - The layout component for user routes
 * @property {Object[]} children - Nested routes for user module
 * @property {string} children[].path - Path for settings page
 * @property {JSX.Element} children[].element - Component for settings page
 */
const routes: RouteObject[] = [
  {
    path: USER_ROUTES.MAIN,
    element: <AppLayout />,
    children: [
      {
        path: USER_ROUTES.SETTINGS,
        element: <UserSettingsPage />,
      },
    ],
  },
];

registerModule({
  name: MODULE_USER,
  routes,
});

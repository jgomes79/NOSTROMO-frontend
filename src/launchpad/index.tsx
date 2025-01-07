import { RouteObject } from "react-router-dom";

import { registerModule } from "@/core/modules/modules.helpers";
import { AppLayout } from "@/shared/layouts/AppLayout";

import { LAUNCHPAD_ROUTES, MODULE_LAUNCHPAD } from "./launchpad.constants";
import { LaunchpadPage } from "./pages/LaunchpadPage";

const routes: RouteObject[] = [
  {
    path: LAUNCHPAD_ROUTES.MAIN,
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <LaunchpadPage />,
      },
    ],
  },
];

registerModule({
  name: MODULE_LAUNCHPAD,
  routes,
});

import { RouteObject } from "react-router-dom";

import { registerModule } from "@/core/modules/modules.helpers";
import { AppLayout } from "@/shared/layouts/AppLayout";

import { LAUNCHPAD_ROUTES, MODULE_LAUNCHPAD } from "./launchpad.constants";
import { Launchpad } from "./pages/Launchpad";

const routes: RouteObject[] = [
  {
    path: LAUNCHPAD_ROUTES.MAIN,
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <Launchpad />,
      },
    ],
  },
];

registerModule({
  name: MODULE_LAUNCHPAD,
  routes,
});

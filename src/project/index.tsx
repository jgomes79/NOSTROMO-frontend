import { RouteObject } from "react-router-dom";

import { registerModule } from "@/core/modules/modules.helpers";
import { AppLayout } from "@/shared/layouts/AppLayout";

import { CreateOrEditProjectPage } from "./pages/CreateOrEditProjectPage";
import { ProjectDetailsPage } from "./pages/ProjectDetailsPage";
import { MODULE_PROJECT, PROJECT_ROUTES } from "./project.constants";

const routes: RouteObject[] = [
  {
    path: PROJECT_ROUTES.MAIN,
    element: <AppLayout />,
    children: [
      {
        path: PROJECT_ROUTES.PROJECT_DETAILS,
        element: <ProjectDetailsPage />,
      },
      {
        path: PROJECT_ROUTES.NEW_PROJECT_INIT,
        element: <CreateOrEditProjectPage />,
      },
      {
        path: PROJECT_ROUTES.EDIT_PROJECT,
        element: <CreateOrEditProjectPage />,
      },
    ],
  },
];

registerModule({
  name: MODULE_PROJECT,
  routes,
});

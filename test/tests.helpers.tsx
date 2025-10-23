/* eslint-disable react-refresh/only-export-components */
import { MemoryRouter, RouterProvider, createMemoryRouter } from "react-router-dom";

import { RenderOptions, render } from "@testing-library/react";

import { AppProviders } from "@/core/components/AppProviders";
import { getAllRoutes } from "@/core/modules/modules.helpers";

export function TestProviders({ children }: { readonly children: React.ReactNode }) {
  return (
    <AppProviders>
      <MemoryRouter>{children}</MemoryRouter>
    </AppProviders>
  );
}

export function TestApp({ initialEntries }: { readonly initialEntries?: string[] }) {
  const router = createMemoryRouter(getAllRoutes(), {
    initialEntries,
  });

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export const renderWithTestProviders = (ui: React.ReactElement, options?: RenderOptions) => {
  return render(ui, { wrapper: TestProviders, ...options });
};

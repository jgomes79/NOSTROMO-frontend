import { Outlet } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { I18nProvider } from "@/i18n/i18n.provider";
import { WalletProvider } from "@/wallet/wallet.provider";

import { ModalProvider } from "../modals/ModalProvider";
import { queryClient as defaultQueryClient } from "../queryClient";
import { ToastProvider } from "../toasts/ToastProvider";

interface AppProvidersProps {
  readonly queryClient?: QueryClient;
  readonly children?: React.ReactNode;
}

/**
 * AppProviders component that sets up the application-wide providers.
 *
 * @param {AppProvidersProps} props - The properties object.
 * @param {QueryClient} [props.queryClient=defaultQueryClient] - The QueryClient instance to be used by react-query.
 * @param {React.ReactNode} [props.children] - Children elements to be rendered inside the provider.
 *
 * @returns {JSX.Element} The providers wrapped around the app.
 */
export function AppProviders({ queryClient = defaultQueryClient, children }: AppProvidersProps): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <I18nProvider>
          <ModalProvider>
            <ToastProvider>{children ? children : <Outlet />}</ToastProvider>
          </ModalProvider>
        </I18nProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

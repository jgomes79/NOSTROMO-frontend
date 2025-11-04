import React from "react";

import { QubicConnectProvider } from "./qubic/QubicConnectContext";
import { WalletConnectProvider } from "./qubic/WalletConnectContext";

/**
 * Interface for WalletProvider component props
 * @interface WalletProviderProps
 * @property {React.ReactNode} children - Child components to be wrapped by the wallet providers
 */
interface WalletProviderProps {
  readonly children: React.ReactNode;
}

/**
 * WalletProvider component - Provides the context for wallet-related functionality.
 * Wraps the children components with WagmiProvider and RainbowKitProvider.
 *
 * @param {Object} props - The properties for the WalletProvider component.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the providers.
 * @returns {React.ReactElement} The rendered WalletProvider component.
 */
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => (
  <WalletConnectProvider>
    <QubicConnectProvider>{children}</QubicConnectProvider>
  </WalletConnectProvider>
);

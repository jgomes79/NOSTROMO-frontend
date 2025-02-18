import React, { ReactNode, useEffect } from "react";
import { Outlet } from "react-router-dom";

import { useErrorInterceptor } from "@/core/errors/hooks/useErrorInterceptor";
import { AppBar } from "@/shared/components/AppBar";
import { Footer } from "@/shared/components/Footer";
import { ScrollToTop } from "@/shared/components/ScrollToTop";

import styles from "./AppLayout.module.scss";

/**
 * Props for the AppLayout component.
 */
export interface AppLayoutProps {
  /**
   * Optional children elements to be rendered within the layout.
   */
  readonly children?: ReactNode;
}

/**
 * AppLayout component - Provides the layout structure for authenticated pages.
 * Includes an optional header and an Outlet for nested routes.
 *
 * @param {AppLayoutProps} props - The properties for the AppLayout component.
 * @returns {React.ReactElement} The rendered AppLayout component.
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }: AppLayoutProps): React.ReactElement => {
  const { configureErrorInterceptors } = useErrorInterceptor();

  /**
   * Effect to configure error interceptors on component mount.
   */
  useEffect(() => {
    configureErrorInterceptors();
  }, []);

  return (
    <div className={styles.container}>
      <AppBar />
      <ScrollToTop />
      <main>
        <Outlet />
        {children}
      </main>
      <Footer />
    </div>
  );
};

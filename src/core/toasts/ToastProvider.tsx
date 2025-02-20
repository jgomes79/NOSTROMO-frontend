import React from "react";

import { ToastsList } from "./components/ToastsList";
import { useToast } from "./hooks/useToast";

/**
 * Properties for the ToastProvider component.
 *
 * @interface ToastProviderProps
 * @property {React.ReactNode} children - The child components to be rendered within the ToastProvider.
 */
interface ToastProviderProps {
  readonly children: React.ReactNode;
}

/**
 * ToastProvider component that provides toast notification functionality to its children.
 *
 * This component renders a list of toast notifications and wraps its children.
 *
 * @param {ToastProviderProps} props - The properties for the ToastProvider component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the ToastProvider.
 * @returns {JSX.Element} The rendered ToastProvider component.
 *
 * @example
 * <ToastProvider>
 *   <YourComponent />
 * </ToastProvider>
 *
 * In this example, <YourComponent /> will have access to the toast notifications provided by the ToastProvider.
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toasts } = useToast();

  return (
    <>
      <ToastsList data={toasts} />
      {children}
    </>
  );
};

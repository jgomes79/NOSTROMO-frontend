import React from "react";

import styles from "./Backdrop.module.scss";

/**
 * Properties for the Backdrop component.
 *
 * @interface BackdropProps
 * @property {React.ReactNode} children - The child components to be rendered within the Backdrop.
 */
interface BackdropProps {
  readonly children: React.ReactNode;
}

/**
 * Backdrop component that serves as a visual overlay for modals.
 *
 * @param {BackdropProps} props - The properties for the Backdrop component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the Backdrop.
 * @returns {JSX.Element} The rendered Backdrop component.
 */
export const Backdrop: React.FC<BackdropProps> = ({ children }) => {
  return <div className={styles.layout}>{children}</div>;
};

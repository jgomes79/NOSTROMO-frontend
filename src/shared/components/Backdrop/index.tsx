import React, { ReactNode } from "react";

import classNames from "clsx";

import styles from "./Backdrop.module.scss";

/**
 * Props for the Backdrop component.
 */
interface BackdropProps {
  /**
   * The children of the component.
   */
  readonly children: ReactNode;
  /**
   * The variant of the backdrop.
   */
  readonly variant?: "dialog" | "default";
}

/**
 * Backdrop component - A full-screen overlay with a blurred background, typically used for modals or loading screens.
 *
 * @param {BackdropProps} props - The properties for the Backdrop component.
 * @returns {React.ReactElement} The rendered Backdrop component.
 */
export const Backdrop: React.FC<BackdropProps> = ({
  variant = "default",
  children,
}: BackdropProps): React.ReactElement => (
  <div className={classNames(styles.layout, styles[variant])}>
    <div className={styles.container}>{children}</div>
  </div>
);

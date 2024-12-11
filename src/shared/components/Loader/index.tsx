import React from "react";

import classNames from "clsx";

import styles from "./Loader.module.scss";

/**
 * Props for the Loader component.
 */
interface LoaderProps {
  /**
   * The visual style variant of the loader, either "default" or "full".
   */
  readonly variant?: "default" | "full";

  /**
   * The color of the loader, either "orange" or "gray".
   */
  readonly color?: "green" | "gray";

  /**
   * The size of the loader in pixels.
   */
  readonly size?: number;

  /**
   * Additional class names to apply to the loader.
   */
  readonly className?: string;
}

/**
 * Loader component that displays a loading animation.
 *
 * @param props - The properties passed to the Loader component.
 * @returns The Loader component with specified variant and size.
 */
export const Loader: React.FC<LoaderProps> = ({ color = "green", variant = "default", size = 42, className }) => (
  <div className={classNames(styles[variant], styles[color], className)}>
    <div
      className={styles.loader}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  </div>
);

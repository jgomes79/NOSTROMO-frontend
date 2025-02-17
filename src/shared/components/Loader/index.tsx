import React from "react";

import classNames from "clsx";

import styles from "./Loader.module.scss";

/**
 * Props for the Loader component.
 *
 * @param {Object} props - The properties for the Loader component.
 * @param {"default" | "full"} [props.variant="default"] - The visual style variant of the loader.
 * @param {"green" | "gray" | "inherit"} [props.color="green"] - The color of the loader.
 * @param {number} [props.size=42] - The size of the loader in pixels.
 * @param {string} [props.className] - Additional class names to apply to the loader.
 */
interface LoaderProps {
  readonly variant?: "default" | "full";
  readonly color?: "green" | "gray" | "inherit";
  readonly size?: number;
  readonly className?: string;
}

/**
 * Loader component that displays a loading animation.
 *
 * @param {LoaderProps} props - The properties passed to the Loader component.
 * @returns {JSX.Element} The Loader component with specified variant and size.
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

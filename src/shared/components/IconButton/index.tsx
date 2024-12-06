import React from "react";

import classNames from "clsx";

import styles from "./IconButton.module.scss";
import { Loader } from "../Loader";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  icon: React.ReactNode;
  isLoading?: boolean;
  variant?: "solid" | "outline" | "ghost";
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary";
}

/**
 * Index component with customizable icons, loading state, and styling variants.
 */
export const IconButton: React.FC<Readonly<IconButtonProps>> = ({
  type = "button",
  size = "medium",
  color = "primary",
  isLoading,
  icon,
  variant = "solid",
  disabled,
  className,
  ...props
}) => (
  <button
    aria-label="button"
    type={type}
    disabled={isLoading || disabled}
    className={classNames(
      styles.layout,
      isLoading && styles.withLoader,
      styles[variant],
      styles[size],
      styles[color],
      className,
    )}
    {...props}
  >
    <div className={styles.caption}>{icon}</div>

    {isLoading && (
      <div className={styles.loader}>
        <Loader size={22} />
      </div>
    )}
  </button>
);

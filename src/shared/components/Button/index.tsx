import React from "react";

import classNames from "clsx";

import styles from "./Button.module.scss";
import { Loader } from "../Loader";
import { Typography } from "../Typography";

/**
 * Props for the Button component.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Indicates if the button is in a loading state.
   */
  readonly isLoading?: boolean;
  /**
   * An optional icon to display on the left side of the button.
   */
  readonly iconLeft?: React.ReactNode;
  /**
   * An optional icon to display on the right side of the button.
   */
  readonly iconRight?: React.ReactNode;
  /**
   * The caption of the button.
   */
  readonly caption: string;
  /**
   * The color variant of the button.
   */
  readonly color?: "primary" | "secondary" | "yellow" | "red";
  /**
   * The size variant of the button.
   */
  readonly size?: "small" | "medium" | "large";
  /**
   * The styling variant of the button.
   */
  readonly variant?: "solid" | "outline" | "ghost";
  /**
   * The type of the button.
   */
  readonly type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
}

/**
 * Index component with customizable icons, loading state, and styling variants.
 */
export const Button: React.FC<Readonly<ButtonProps>> = ({
  type = "button",
  size = "medium",
  color = "primary",
  iconLeft,
  iconRight,
  isLoading,
  caption,
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
    {iconLeft && <div className={styles.icon}>{iconLeft}</div>}
    <div className={styles.caption}>
      <Typography variant={"label"} size={size}>
        {caption}
      </Typography>
    </div>
    {iconRight && <div className={styles.icon}>{iconRight}</div>}

    {isLoading && (
      <div className={styles.loader}>
        <Loader size={22} color={"inherit"} />
      </div>
    )}
  </button>
);

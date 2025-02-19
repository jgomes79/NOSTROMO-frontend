import React from "react";

import classNames from "clsx";

import styles from "./Button.module.scss";
import { Loader } from "../Loader";
import { Typography } from "../Typography";

/**
 * Props for the Button component.
 *
 * @property {boolean} [isLoading] - Indicates if the button is in a loading state.
 * @property {React.ReactNode} [iconLeft] - An optional icon to display on the left side of the button.
 * @property {React.ReactNode} [iconRight] - An optional icon to display on the right side of the button.
 * @property {string} caption - The caption of the button.
 * @property {"primary" | "secondary" | "warning" | "error" | "neutral"} [color] - The color variant of the button.
 * @property {"small" | "medium" | "large"} [size] - The size variant of the button.
 * @property {"solid" | "outline" | "ghost"} [variant] - The styling variant of the button.
 * @property {React.ButtonHTMLAttributes<HTMLButtonElement>["type"]} [type] - The type of the button.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly isLoading?: boolean;
  readonly iconLeft?: React.ReactNode;
  readonly iconRight?: React.ReactNode;
  readonly caption: string;
  readonly color?: "primary" | "secondary" | "warning" | "error" | "neutral";
  readonly size?: "small" | "medium" | "large";
  readonly variant?: "solid" | "outline" | "ghost";
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
    {isLoading && (
      <div className={styles.loader}>
        <Loader size={22} color={"inherit"} />
      </div>
    )}

    <div className={styles.content}>
      {iconLeft && iconLeft}
      <Typography variant={"button"} size={size}>
        {caption}
      </Typography>
      {iconRight && iconRight}
    </div>
  </button>
);

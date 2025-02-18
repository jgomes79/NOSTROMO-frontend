import React from "react";

import classNames from "clsx";

import styles from "./IconButton.module.scss";
import { Loader } from "../Loader";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The type of the button, which determines its behavior.
   * Defaults to "button".
   */
  readonly type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];

  /**
   * The icon to be displayed within the button.
   */
  readonly icon: React.ReactNode;

  /**
   * Indicates whether the button is in a loading state.
   * If true, the button will be disabled and show a loader.
   */
  readonly isLoading?: boolean;

  /**
   * The visual style of the button.
   * Can be "solid", "outline", or "ghost".
   */
  readonly variant?: "solid" | "outline" | "ghost";

  /**
   * The size of the button.
   * Can be "small", "medium", or "large".
   */
  readonly size?: "small" | "medium" | "large";

  /**
   * The color scheme of the button.
   * Can be "primary" or "secondary".
   */
  readonly color?: "primary" | "secondary";
}

/**
 * A customizable button component that supports icons, loading states,
 * and various styling options.
 *
 * @param {IconButtonProps} props - The properties for the IconButton component.
 * @returns {JSX.Element} The rendered IconButton component.
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
    className={classNames(styles.layout, styles[variant], styles[size], styles[color], className)}
    {...props}
  >
    {isLoading ? <Loader /> : icon}
  </button>
);

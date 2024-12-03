import React, { CSSProperties } from "react";

import classNames from "clsx";

import styles from "./Typography.module.scss";

export interface TypographyProps {
  /**
   * Specifies the visual style of the text.
   * - 'heading': For headings.
   * - 'body': For standard body text.
   * - 'label': For label text.
   */
  readonly variant?: "heading" | "body" | "label";

  /**
   * Specifies the size of the text.
   * - 'xlarge': Extra large text.
   * - 'large': Large text.
   * - 'medium': Medium text (default).
   * - 'small': Small text.
   * - 'xsmall': Extra small text.
   */
  readonly size?: "xlarge" | "large" | "medium" | "small" | "xsmall";

  /**
   * Specifies the text transformation.
   * - 'none': No transformation (default).
   * - 'uppercase': Transform text to uppercase.
   * - 'lowercase': Transform text to lowercase.
   * - 'capitalize': Capitalize first letter of each word.
   */
  readonly textTransform?: CSSProperties["textTransform"];

  /**
   * The content to be rendered inside the Typography component.
   */
  readonly children: React.ReactNode | string | number;

  /**
   * The HTML tag or React component to render. Defaults to 'span'.
   */
  readonly as?: keyof JSX.IntrinsicElements;

  /**
   * Sets the text alignment. Defaults to 'left'.
   */
  readonly textAlign?: CSSProperties["textAlign"];

  /**
   * Additional CSS class names to apply to the component.
   */
  readonly className?: string;
}

/**
 * Typography component for rendering text with consistent styles.
 *
 * @param {TypographyProps} props - The properties of the Typography component.
 * @returns {React.ReactElement} The rendered React element.
 */
export const Typography: React.FC<Readonly<TypographyProps>> = ({
  variant = "body",
  size = "medium",
  textAlign = "left",
  textTransform = "none",
  children,
  className,
  as: Component = "span",
}: TypographyProps): React.ReactElement => (
  <Component className={classNames(styles[variant], styles[size], className)} style={{ textAlign, textTransform }}>
    {children}
  </Component>
);

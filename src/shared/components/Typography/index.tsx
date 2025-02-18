import React, { CSSProperties } from "react";

import classNames from "clsx";

import styles from "./Typography.module.scss";

/**
 * Props for the Typography component.
 *
 * @property {("heading" | "body" | "label")} [variant] - Specifies the visual style of the text.
 * @property {("xxlarge" | "xlarge" | "large" | "medium" | "small" | "xsmall")} [size] - Specifies the size of the text.
 * @property {CSSProperties["textTransform"]} [textTransform] - Specifies the text transformation.
 * @property {React.ReactNode | string | number} children - The content to be rendered inside the Typography component.
 * @property {keyof JSX.IntrinsicElements} [as] - The HTML tag or React component to render. Defaults to 'span'.
 * @property {CSSProperties["textAlign"]} [textAlign] - Sets the text alignment. Defaults to 'left'.
 * @property {string} [className] - Additional CSS class names to apply to the component.
 */
export interface TypographyProps {
  readonly variant?: "heading" | "body" | "label" | "button";
  readonly size?: "xxlarge" | "xlarge" | "large" | "medium" | "small" | "xsmall";
  readonly textTransform?: CSSProperties["textTransform"];
  readonly children: React.ReactNode | string | number;
  readonly as?: keyof JSX.IntrinsicElements;
  readonly textAlign?: CSSProperties["textAlign"];
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

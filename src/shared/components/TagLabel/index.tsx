import React from "react";

import classNames from "clsx";

import styles from "./TagLabel.module.scss";
import { Typography } from "../Typography";

/**
 * Props for the TagLabel component.
 */
interface TagLabelProps {
  /**
   * Optional icon to be displayed alongside the label.
   */
  readonly icon?: React.ReactNode;

  /**
   * Text to be displayed as the label.
   */
  readonly text: string;

  /**
   * Color of the label. Can be "yellow", "green", or "red".
   */
  readonly color?: "yellow" | "green" | "red";
}

/**
 * TagLabel component.
 *
 * @param icon - Optional icon to be displayed alongside the label.
 * @param text - Text to be displayed as the label.
 * @param color - Color of the label. Defaults to "green".
 * @returns A JSX element representing the tag label.
 */
export const TagLabel: React.FC<TagLabelProps> = ({ icon, text, color = "green" }) => {
  return (
    <div className={classNames(styles.layout, styles[color])}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <Typography size={"small"} className={styles.label}>
        {text}
      </Typography>
    </div>
  );
};

import React from "react";

import classNames from "clsx";

import styles from "./TagLabel.module.scss";
import { Typography } from "../Typography";

/**
 * Props for the TagLabel component.
 *
 * @property {React.ReactNode} [icon] - Optional icon to be displayed alongside the label.
 * @property {string} text - Text to be displayed as the label.
 * @property {"yellow" | "green" | "red"} [color] - Color of the label. Can be "yellow", "green", or "red". Defaults to "green".
 */
interface TagLabelProps {
  readonly icon?: React.ReactNode;
  readonly text: string;
  readonly color?: "yellow" | "green" | "red";
}

/**
 * TagLabel component.
 *
 * @param {TagLabelProps} props - The properties for the TagLabel component.
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

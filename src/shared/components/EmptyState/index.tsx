import React from "react";

import { RiAliensFill } from "react-icons/ri";

import styles from "./EmptyState.module.scss";
import { Typography } from "../Typography";

/**
 * Props for the EmptyState component.
 */
interface EmptyStateProps {
  /**
   * The title to display in the empty state.
   */
  readonly title: string;

  /**
   * The description to display in the empty state.
   */
  readonly description: string;

  /**
   * Optional action element to display in the empty state.
   */
  readonly action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => {
  return (
    <div className={styles.layout}>
      <RiAliensFill className={styles.icon} />
      <div className={styles.content}>
        <Typography as={"h2"} variant={"heading"} size={"large"} textAlign={"center"}>
          {title}
        </Typography>
        <Typography as={"p"} size={"medium"} textAlign={"center"}>
          {description}
        </Typography>
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
};

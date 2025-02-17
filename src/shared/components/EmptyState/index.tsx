import React from "react";

import { TbDatabaseSearch } from "react-icons/tb";

import styles from "./EmptyState.module.scss";
import { Typography } from "../Typography";

/**
 * Props for the EmptyState component.
 */
interface EmptyStateProps {
  /**
   * The title of the empty state.
   */
  readonly title: string;

  /**
   * The description of the empty state.
   */
  readonly description: string;

  /**
   * The action of the empty state.
   */
  readonly action?: React.ReactNode;
}

/**
 * EmptyState component that displays a message when there is no data available.
 *
 * @param {EmptyStateProps} props - The props for the EmptyState component.
 * @param {string} props.title - The title to be displayed in the empty state.
 * @param {string} props.description - The description to provide more context about the empty state.
 * @param {React.ReactNode} [props.action] - Optional action element, such as a button, to be displayed.
 * @returns {JSX.Element} The rendered EmptyState component.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => {
  return (
    <div className={styles.layout}>
      <TbDatabaseSearch className={styles.icon} />
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

import React from "react";

import { Typography } from "@/shared/components/Typography";

import styles from "./ErrorPage.module.scss";

/**
 * Props for the ErrorPage component.
 */
interface ErrorPageProps {
  /**
   * Optional error code to display.
   */
  readonly code?: string | React.ReactNode;
  /**
   * Title of the error page.
   */
  readonly title: string;
  /**
   * Description of the error.
   */
  readonly description: string;
  /**
   * Optional actions to be displayed on the error page.
   */
  readonly actions?: React.ReactNode[];
}

/**
 * ErrorPage component - Renders a page to display error information.
 *
 * @param {ErrorPageProps} props - The properties for the ErrorPage component.
 * @returns {React.ReactElement} The rendered ErrorPage component.
 */
export const ErrorPage: React.FC<ErrorPageProps> = ({ code, title, description, actions = [] }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.field}>
        {code && (
          <Typography as="div" variant="heading" size="xlarge" className={styles.title} textAlign="center">
            {code}
          </Typography>
        )}
        <div className={styles.field}>
          <div>
            <Typography as="h1" variant="heading" size="large" textAlign="center">
              {title}
            </Typography>
            <Typography as="p" textAlign="center" size="medium">
              {description}
            </Typography>
          </div>
        </div>
        {(actions && actions.length) > 0 && (
          <footer className={styles.footer}>
            <div className={styles.actions}>{actions.map((action) => action)}</div>
          </footer>
        )}
      </div>
    </div>
  );
};

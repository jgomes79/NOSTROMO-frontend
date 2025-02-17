import React from "react";

import { Typography } from "@/shared/components/Typography";

import styles from "./ErrorPage.module.scss";

/**
 * Props for the ErrorPage component.
 *
 * @property {string | React.ReactNode} [code] - Optional error code to display.
 * @property {string} title - Title of the error page.
 * @property {string} description - Description of the error.
 * @property {React.ReactNode[]} [actions] - Optional actions to be displayed on the error page.
 */
interface ErrorPageProps {
  readonly code?: string | React.ReactNode;
  readonly title: string;
  readonly description: string;
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
          <Typography as="div" variant="heading" size="xxlarge" className={styles.title} textAlign="center">
            {code}
          </Typography>
        )}
        <div className={styles.field}>
          <div>
            <Typography as="h1" variant="heading" size="xlarge" textAlign="center">
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

import React from "react";

import classNames from "clsx";

import styles from "./Links.module.scss";

/**
 * Props for Loader component.
 * @param variant - The visual style variant of the loader, either "default" or "full".
 * @param size - The size of the loader in pixels.
 */
interface LinksProps {
  readonly className?: string;
  readonly data: Array<{
    path: string;
    icon: React.ReactNode;
  }>;
}

/**
 * Loader component that displays a loading animation.
 *
 * @param props - The properties passed to the Loader component.
 * @returns The Loader component with specified variant and size.
 */
export const Links: React.FC<LinksProps> = ({ className, data = [] }) => (
  <nav className={classNames(styles.layout, className)}>
    {data.map((link, index) => (
      <a href={link.path} target={"_blank"} className={styles.link} rel="noreferrer" key={`--link-${index.toString()}`}>
        {link.icon}
      </a>
    ))}
  </nav>
);

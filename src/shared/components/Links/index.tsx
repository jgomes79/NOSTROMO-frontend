import React from "react";

import classNames from "clsx";

import styles from "./Links.module.scss";
import { IconButton } from "../IconButton";

/**
 * Represents the properties for the Links component.
 *
 * @property {string} [className] - Optional class name to apply custom styles to the links.
 * @property {Array<{ path: string; icon: React.ReactNode }>} data - An array of link objects, each containing a path and an icon.
 */
interface LinksProps {
  readonly className?: string;
  readonly data: Array<{
    path: string;
    icon: React.ReactNode;
  }>;
}

/**
 * Links component that renders a set of navigation links with icons.
 *
 * @param {LinksProps} props - The properties for the Links component.
 * @returns {JSX.Element} The rendered Links component.
 */
export const Links: React.FC<LinksProps> = ({ className, data = [] }) => (
  <nav className={classNames(styles.layout, className)}>
    {data.map((link, index) => (
      <a href={link.path} target={"_blank"} rel="noreferrer" key={`--link-${index.toString()}`}>
        <IconButton variant={"ghost"} color={"primary"} size={"medium"} icon={link.icon} />
      </a>
    ))}
  </nav>
);

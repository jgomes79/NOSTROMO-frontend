import { useState } from "react";

import classNames from "clsx";

import useResponsive from "@/shared/hooks/useResponsive";

import styles from "./Tabs.module.scss";
import { Typography } from "../Typography";

interface Tab<T> {
  id: T;
  label: string;
}

/**
 * Props for the Tabs component.
 *
 * @template T - The type of the tab ID.
 */
interface TabsProps<T> {
  /**
   * An array of tab objects.
   */
  readonly tabs: Tab<T>[];

  /**
   * The ID of the active tab.
   */
  readonly activeId: T;

  /**
   * Optional callback function that is called when a tab is changed.
   *
   * @param {T} tabId - The ID of the selected tab.
   */
  readonly onChange?: (tabId: T) => void;

  /**
   * The content to render for the active tab.
   *
   * @type {React.ReactNode}
   */
  readonly onRender?: React.ReactNode;

  /**
   * The class name for the tabs container.
   */
  readonly itemClassName?: string;
}

export const Tabs = <T,>({ tabs, activeId, onChange, onRender, itemClassName }: TabsProps<T>) => {
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState(activeId);

  /**
   * Handles the click event for a tab.
   *
   * @param {Tab<T>["id"]} tabId - The ID of the tab to activate.
   */
  const handleClickTab = (tabId: Tab<T>["id"]) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={classNames(styles.tab, { [styles.active]: activeTab === tab.id })}
            onClick={() => handleClickTab(tab.id)}
          >
            <Typography
              variant={"heading"}
              className={classNames(styles.text, itemClassName)}
              aria-label={"crt"}
              size={isMobile ? "small" : "large"}
            >
              {tab.label}
            </Typography>
          </button>
        ))}
      </div>
      {onRender && onRender}
    </div>
  );
};

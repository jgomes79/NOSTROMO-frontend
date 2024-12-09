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
  readonly onRender: React.ReactNode;
}

export const Tabs = <T,>({ tabs, onChange, onRender }: TabsProps<T>) => {
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = useState(tabs[0].id);

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
              className={styles.text}
              aria-label={"crt"}
              size={isMobile ? "medium" : "large"}
            >
              {tab.label}
            </Typography>
          </button>
        ))}
      </div>
      {onRender}
    </div>
  );
};

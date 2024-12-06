import React from "react";

import classNames from "clsx";

import useResponsive from "@/shared/hooks/useResponsive";

import styles from "./Tabs.module.scss";
import { Typography } from "../Typography";

interface Tab {
  label: string;
}

interface TabsProps {
  readonly tabs: Tab[];
}

export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const { isMobile } = useResponsive();
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className={styles.layout}>
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={classNames(styles.tab, { [styles.active]: activeTab === index })}
          onClick={() => setActiveTab(index)}
        >
          <Typography variant={"heading"} size={isMobile ? "medium" : "large"}>
            {tab.label}
          </Typography>
        </button>
      ))}
    </div>
  );
};

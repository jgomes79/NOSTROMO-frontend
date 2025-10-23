import { useRef } from "react";

import classNames from "clsx";

import useResponsive from "@/shared/hooks/useResponsive";

import { Typography, TypographyProps } from "../Typography";
import styles from "./Tabs.module.scss";
/**
 * Props for the Tabs component.
 *
 * @template T - The type of the tab ID.
 * @property {("green" | "cyan")} [color] - The color theme of the tabs. Default is "green".
 * @property {Tab<T>[]} tabs - An array of tab objects.
 * @property {T} activeId - The ID of the active tab.
 * @property {(tabId: T) => void} [onChange] - Optional callback function that is called when a tab is changed.
 * @property {React.ReactNode} [onRender] - The content to render for the active tab.
 * @property {string} [itemClassName] - The class name for the tabs container.
 * @property {TypographyProps["size"]} [size] - The size of the tabs. Default is "medium".
 */
interface TabsProps<T> {
  readonly color?: "green" | "cyan";
  readonly tabs: Tab<T>[];
  readonly activeId: T;
  readonly itemClassName?: string;
  readonly size?: TypographyProps["size"];
  readonly onChange?: (tabId: T) => void;
}

export interface Tab<T> {
  id: T;
  label: string;
  iconLeft?: React.ReactNode;
}

export const Tabs = <T,>({
  tabs,
  activeId,
  size = "medium",
  color = "green",
  onChange,
  itemClassName,
}: TabsProps<T>) => {
  const { isMobile } = useResponsive();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div className={styles.tabs}>
      {tabs.map((tab, index) => (
        <button
          key={`--tab-${tab.id}`}
          ref={(el) => (tabRefs.current[index] = el)}
          type="button"
          className={classNames(styles.tab, styles[color], { [styles.active]: activeId === tab.id })}
          onClick={() => onChange?.(tab.id)}
        >
          <Typography
            variant={"heading"}
            className={classNames(styles.text, itemClassName)}
            aria-label={"crt"}
            size={isMobile ? "medium" : size}
          >
            {tab.label}
          </Typography>
          {tab.iconLeft && <div className={styles.icon}>{tab.iconLeft}</div>}
        </button>
      ))}
    </div>
  );
};

import React from "react";

import classNames from "clsx";
import { AnimatePresence, motion } from "framer-motion";

import styles from "./Skeleton.module.scss";

/**
 * Props for the Skeleton component.
 */
interface SkeletonProps {
  /**
   * The number of skeleton rows to display.
   */
  readonly count: number;

  /**
   * Flag to determine if the skeleton should be displayed.
   */
  readonly isLoading: boolean;

  /**
   * The content to display when not loading.
   */
  readonly children: React.ReactNode;

  /**
   * Additional class names to apply to the skeleton.
   */
  readonly className?: string;

  /**
   * The width style of the skeleton, either "random" or "full".
   */
  readonly width?: "random" | "full";

  /**
   * The height of each skeleton row in pixels.
   */
  readonly height?: number;

  /**
   * The orientation of the skeleton, either "horizontal" or "vertical".
   */
  readonly orientation?: "horizontal" | "vertical";

  /**
   * The gap between skeleton rows in pixels.
   */
  readonly gap?: number;
}

/**
 * Skeleton component that displays a loading placeholder.
 *
 * @param props - The properties passed to the Skeleton component.
 * @returns The Skeleton component or the children if not loading.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  count,
  width = "random",
  height = 18,
  isLoading,
  className = "",
  children,
  orientation = "vertical",
  gap = 8,
}) => {
  if (!isLoading) {
    return children;
  }

  return (
    <AnimatePresence mode={"wait"}>
      <motion.div
        key="skeleton"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={classNames(styles.layout, styles[orientation], className)}
        style={{ gap: `${gap}px` }}
      >
        {[...Array(count)].map((_, index) => (
          <div
            key={`--skeleton-${index}`}
            className={styles.row}
            style={{ width: width === "random" ? `${60 + Math.random() * 40}%` : "100%", height: `${height}px` }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

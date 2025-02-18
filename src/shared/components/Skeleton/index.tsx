import React from "react";

import classNames from "clsx";
import { AnimatePresence, motion } from "framer-motion";

import styles from "./Skeleton.module.scss";

/**
 * Props for the Skeleton component.
 *
 * @property {number} count - The number of skeleton rows to display.
 * @property {boolean} isLoading - Flag to determine if the skeleton should be displayed.
 * @property {React.ReactNode} children - The content to display when not loading.
 * @property {string} [className] - Additional class names to apply to the skeleton.
 * @property {"random" | "full"} [width] - The width style of the skeleton, either "random" or "full".
 * @property {number} [height] - The height of each skeleton row in pixels.
 * @property {"horizontal" | "vertical"} [orientation] - The orientation of the skeleton, either "horizontal" or "vertical".
 * @property {number} [gap] - The gap between skeleton rows in pixels.
 */
interface SkeletonProps {
  readonly count: number;
  readonly isLoading: boolean;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly width?: "random" | "full";
  readonly height?: number;
  readonly orientation?: "horizontal" | "vertical";
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

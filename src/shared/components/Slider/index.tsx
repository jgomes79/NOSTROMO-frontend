import React, { useImperativeHandle, forwardRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import styles from "./Slider.module.scss";

/**
 * Props for the Slider component.
 */
interface SliderProps {
  readonly components: React.ReactNode[];
  readonly onMove: (index: number) => void;
}

/**
 * Methods exposed by the Slider component.
 */
export type SliderElement = {
  next: () => void;
  previous: () => void;
  getCurrentIndex: () => number;
  moveTo: (index: number) => void;
};

/**
 * A slider component that displays a series of components with animation.
 *
 * @param components - An array of React nodes to be displayed in the slider.
 * @param onMove - A callback function to be called with the current index whenever the slider moves.
 * @param ref - A ref to expose the `next`, `previous`, `getCurrentIndex`, and `moveTo` methods.
 * @returns A JSX element representing the slider.
 */
export const Slider = forwardRef(({ components, onMove }: SliderProps, ref) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  /**
   * Advances to the next component in the slider.
   * If the current component is the last one, it wraps around to the first component.
   */
  const next = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % components.length;
      onMove(newIndex);
      return newIndex;
    });
  };

  /**
   * Moves to the previous component in the slider.
   * If the current component is the first one, it wraps around to the last component.
   */
  const previous = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + components.length) % components.length;
      onMove(newIndex);
      return newIndex;
    });
  };

  /**
   * Moves to a specific component in the slider by index.
   * If the index is out of bounds, it does nothing.
   */
  const moveTo = (index: number) => {
    if (index >= 0 && index < components.length) {
      setCurrentIndex(index);
      onMove(index);
    }
  };

  /**
   * Returns the current index of the slider.
   */
  const getCurrentIndex = () => currentIndex;

  /**
   * Exposes the `next`, `previous`, `getCurrentIndex`, and `moveTo` methods to the parent component via the ref.
   */
  useImperativeHandle(ref, () => ({
    next,
    previous,
    getCurrentIndex,
    moveTo,
  }));

  return (
    <div className={styles.slider}>
      <AnimatePresence mode={"wait"}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {components[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

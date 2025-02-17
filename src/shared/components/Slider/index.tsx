import React, { useImperativeHandle, forwardRef, useState, useEffect, useRef } from "react";

import { motion } from "framer-motion";

import styles from "./Slider.module.scss";

/**
 * Props for the Slider component.
 *
 * @property {React.ReactNode[]} components - An array of React nodes to be displayed in the slider.
 * @property {(index: number) => void} onMove - A callback function to be called with the current index whenever the slider moves.
 * @property {number} [delay] - The delay in milliseconds between each auto-advance.
 */
interface SliderProps {
  readonly components: React.ReactNode[];
  readonly onMove: (index: number) => void;
  readonly delay?: number;
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
export const Slider = forwardRef(({ components, onMove, delay = 0 }: SliderProps, ref) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const autoAdvanceTimeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * Sets up an effect to auto-advance the slider after a specified delay.
   * The effect is cleaned up when the component is unmounted or when the delay or currentIndex changes.
   */
  useEffect(() => {
    if (delay > 0) {
      autoAdvanceTimeout.current = setTimeout(next, delay);
    }

    return () => {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
    };
  }, [currentIndex, delay]);

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
    <div className={styles.slider} style={{ overflow: "hidden" }}>
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: `${-currentIndex * 100}%` }}
        transition={{ type: "keyframes", duration: 0.4 }}
        style={{
          display: "flex",
          flexDirection: "row",
          width: `${components.length * 100}%`,
        }}
      >
        {components.map((component, index) => (
          <div key={index} style={{ flex: "0 0 100%" }}>
            {component}
          </div>
        ))}
      </motion.div>
    </div>
  );
});

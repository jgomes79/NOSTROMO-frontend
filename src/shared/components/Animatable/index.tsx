import React, { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";

/**
 * Props for the Animatable component.
 */
interface AnimatableProps {
  /**
   * The children of the component.
   */
  readonly children: React.ReactNode;
  /**
   * The class name of the component.
   */
  readonly className?: string;
  /**
   * The duration of the animation.
   */
  readonly duration?: number;
}

/**
 * Animatable component that animates changes in the height of its children.
 * It utilizes a ResizeObserver to detect changes in the height of its content
 * and animates the height change using framer-motion.
 *
 * @param {AnimatableProps} props - The props for the component.
 * @returns {JSX.Element} The animated component.
 */
export const Animatable: React.FC<AnimatableProps> = ({ children, className, duration = 0.1 }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        // We only have one entry, so we can use entries[0].
        const observedHeight = entries[0].contentRect.height;
        setHeight(observedHeight);
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        // Cleanup the observer when the component is unmounted
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <motion.div
      className={className}
      style={{ height }}
      animate={{ height }}
      transition={{ type: "spring", stiffness: 400, damping: 30, duration }}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
};

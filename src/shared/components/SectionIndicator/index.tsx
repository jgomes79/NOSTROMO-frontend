import React from "react";

import classNames from "clsx";

import styles from "./SectionIndicator.module.scss";

/**
 * Props for the SectionIndicator component.
 *
 * @property {("vertical" | "horizontal")} [orientation] - The orientation of the stepper, either "vertical" or "horizontal".
 * @property {number} step - The current step number.
 * @property {string[]} steps - The list of steps.
 * @property {(index: number) => void} [onClick] - The callback function that is called when a step is clicked.
 */
interface SectionIndicatorProps {
  readonly orientation?: "vertical" | "horizontal";
  readonly step: number;
  readonly steps: string[];
  readonly onClick?: (index: number) => void;
}

export const SectionIndicator: React.FC<SectionIndicatorProps> = ({
  step,
  steps = [],
  onClick = () => {},
  orientation = "horizontal",
}) => {
  return (
    <div className={classNames([styles.layout, styles[orientation]])}>
      {steps.map((_, index) => (
        <div key={index} className={classNames([styles.step, { [styles.active]: step === index }])}>
          <div className={styles.dot} onClick={() => onClick?.(index)} />
        </div>
      ))}
    </div>
  );
};

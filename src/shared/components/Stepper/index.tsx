import React from "react";

import classNames from "clsx";

import styles from "./Stepper.module.scss";

interface StepperProps {
  /**
   * The orientation of the stepper.
   * It can be either "vertical" or "horizontal".
   */
  readonly orientation?: "vertical" | "horizontal";

  /**
   * The current step number.
   */
  readonly step: number;

  /**
   * The list of steps.
   */
  readonly steps: string[];

  /**
   * The callback function that is called when a step is clicked.
   */
  readonly onClick?: (index: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({
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

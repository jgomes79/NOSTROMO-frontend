import React from "react";

import styles from "./Stepper.module.scss";
import CircleStepVector from "../../assets/vectors/circle-step-vector.svg";
import { Typography } from "../Typography";

/**
 * Represents a step in the stepper component.
 */
type Step = {
  /**
   * The icon to be displayed for the step.
   */
  readonly icon: React.ReactNode;

  /**
   * The title of the step.
   */
  readonly title: string;

  /**
   * The description of the step.
   */
  readonly description: string;
};

interface StepperProps {
  /**
   * The list of steps.
   */
  readonly steps: Step[];
}

export const Stepper: React.FC<StepperProps> = ({ steps = [] }) => {
  return (
    <div className={styles.layout}>
      {steps.map((step, index) => (
        <div key={`--step-${index}`} className={styles.step}>
          <div className={styles.icon}>
            <div className={styles.iconBackground}>
              <CircleStepVector />
            </div>
            <div className={styles.svg}>{step.icon}</div>
          </div>
          <div className={styles.content}>
            <Typography
              className={styles.title}
              variant={"heading"}
              size={"small"}
              as={"h3"}
              textAlign={"center"}
              textTransform={"uppercase"}
            >
              {step.title}
            </Typography>
            <Typography className={styles.description} variant={"body"} size={"small"} as={"p"} textAlign={"center"}>
              {step.description}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
};

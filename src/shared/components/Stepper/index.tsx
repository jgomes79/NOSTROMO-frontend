import React from "react";

import styles from "./Stepper.module.scss";
import CircleStepVector from "../../assets/vectors/circle-step-vector.svg";
import { Typography } from "../Typography";

/**
 * Represents a step in the stepper component.
 *
 * @property {React.ReactNode} icon - The icon to be displayed for the step.
 * @property {string} title - The title of the step.
 * @property {string} description - The description of the step.
 */
type Step = {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly description: string;
};

/**
 * Props for the Stepper component.
 *
 * @property {Step[]} steps - The list of steps.
 */
interface StepperProps {
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

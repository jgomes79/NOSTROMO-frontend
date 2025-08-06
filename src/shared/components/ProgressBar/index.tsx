import classNames from "clsx";

import { formatNumber } from "@/lib/number";

import styles from "./ProgressBar.module.scss";
import { Typography } from "../Typography";

export type BarColor = "green" | "red";

/**
 * ProgressBar component displays a visual progress indicator with percentage.
 *
 * @param value - The current progress value
 * @param max - The maximum value for calculating percentage
 * @param color - The color theme of the progress bar ("green" or "red")
 * @param label - The label to display inside the progress bar
 * @returns A rendered progress bar with percentage display
 */
interface ProgressBarProps {
  readonly value: number;
  readonly max: number;
  readonly label?: React.ReactNode;
  readonly color: BarColor;
  readonly disabled?: boolean;
}

/**
 * ProgressBar component renders a visual progress indicator with a percentage display.
 *
 * This component visualizes progress as a colored bar with a percentage label.
 * The bar's width is calculated based on the progress relative to the maximum value.
 *
 * @component
 * @returns {JSX.Element} A rendered progress bar with percentage display
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, color, label, disabled }) => {
  const percentage = (value / max) * 100;

  return (
    <div className={classNames(styles.content, styles[color], disabled && styles.disabled)}>
      <div className={styles.bar}>
        <div className={styles.inner} style={{ width: `${percentage}%` }} />
      </div>
      <Typography variant="label" size={"medium"} textAlign={"center"} className={styles.label}>
        {label ?? formatNumber(percentage, 0) + "%"}
      </Typography>
    </div>
  );
};

import React from "react";

import styles from "./RangeInput.module.scss";
import { Typography } from "../Typography";

/**
 * Props for the RangeInput component.
 */
interface RangeInputProps extends React.HTMLProps<HTMLInputElement> {
  /**
   * The step value for the range input, which determines the intervals between selectable values.
   * @default 1
   */
  readonly step?: number;

  /**
   * The label for the range input, which describes its purpose.
   */
  readonly label: string;

  /**
   * An optional description providing additional information about the range input.
   */
  readonly description?: string;

  /**
   * The minimum value for the range input.
   * @default 0
   */
  readonly min: string | number;

  /**
   * The maximum value for the range input.
   * @default 100
   */
  readonly max: string | number;

  /**
   * A function that renders the value of the range input.
   */
  readonly renderValue?: (value: React.HTMLProps<HTMLInputElement>["value"]) => React.ReactNode;
}

/**
 * RangeInput component.
 *
 * @param {RangeInputProps} props - The props for the RangeInput component.
 * @returns {JSX.Element} The rendered RangeInput component.
 */
export const RangeInput: React.FC<RangeInputProps> = ({
  label,
  description,
  min = 0,
  max = 100,
  step = 1,
  renderValue,
  ...props
}) => {
  return (
    <div className={styles.layout}>
      <label htmlFor={props.name}>{label}</label>
      {description && (
        <Typography size={"small"} className={styles.description}>
          {description}
        </Typography>
      )}

      <div className={styles.container}>
        <input type="range" className={styles.range} min={min} max={max} step={step} {...props} />
        {renderValue && renderValue(props.value)}
      </div>
    </div>
  );
};

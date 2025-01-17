import React, { useState } from "react";

import styles from "./RangeInput.module.scss";
import { Typography } from "../Typography";

/**
 * Props for the RangeInput component.
 */
interface RangeInputProps extends Omit<React.HTMLProps<HTMLInputElement>, "value" | "defaultValue"> {
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
  readonly renderValue?: (value: string | number) => React.ReactNode;

  /**
   * The controlled value of the range input.
   */
  readonly value?: string | number;

  /**
   * The default value of the range input for uncontrolled usage.
   */
  readonly defaultValue?: string | number;
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
  value,
  defaultValue,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState<string | number>(defaultValue || min);

  /**
   * Handles the change event for the range input.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - The change event.
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(event.target.value);
    if (props.onChange) {
      props.onChange(event);
    }
  };

  /**
   * Determines the value of the range input.
   * If a controlled value is provided, it uses that value.
   * Otherwise, it uses the internal state value.
   */
  const inputValue = value !== undefined ? value : internalValue;

  return (
    <div className={styles.layout}>
      <label htmlFor={props.name}>{label}</label>
      {description && (
        <Typography size={"small"} className={styles.description}>
          {description}
        </Typography>
      )}

      <div className={styles.container}>
        <input
          type="range"
          className={styles.range}
          min={min}
          max={max}
          step={step}
          value={inputValue}
          onChange={handleChange}
          {...props}
        />
        {renderValue && renderValue(inputValue)}
      </div>
    </div>
  );
};

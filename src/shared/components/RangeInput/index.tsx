import React, { useState } from "react";

import styles from "./RangeInput.module.scss";
import { Typography } from "../Typography";

/**
 * Props for the RangeInput component.
 *
 * @property {number} [step=1] - The step value for the range input, determining the intervals between selectable values.
 * @property {string} label - The label for the range input, describing its purpose.
 * @property {string} [description] - An optional description providing additional information about the range input.
 * @property {string | number} min - The minimum value for the range input.
 * @property {string | number} max - The maximum value for the range input.
 * @property {(value: string | number) => React.ReactNode} [renderValue] - A function that renders the value of the range input.
 * @property {string | number} [value] - The controlled value of the range input.
 * @property {string | number} [defaultValue] - The default value of the range input for uncontrolled usage.
 */
interface RangeInputProps extends Omit<React.HTMLProps<HTMLInputElement>, "value" | "defaultValue"> {
  readonly step?: number;
  readonly label: string;
  readonly description?: string;
  readonly min: string | number;
  readonly max: string | number;
  readonly renderValue?: (value: string | number) => React.ReactNode;
  readonly value?: string | number;
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

import React from "react";
import DatePicker from "react-datepicker";

import classNames from "clsx";
import { RiAlertLine } from "react-icons/ri";

import styles from "./DateInput.module.scss";
import { TagLabel } from "../TagLabel";
import { Typography } from "../Typography";

import "react-datepicker/dist/react-datepicker.css";

/**
 * Props for the DateInput component.
 */
interface DateInputProps {
  /**
   * The name of the date input.
   */
  readonly name: string;
  /**
   * The label of the date input.
   */
  readonly label: string;
  /**
   * The placeholder of the date input.
   */
  readonly placeholder?: string;
  /**
   * The description of the date input.
   */
  readonly description?: string;
  /**
   * The value of the date input.
   */
  readonly value: Date;
  /**
   * The onChange handler of the date input.
   */
  readonly onChange: (
    date: Date | null,
    event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => void;
  /**
   * The error of the date input.
   */
  readonly error?: string;
}

/**
 * A component for selecting dates using a date picker.
 *
 * @param {DateInputProps} props - The props for the DateInput component.
 * @returns {JSX.Element} The rendered date input component.
 */
export const DateInput = React.forwardRef<HTMLDivElement, DateInputProps>(
  ({ name, label, placeholder, description, value, onChange, error }, ref) => {
    return (
      <div className={styles.layout} ref={ref}>
        <label htmlFor={name}>{label}</label>
        {description && (
          <Typography size={"small"} className={styles.description}>
            {description}
          </Typography>
        )}
        <DatePicker
          className={classNames(styles.input, error && styles.withError)}
          selected={new Date(value)}
          onChange={onChange}
          placeholderText={placeholder}
          dateFormat="yyyy/MM/dd"
        />
        {error && <TagLabel text={error} icon={<RiAlertLine />} color="red" />}
      </div>
    );
  },
);

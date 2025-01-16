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
   * The name of the input field.
   */
  readonly name: string;

  /**
   * The label for the input field.
   */
  readonly label: string;

  /**
   * The placeholder text for the input field.
   */
  readonly placeholder?: string;

  /**
   * A description for the input field.
   */
  readonly description?: string;

  /**
   * The currently selected date value.
   */
  readonly value: Date;

  /**
   * Callback function to handle date changes.
   *
   * @param date - The new date selected or null if the date is cleared.
   * @param event - The event that triggered the change, if applicable.
   */
  readonly onChange: (
    date: Date | null,
    event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => void;

  /**
   * The error message to display.
   */
  readonly error?: string;
}

/**
 * A component for selecting dates using a date picker.
 *
 * @param {DateInputProps} props - The props for the DateInput component.
 * @returns {JSX.Element} The rendered date input component.
 */
export const DateInput: React.FC<DateInputProps> = ({
  name,
  label,
  placeholder,
  description,
  value,
  onChange,
  error,
}) => {
  return (
    <div className={styles.layout}>
      <label htmlFor={name}>{label}</label>
      {description && (
        <Typography size={"small"} className={styles.description}>
          {description}
        </Typography>
      )}
      <DatePicker
        className={classNames(styles.input, error && styles.withError)}
        selected={value}
        onChange={onChange}
        placeholderText={placeholder}
        dateFormat="yyyy/MM/dd"
      />
      {error && <TagLabel text={error} icon={<RiAlertLine />} color="red" />}
    </div>
  );
};

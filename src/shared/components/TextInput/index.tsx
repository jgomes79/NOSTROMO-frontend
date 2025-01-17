import React from "react";

import classNames from "clsx";
import { RiAlertLine } from "react-icons/ri";

import styles from "./TextInput.module.scss";
import { TagLabel } from "../TagLabel";
import { Typography } from "../Typography";

/**
 * Props for the TextInput component.
 */
interface TextInputProps extends React.HTMLProps<HTMLInputElement> {
  /**
   * The label for the text input.
   */
  readonly label: string;

  /**
   * The optional icon to display inside the text input.
   */
  readonly icon?: React.ReactNode;

  /**
   * The optional symbol to display inside the text input.
   */
  readonly symbol?: string;

  /**
   * The optional description for the text input.
   */
  readonly description?: string;

  /**
   * The optional error message for the text input.
   */
  readonly error?: string;

  /**
   * Whether to convert the input value to uppercase.
   */
  readonly upperCase?: boolean;
}

/**
 * TextInput component.
 *
 * @param {TextInputProps} props - The props for the TextInput component.
 * @param {React.Ref<HTMLInputElement>} ref - The ref to forward to the input element.
 * @returns {JSX.Element} The rendered TextInput component.
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, icon, symbol, type, description, error, upperCase = false, ...props }, ref) => {
    /**
     * Handles the input event for the TextInput component.
     *
     * If the input type is "number", it sanitizes the input value by removing
     * non-numeric characters except for commas and converts it to a number.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
     */
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "number") {
        const value = event.target.value;
        const sanitizedValue = value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except comma
        event.target.value = sanitizedValue;

        if (sanitizedValue) {
          const numericValue = parseFloat(sanitizedValue);

          if (!isNaN(numericValue)) {
            event.target.value = numericValue.toString();
          }
        }
      }
      if (upperCase) {
        event.target.value = event.target.value.toUpperCase();
      }
    };

    return (
      <div className={styles.layout}>
        <label htmlFor={props.name}>{label}</label>
        {description && (
          <Typography size={"small"} className={styles.description}>
            {description}
          </Typography>
        )}
        <div className={styles.inputContainer}>
          {symbol && (
            <Typography variant={"body"} size={"xsmall"} className={styles.symbol}>
              {symbol}
            </Typography>
          )}

          {icon && <div className={styles.icon}>{icon}</div>}
          <input
            className={classNames(styles.input, icon && styles.withIcon, error && styles.withError)}
            onInput={handleInput}
            ref={ref}
            type={type}
            {...props}
          />
        </div>
        {error && <TagLabel text={error} icon={<RiAlertLine />} color="red" />}
      </div>
    );
  },
);

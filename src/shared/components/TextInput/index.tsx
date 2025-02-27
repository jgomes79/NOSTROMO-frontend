import React from "react";

import classNames from "clsx";
import { RiAlertLine } from "react-icons/ri";

import styles from "./TextInput.module.scss";
import { TagLabel } from "../TagLabel";
import { Typography } from "../Typography";

/**
 * Props for the TextInput component.
 *
 * @property {string} label - The label for the text input.
 * @property {React.ReactNode} [icon] - The optional icon to display inside the text input.
 * @property {string} [symbol] - The optional symbol to display inside the text input.
 * @property {string} [description] - The optional description for the text input.
 * @property {string} [error] - The optional error message for the text input.
 * @property {boolean} [upperCase] - Whether to convert the input value to uppercase.
 */
interface TextInputProps extends React.HTMLProps<HTMLInputElement> {
  readonly label: string;
  readonly icon?: React.ReactNode;
  readonly symbol?: string;
  readonly description?: string;
  readonly error?: string;
  readonly upperCase?: boolean;
  readonly note?: string;
}

/**
 * TextInput component.
 *
 * @param {TextInputProps} props - The props for the TextInput component.
 * @param {React.Ref<HTMLInputElement>} ref - The ref to forward to the input element.
 * @returns {JSX.Element} The rendered TextInput component.
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, icon, symbol, type, description, error, upperCase = false, note, ...props }, ref) => {
    /**
     * Handles the input event for the TextInput component.
     *
     * If the input type is "number", it sanitizes the input value by removing
     * all characters except for digits and commas.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
     */
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "number") {
        const value = event.target.value;
        const sanitizedValue = value.replace(/[^0-9.]/g, ""); // Remove all characters except digits and commas
        event.target.value = sanitizedValue;
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
            type={"text"}
            {...props}
          />
        </div>
        {!error && note && <TagLabel text={note} color="green" />}
        {error && <TagLabel text={error} icon={<RiAlertLine />} color="red" />}
      </div>
    );
  },
);

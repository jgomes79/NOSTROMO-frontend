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
  readonly label: string;
  readonly icon?: React.ReactNode;
  readonly symbol?: string;
  readonly description?: string;
  readonly error?: string;
}
/**
 * TextInput component.
 *
 * @param {TextInputProps} props - The props for the TextInput component.
 * @param {React.Ref<HTMLInputElement>} ref - The ref to forward to the input element.
 * @returns {JSX.Element} The rendered TextInput component.
 */
export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, icon, symbol, type, description, error, ...props }, ref) => {
    /**
     * Handles the input event for the TextInput component.
     *
     * If the input type is "number", it sanitizes the input value by removing
     * non-numeric characters except for commas.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
     */
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "number") {
        const value = event.target.value;
        const sanitizedValue = value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except comma
        event.target.value = sanitizedValue;
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
            type="text"
            onInput={handleInput}
            ref={ref}
            {...props}
          />
        </div>
        {error && <TagLabel text={error} icon={<RiAlertLine />} color="red" />}
      </div>
    );
  },
);

import { forwardRef } from "react";

import { RiArrowDropDownLine } from "react-icons/ri";

import styles from "./Selector.module.scss";
import { Typography } from "../Typography";

type Option = { value: string | number; label: string };

interface SelectorProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** The options to be displayed in the selector. */
  readonly options: Option[];

  /** The label of the selector. */
  readonly label: string;

  /** The description of the selector. */
  readonly description?: string;
}

/**
 * Selector component for selecting an option from a dropdown list.
 *
 * @param {SelectorProps} props - The properties of the Selector component.
 * @param {React.Ref<HTMLSelectElement>} ref - The ref to be forwarded to the select element.
 * @returns {React.ReactElement} The rendered React element.
 */
export const Selector = forwardRef<HTMLSelectElement, SelectorProps>(function Selector(
  { label, options, description, ...props },
  ref,
) {
  return (
    <div className={styles.layout}>
      <label htmlFor={label}>{label}</label>
      {description && (
        <Typography size={"small"} className={styles.description}>
          {description}
        </Typography>
      )}
      <div className={styles.container}>
        <select className={styles.select} ref={ref} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <RiArrowDropDownLine className={styles.icon} size={24} />
      </div>
    </div>
  );
});

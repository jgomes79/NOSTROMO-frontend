import React from "react";

import classNames from "clsx";
import { RiAlertLine } from "react-icons/ri";

import styles from "./TextArea.module.scss";
import { TagLabel } from "../TagLabel";

/**
 * Props for the TextArea component.
 *
 * @extends {React.HTMLProps<HTMLTextAreaElement>}
 * @property {string} label - The label for the textarea.
 * @property {string} [error] - Optional error message to display.
 */
interface TextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {
  readonly label: string;
  readonly error?: string;
}

/**
 * A forward-ref TextArea component that automatically adjusts its height based on the content.
 *
 * @param {TextAreaProps} props - The properties for the TextArea component.
 * @param {React.Ref<HTMLTextAreaElement>} ref - The ref to be forwarded to the textarea element.
 * @returns {JSX.Element} The rendered TextArea component.
 */
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ label, error, ...props }, ref) => {
  return (
    <div className={styles.layout}>
      <label htmlFor={props.name}>{label}</label>
      <textarea
        ref={ref}
        className={classNames(styles.input, error && styles.withError)}
        style={{ height: "auto", overflowY: "hidden" }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto";
          target.style.height = `${target.scrollHeight}px`;
        }}
        {...props}
      />
      {error && <TagLabel text={error} icon={<RiAlertLine />} color="red" />}
    </div>
  );
});

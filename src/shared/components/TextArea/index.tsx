import React from "react";

import styles from "./TextArea.module.scss";

/**
 * Props for the TextArea component.
 *
 * @extends {React.HTMLProps<HTMLTextAreaElement>}
 * @property {string} label - The label for the textarea.
 */
interface TextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {
  readonly label: string;
}

/**
 * A forward-ref TextArea component that automatically adjusts its height based on the content.
 *
 * @param {TextAreaProps} props - The properties for the TextArea component.
 * @param {React.Ref<HTMLTextAreaElement>} ref - The ref to be forwarded to the textarea element.
 * @returns {JSX.Element} The rendered TextArea component.
 */
export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ label, ...props }, ref) => {
  return (
    <div className={styles.layout}>
      <label htmlFor={props.name}>{label}</label>
      <textarea
        ref={ref}
        className={styles.input}
        style={{ height: "auto", overflowY: "hidden" }}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto";
          target.style.height = `${target.scrollHeight}px`;
        }}
        {...props}
      />
    </div>
  );
});

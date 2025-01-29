import classNames from "clsx";

import styles from "./Fieldset.module.scss";
import { Typography } from "../Typography";

interface FieldsetProps {
  /**
   * The title of the fieldset.
   */
  title: string;
  /**
   * The content to be rendered inside the fieldset.
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes for the fieldset.
   */
  className?: string;
}

/**
 * Fieldset component for grouping related elements in a form.
 *
 * @param {FieldsetProps} props - The properties of the Fieldset component.
 * @returns {React.ReactElement} The rendered React element.
 */
export const Fieldset: React.FC<FieldsetProps> = ({ title, children, className }) => {
  return (
    <fieldset className={classNames(styles.layout, className)}>
      <Typography as={"legend"} variant={"heading"} size={"medium"}>
        {title}
      </Typography>
      <div className={styles.inner} data-label="inner">
        {children}
      </div>
    </fieldset>
  );
};

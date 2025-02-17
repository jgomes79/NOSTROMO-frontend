import classNames from "clsx";

import styles from "./Fieldset.module.scss";
import { Typography } from "../Typography";

/**
 * Props for the Fieldset component.
 */
interface FieldsetProps {
  /**
   * The title of the fieldset.
   */
  readonly title: string;
  /**
   * The children of the fieldset.
   */
  readonly children: React.ReactNode;
  /**
   * The class name of the fieldset.
   */
  readonly className?: string;
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

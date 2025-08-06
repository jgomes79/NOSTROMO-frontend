import classNames from "clsx";

import styles from "./Fieldset.module.scss";
import { Typography } from "../Typography";

/**
 * Props for the Fieldset component.
 *
 * @param title - The title of the fieldset.
 * @param children - The children of the fieldset.
 * @param className - The class name of the fieldset.
 */
interface FieldsetProps {
  readonly title: string;
  readonly children: React.ReactNode;
  readonly variant?: "default" | "warning" | "error" | "white";
  readonly className?: string;
}

/**
 * Fieldset component for grouping related elements in a form.
 *
 * @returns {React.ReactElement} The rendered React element.
 */
export const Fieldset: React.FC<FieldsetProps> = ({ title, children, className, variant = "default" }) => {
  return (
    <fieldset className={classNames(styles.layout, className, styles[variant])}>
      <Typography as={"legend"} variant={"heading"} size={"medium"}>
        {title}
      </Typography>
      <div className={styles.inner} data-label="inner">
        {children}
      </div>
    </fieldset>
  );
};

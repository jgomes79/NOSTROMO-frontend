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
}

/**
 * Fieldset component for grouping related elements in a form.
 *
 * @param {FieldsetProps} props - The properties of the Fieldset component.
 * @returns {React.ReactElement} The rendered React element.
 */
export const Fieldset: React.FC<FieldsetProps> = ({ title, children }) => {
  return (
    <fieldset className={styles.layout}>
      <Typography as={"legend"} variant={"heading"} size={"medium"}>
        {title}
      </Typography>
      <div className={styles.inner}>{children}</div>
    </fieldset>
  );
};

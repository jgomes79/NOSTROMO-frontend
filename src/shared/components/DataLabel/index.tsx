import classNames from "clsx";

import styles from "./DataLabel.module.scss";
import { Typography } from "../Typography";

/**
 * Props for the DataLabel component.
 */
interface DataLabelProps {
  /**
   * The label of the data label.
   */
  readonly label: string;
  /**
   * The value of the data label.
   */
  readonly value: string;
  /**
   * The icon of the data label.
   */
  readonly icon?: React.ReactNode;
}

/**
 * DataLabel component that displays a label and a value.
 *
 * @param {DataLabelProps} props - The props for the component.
 * @returns {JSX.Element} The rendered DataLabel component.
 */
export const DataLabel: React.FC<DataLabelProps> = ({ label, value, icon }) => {
  return (
    <div className={classNames(styles.layout, { [styles.two]: icon })}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.content}>
        <Typography as={"span"} variant="label" size={"small"} textTransform="uppercase" className={styles.label}>
          {label}
        </Typography>
        <Typography as={"span"} size={"large"}>
          {value}
        </Typography>
      </div>
    </div>
  );
};

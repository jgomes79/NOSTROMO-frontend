import classNames from "clsx";

import styles from "./DataLabel.module.scss";
import { Typography } from "../Typography";

/**
 * DataLabel component that displays a label and a value.
 *
 * @typedef {Object} DataLabelProps
 * @property {string} label - The label of the data label
 * @property {string} value - The value of the data label
 * @property {React.ReactNode} [icon] - Optional icon to display with the data label
 */
interface DataLabelProps {
  readonly label: string;
  readonly value: string;
  readonly icon?: React.ReactNode;
}

/**
 * Renders a data label with an optional icon
 *
 * @param {DataLabelProps} props - Component props
 * @returns {JSX.Element} The rendered DataLabel component
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

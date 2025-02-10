import classNames from "clsx";

import { formatNumber } from "@/lib/number";

import styles from "./GraphBar.module.scss";
import { Typography } from "../Typography";

type BarColor = "green" | "red";

/**
 * Props for the GraphBar component.
 *
 * @property {BarVariant} [variant] - The orientation of the bar, either horizontal or vertical. Defaults to horizontal.
 * @property {BarColor[]} colors - An array of colors corresponding to each bar.
 * @property {number[]} data - An array of numerical values representing the height or length of each bar.
 */
interface GraphBarProps {
  colors: BarColor[];
  data: number[];
}

/**
 * A React component that renders a graph bar based on the provided data and colors.
 *
 * @param {GraphBarProps} props - The properties for the GraphBar component.
 * @returns {JSX.Element} The rendered graph bar component.
 */
export const GraphBar: React.FC<GraphBarProps> = ({ colors, data }) => {
  const totalValue = data.reduce((acc, value) => acc + value, 0);

  return (
    <div className={classNames(styles.layout)}>
      {data.map((value, index) => (
        <div key={`--graph-bar-${index.toString()}`} className={classNames(styles.content, styles[colors[index]])}>
          <div className={styles.bar}>
            <div className={styles.inner} style={{ width: `${(value / totalValue) * 100}%` }} />
          </div>
          <Typography variant="label" size={"medium"} textAlign={"center"} className={styles.label}>
            {formatNumber((value / totalValue) * 100, 0)}%
          </Typography>
        </div>
      ))}
    </div>
  );
};

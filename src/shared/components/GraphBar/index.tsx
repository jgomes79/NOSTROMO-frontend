import classNames from "clsx";

import styles from "./GraphBar.module.scss";
import { BarColor, ProgressBar } from "../ProgressBar";

/**
 * GraphBar component renders a visual bar graph based on provided data and colors.
 *
 * @param colors - Array of colors to apply to each segment of the graph bar
 * @param data - Array of numeric values to represent in the graph bar
 * @returns A rendered graph bar component with proportional segments
 */
interface GraphBarProps {
  readonly colors: BarColor[];
  readonly data: number[];
}

export const GraphBar: React.FC<GraphBarProps> = ({ colors, data }) => {
  const totalValue = data.reduce((acc, value) => acc + value, 0);

  return (
    <div className={classNames(styles.layout)}>
      {data.map((value, index) => (
        <ProgressBar key={`--graph-bar-${index.toString()}`} color={colors[index]} value={value} max={totalValue} />
      ))}
    </div>
  );
};

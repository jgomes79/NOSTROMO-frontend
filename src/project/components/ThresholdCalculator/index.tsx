import classNames from "clsx";

import { Currency } from "@/currency/currency.types";
import { formatPrice } from "@/lib/number";
import { TextInput } from "@/shared/components/TextInput";

import styles from "./ThresholdCalculator.module.scss";
import { Project } from "../../project.types";

/**
 * Props interface for the ThresholdCalculator component
 */
interface ThresholdCalculatorProps {
  /**
   * The threshold percentage for the project
   */
  readonly threshold: Project["threshold"];
  /**
   * The currency object for display
   */
  readonly currency: Currency;
  /**
   * The amount to raise for the project
   */
  readonly amountToRaise: Project["amountToRaise"];
}

/**
 * ThresholdCalculator component displays minimum and maximum amount inputs based on a threshold percentage
 *
 * @param {ThresholdCalculatorProps} props - Component props
 * @param {Project["threshold"]} props.threshold - The threshold percentage to calculate min/max amounts
 * @param {Currency} props.currency - The currency object for display
 * @param {Project["amountToRaise"]} props.amountToRaise - The target amount to raise
 * @returns {JSX.Element | null} Returns the calculator UI or null if no threshold
 */
export const ThresholdCalculator: React.FC<ThresholdCalculatorProps> = ({ threshold, currency, amountToRaise }) => {
  if (!threshold) return null;

  return (
    <div className={classNames(styles.grid, styles.two, styles.amountToRaise)}>
      <TextInput
        label="Minimum Amount"
        type="string"
        placeholder="Minimum Amount"
        symbol={currency.name}
        value={amountToRaise && amountToRaise > 0 ? formatPrice(amountToRaise - (amountToRaise * threshold) / 100) : 0}
        disabled
      />
      <TextInput
        label="Maximum Amount"
        type="string"
        placeholder="Maximum Amount"
        symbol={currency.name}
        value={amountToRaise && amountToRaise > 0 ? formatPrice(amountToRaise + (amountToRaise * threshold) / 100) : 0}
        disabled
      />
    </div>
  );
};

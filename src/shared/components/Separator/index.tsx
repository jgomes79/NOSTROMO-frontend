import classNames from "clsx";

import styles from "./Separator.module.scss";

/**
 * Props for the Separator component.
 *
 * @property {string} [className] - The optional className to be applied to the separator.
 */
interface SeparatorProps {
  /** The optional className to be applied to the separator. */
  readonly className?: string;
}

/**
 * Separator component.
 *
 * This component renders a horizontal separator line with a gradient background.
 *
 * @param {SeparatorProps} props - The properties for the Separator component.
 * @returns {JSX.Element} The rendered separator component.
 */
export const Separator: React.FC<SeparatorProps> = ({ className }) => {
  return <div className={classNames(styles.separator, className)} />;
};

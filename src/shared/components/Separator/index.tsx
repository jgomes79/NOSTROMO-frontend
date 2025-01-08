import styles from "./Separator.module.scss";

/**
 * Separator component.
 *
 * This component renders a horizontal separator line with a gradient background.
 *
 * @returns {JSX.Element} The rendered separator component.
 */
export const Separator: React.FC = () => {
  return <div className={styles.separator} />;
};

import styles from "./Card.module.scss";
import { Typography } from "../Typography";

/**
 * Props for the Card component.
 *
 * @property {string} [title] - The optional title of the card.
 * @property {React.ReactNode} children - The content to be displayed inside the card.
 */
interface CardProps {
  /**
   * The optional title of the card.
   */
  readonly title?: string;

  /**
   * The content to be displayed inside the card.
   */
  readonly children: React.ReactNode;
}

/**
 * Card component.
 *
 * @param {CardProps} props - The props for the Card component.
 * @param {string} [props.title] - The optional title of the card.
 * @param {React.ReactNode} props.children - The content to be displayed inside the card.
 * @returns {JSX.Element} The Card component.
 */
export const Card: React.FC<CardProps> = ({ children, title }) => {
  return (
    <div className={styles.layout}>
      {title && (
        <Typography as={"h2"} variant={"heading"} size={"medium"}>
          {title}
        </Typography>
      )}
      {children}
    </div>
  );
};

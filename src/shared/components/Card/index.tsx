import classNames from "clsx";

import styles from "./Card.module.scss";
import { Typography } from "../Typography";

/**
 * Props for the Card component.
 */
interface CardProps {
  /**
   * The title of the card.
   */
  readonly title?: string;
  /**
   * The children of the card.
   */
  readonly children: React.ReactNode;
  /**
   * The class name of the card.
   */
  readonly className?: string;
}

/**
 * Card component.
 *
 * @param {CardProps} props - The props for the Card component.
 * @param {string} [props.title] - The optional title of the card.
 * @param {React.ReactNode} props.children - The content to be displayed inside the card.
 * @returns {JSX.Element} The Card component.
 */
export const Card: React.FC<CardProps> = ({ children, title, className }) => {
  return (
    <div className={classNames(styles.layout, className)}>
      {title && (
        <Typography as={"h2"} variant={"heading"} size={"medium"}>
          {title}
        </Typography>
      )}
      {children}
    </div>
  );
};

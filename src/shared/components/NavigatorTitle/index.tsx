import { useNavigate } from "react-router-dom";

import { RiArrowLeftLine } from "react-icons/ri";

import styles from "./NavigatorTitle.module.scss";
import { IconButton } from "../IconButton";
import { Typography } from "../Typography";

/**
 * Props for the NavigatorTitle component.
 * @property {string} text - The title text to display.
 * @property {string} backPath - The path to navigate back to.
 */
interface NavigatorTitleProps {
  readonly text: string;
  readonly backPath: string;
}

/**
 * NavigatorTitle component that displays a title and a back button.
 *
 * @param {NavigatorTitleProps} props - The props for the component.
 * @param {string} props.text - The title text to display.
 * @param {string} props.backPath - The path to navigate back to.
 * @returns {JSX.Element} The rendered NavigatorTitle component.
 */
export const NavigatorTitle = ({ text, backPath }: NavigatorTitleProps) => {
  const navigate = useNavigate();

  /**
   * Handles the click event for the back button.
   * Navigates to the specified backPath.
   */
  const handleClickBack = () => {
    navigate(backPath);
  };

  return (
    <div className={styles.container}>
      <IconButton
        variant={"ghost"}
        size={"large"}
        color={"primary"}
        icon={<RiArrowLeftLine />}
        onClick={handleClickBack}
      />
      <Typography as={"h2"} variant={"heading"} size={"large"}>
        {text}
      </Typography>
    </div>
  );
};

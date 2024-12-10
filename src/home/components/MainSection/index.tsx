import React, { useMemo } from "react";

import classNames from "clsx";
import { FaArrowDown } from "react-icons/fa";

import { Typography } from "@/shared/components/Typography";

import styles from "./MainSection.module.scss";
import NostromoImage from "../../assets/images/nostromo.png";

/**
 * Props for the MainSection component.
 */
interface MainSectionProps {
  /**
   * Callback function to handle the click event for showing projects.
   */
  readonly onClickShowProjects: () => void;
}

/**
 * MainSection component renders the main section of the homepage.
 * It includes a title, an image of a starship, and a button to show projects.
 *
 * @param {MainSectionProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export const MainSection: React.FC<MainSectionProps> = ({ onClickShowProjects }) => {
  /**
   * Returns the class name corresponding to the current day of the week.
   * The result is memoized using useMemo to avoid unnecessary recalculations.
   *
   * @returns {string} The class name for the current day of the week.
   */
  const dayClass = useMemo(() => {
    const dayClasses: { [key: number]: string } = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };
    return dayClasses[new Date().getDay()];
  }, []);

  return (
    <div className={styles.layout}>
      <div className={classNames(styles.planet, styles[dayClass])} />
      <div className={styles.container}>
        <div className={styles.field}>
          <h1 className={styles.title}>Enter the Gateway of Blockchain Innovation</h1>
        </div>

        <img alt={"starship"} src={NostromoImage} className={styles.starship} width={"100%"} />
      </div>
      <button className={styles.icon} onClick={onClickShowProjects}>
        <Typography variant={"heading"} size={"small"} textAlign={"center"}>
          Show Projects
        </Typography>
        <FaArrowDown />
      </button>
    </div>
  );
};

import React from "react";

import { FaArrowDown } from "react-icons/fa";

import { Typography } from "@/shared/components/Typography";

import styles from "./MainSection.module.scss";
import NostromoImage from "../../assets/images/nostromo.png";

interface MainSectionProps {
  readonly onClickShowProjects: () => void;
}

export const MainSection: React.FC<MainSectionProps> = ({ onClickShowProjects }) => (
  <div className={styles.layout}>
    <div className={styles.planet} />
    <div className={styles.container}>
      <div className={styles.field}>
        <Typography variant={"heading"} className={styles.title} size={"xlarge"} textAlign={"center"}>
          Enter the Gateway of Blockchain Innovation
        </Typography>
      </div>

      <div className={styles.starshipContainer}>
        <img alt={"starship"} src={NostromoImage} className={styles.starship} width={"100%"} />
      </div>
    </div>
    <button className={styles.icon} onClick={onClickShowProjects}>
      <Typography variant={"heading"} size={"small"} textAlign={"center"}>
        Show Projects
      </Typography>
      <FaArrowDown />
    </button>
  </div>
);

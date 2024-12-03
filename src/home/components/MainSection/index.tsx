import React from "react";

import { Button } from "@/shared/components/Button";
import { Typography } from "@/shared/components/Typography";

import styles from "./MainSection.module.scss";
import NostromoImage from "../../assets/images/nostromo.png";

export const MainSection: React.FC = () => (
  <div className={styles.layout}>
    <div className={styles.planet} />

    <div className={styles.container}>
      <Typography variant={"heading"} className={styles.title} size={"xlarge"} textAlign={"center"}>
        Enter the Gateway of Blockchange Innovation
      </Typography>

      <div className={styles.actions}>
        <Button variant={"solid"} color={"primary"} size={"large"} caption={"Buy $NFUND"} />
        <Button variant={"solid"} color={"secondary"} size={"large"} caption={"How to Start"} />
      </div>

      <img alt={"starship"} src={NostromoImage} className={styles.starship} width={"100%"} />
    </div>
  </div>
);

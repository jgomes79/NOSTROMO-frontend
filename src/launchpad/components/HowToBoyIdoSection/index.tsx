import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";

import CardIcon from "@/shared/assets/icons/card-icon.svg";
import CoinsIcon from "@/shared/assets/icons/coins-icon.svg";
import VerifyIcon from "@/shared/assets/icons/verify-icon.svg";
import { Animatable } from "@/shared/components/Animatable";
import { Button } from "@/shared/components/Button";
import { Stepper } from "@/shared/components/Stepper";
import { Typography } from "@/shared/components/Typography";

import styles from "./HowToBuyIdoSection.module.scss";
import { useLaunchpadController } from "../../hooks/useLaunchpadController";

export const HowToBoyIdoSection: React.FC = () => {
  const { isHowToBuyIdoOpen, toggleHowToBuyIdo } = useLaunchpadController();

  return (
    <Animatable>
      <div className={styles.container}>
        <div className={styles.field}>
          <Typography
            variant={"heading"}
            size={"large"}
            textAlign={"center"}
            textTransform={"uppercase"}
            className={styles.title}
          >
            Where projects set sail and make waves
          </Typography>
          <Typography variant={"body"} size={"large"} textAlign={"center"}>
            The fast-growing delfi-integrated launchpad on emerging blockchains
          </Typography>
        </div>
        <Button
          variant={"ghost"}
          caption={"How to buy IDO?"}
          iconRight={isHowToBuyIdoOpen ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
          onClick={toggleHowToBuyIdo}
        />

        <AnimatePresence>
          {isHowToBuyIdoOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.stepper}>
                <Stepper
                  steps={[
                    {
                      icon: <CardIcon />,
                      title: "Purchase $QUBIC",
                      description:
                        "$QUBIC is the native token that enables users to participate in IDOs by staking mechanisms. Buy here.",
                    },
                    {
                      icon: <CoinsIcon />,
                      title: "Stake your $QUBIC",
                      description: "Stake your $QUBIC to Nostromos’ staking pool in order to acquire a tier",
                    },
                    {
                      icon: <VerifyIcon />,
                      title: "Time to participate!",
                      description: "Choose your desired project and be ready for the launch! ",
                    },
                  ]}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Animatable>
  );
};

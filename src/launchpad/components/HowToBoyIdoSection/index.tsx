import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";

import { Animatable } from "@/shared/components/Animatable";
import { Button } from "@/shared/components/Button";
import { Stepper } from "@/shared/components/Stepper";
import { Typography } from "@/shared/components/Typography";

import styles from "./HowToBuyIdoSection.module.scss";
import { useLaunchpadController } from "../../hooks/useLaunchpadController";

export const HowToBoyIdoSection: React.FC = () => {
  const { isHowToBuyIdoOpen, toggleHowToBuyIdo } = useLaunchpadController();

  /**
   * Renders the step number using the Typography component.
   *
   * @param number - The step number to render.
   * @returns A Typography component displaying the step number.
   */
  const renderStepNumber = React.useCallback(
    (number: number) => (
      <Typography variant={"heading"} size={"medium"} className={styles.stepNumber}>
        {number}
      </Typography>
    ),
    [],
  );

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
                      icon: renderStepNumber(1),
                      title: "Connect EVM wallet",
                      description: "Seamlessly link your EVM wallet to access the launchpad.",
                    },
                    {
                      icon: renderStepNumber(2),
                      title: "Go to profile",
                      description: "Navigate to your profile to manage your account and settings.",
                    },
                    {
                      icon: renderStepNumber(3),
                      title: "Go to stake system",
                      description: "Explore the staking system to maximize your rewards.",
                    },
                    {
                      icon: renderStepNumber(4),
                      title: "Register and buy IDO",
                      description: "Sign up to participate in projects and purchase IDOs.",
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

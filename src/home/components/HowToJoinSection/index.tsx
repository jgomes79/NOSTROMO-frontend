import CardIcon from "@/shared/assets/icons/card-icon.svg";
import CoinsIcon from "@/shared/assets/icons/coins-icon.svg";
import VerifyIcon from "@/shared/assets/icons/verify-icon.svg";
import { Globe } from "@/shared/components/Globe";
import { Stepper } from "@/shared/components/Stepper";
import { TVNoise } from "@/shared/components/TVNoise";
import { Typography } from "@/shared/components/Typography";
import useResponsive from "@/shared/hooks/useResponsive";

import styles from "./HowToJoinSection.module.scss";

/**
 * HowToJoinSection component renders a section that guides users on how to join the platform.
 * It includes a title, description, and a stepper with three steps.
 *
 * @returns {JSX.Element} The rendered HowToJoinSection component.
 */
export const HowToJoinSection: React.FC = () => {
  const { isMobile } = useResponsive();

  return (
    <TVNoise>
      <div className={styles.layout}>
        <Globe />
        <div className={styles.field}>
          <Typography
            variant={"heading"}
            size={isMobile ? "small" : "large"}
            textAlign={"center"}
            textTransform={"uppercase"}
            as={"h1"}
            className={styles.title}
          >
            How to participate in upcoming IDOs
          </Typography>
          <Typography
            variant={"body"}
            size={isMobile ? "small" : "large"}
            textAlign={"center"}
            className={styles.description}
          >
            3 steps to join NOSTROMO starship
          </Typography>
        </div>
        <div className={styles.steps}>
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
      </div>
    </TVNoise>
  );
};

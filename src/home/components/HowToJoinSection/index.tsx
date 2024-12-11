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
            How to Join top trier web
          </Typography>
          <Typography
            variant={"body"}
            size={isMobile ? "small" : "large"}
            textAlign={"center"}
            className={styles.description}
          >
            Only three steps are needed for you to start enjoying all the advantages of NOSTROMO
          </Typography>
        </div>
        <div className={styles.steps}>
          <Stepper
            steps={[
              {
                icon: <CardIcon />,
                title: "Purchase $SFUND Tokens",
                description:
                  "$SFUND is QUBIC token that enables its holders to participate in IDOs, INOs, stake and farm for passive income",
              },
              {
                icon: <CoinsIcon />,
                title: "Stake or farm your $SFUND ",
                description: "Add your $FUND to one of our staking or farming pools and earn passive income",
              },
              {
                icon: <VerifyIcon />,
                title: "You are all set!",
                description: "Now you can participate in the sales for tokens and NFTs of the best blockchain projects",
              },
            ]}
          />
        </div>
      </div>
    </TVNoise>
  );
};

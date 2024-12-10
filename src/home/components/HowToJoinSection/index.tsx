import { RiAliensFill } from "react-icons/ri";

import { Stepper } from "@/shared/components/Stepper";
import { Typography } from "@/shared/components/Typography";

import styles from "./HowToJoinSection.module.scss";

export const HowToJoinSection: React.FC = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.field}>
        <Typography variant={"heading"} size={"large"} textAlign={"center"} as={"h1"} className={styles.title}>
          How to Join top trier web
        </Typography>
        <Typography variant={"body"} size={"large"} textAlign={"center"} className={styles.description}>
          Only three steps are needed for you to start enjoying all the advantages of NOSTROMO
        </Typography>
      </div>
      <Stepper
        steps={[
          {
            icon: <RiAliensFill />,
            title: "Purchase $SFUND Tokens",
            description:
              "$SFUND is QUBIC token that enables its holders to participate in IDOs, INOs, stake and farm for passive income",
          },
          {
            icon: <RiAliensFill />,
            title: "Stake or farm your $SFUND ",
            description: "Add your $FUND to one of our staking or farming pools and earn passive income",
          },
          {
            icon: <RiAliensFill />,
            title: "You are all set!",
            description: "Now you can participate in the sales for tokens and NFTs of the best blockchain projects",
          },
        ]}
      />
    </div>
  );
};

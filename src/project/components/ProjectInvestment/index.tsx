import { Currency } from "@/currency/currency.types";
import { Typography } from "@/shared/components/Typography";
import { Tier } from "@/tier/tier.types";

import styles from "./ProjectInvestment.module.scss";
import { Project } from "../../project.types";

/**
 * Props for the ProjectInvestment component.
 */
export interface ProjectInvestmentProps {
  /**
   * Investment details for the project.
   */
  readonly investment: {
    /**
     * The maximum investment amount allowed.
     */
    readonly max: number;

    /**
     * The current investment amount made by the user.
     */
    readonly current: number;

    /**
     * The limit date for the investment.
     */
    readonly limitDate: Pick<Project, "TGEDate">;

    /**
     * The threshold for the project.
     */
    readonly threshold: Pick<Project, "threshold">;

    /**
     * Token details associated with the investment.
     */
    readonly token: {
      /**
       * The price of the token.
       */
      readonly price: number;

      /**
       * The currency details for the token.
       */
      readonly currency: Pick<Currency, "id" | "name">;
    };
  };

  /**
   * User details related to the investment.
   */
  readonly user: {
    /**
     * The tier of the user.
     */
    readonly tier: Pick<Tier, "id" | "name">;

    /**
     * The current investment amount made by the user (optional).
     */
    readonly currentInvestment?: number;

    /**
     * The maximum investment amount allowed for the user.
     */
    readonly maxInvestment: number;
  };

  /**
   * Callback function to handle investment actions.
   */
  readonly onInvest: (value: number) => void;

  /**
   * Callback function to handle tier upgrades.
   */
  readonly onUpgradeTier: () => void;
}

export const ProjectInvestment: React.FC<ProjectInvestmentProps> = () => {
  return (
    <div className={styles.layout}>
      <Typography as={"h2"} variant={"heading"} size={"large"}>
        Project Evaluation
      </Typography>
    </div>
  );
};

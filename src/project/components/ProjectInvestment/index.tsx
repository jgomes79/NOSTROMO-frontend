import classNames from "clsx";
import { RiCoinLine } from "react-icons/ri";

import { Currency } from "@/currency/currency.types";
import { formatPrice } from "@/lib/number";
import { InvestmentForm } from "@/project/forms/InvestmentForm";
import { Countdown } from "@/shared/components/Countdown";
import { DataLabel } from "@/shared/components/DataLabel";
import { Fieldset } from "@/shared/components/Fieldset";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { Separator } from "@/shared/components/Separator";
import { Typography } from "@/shared/components/Typography";
import { TierImage } from "@/tier/components/TierImage";
import { Tier, Tiers } from "@/tier/tier.types";

import styles from "./ProjectInvestment.module.scss";
import { Project, ProjectStates } from "../../project.types";

/**
 * ProjectInvestment component displays investment details for a project and allows users to invest or upgrade their tier.
 *
 * @typedef {Object} ProjectInvestmentProps
 * @property {ProjectStates} state - The state of the project
 * @property {Object} investment - Investment details for the project
 * @property {number} investment.max - The maximum investment amount allowed
 * @property {number} investment.current - The current investment amount made by the user
 * @property {Object} investment.limitDate - The limit date for the investment
 * @property {Object} investment.threshold - The threshold for the project
 * @property {Object} investment.token - Token details associated with the investment
 * @property {number} investment.token.price - The price of the token
 * @property {Object} investment.token.currency - The currency details for the token
 * @property {Object} user - User details related to the investment
 * @property {Object} user.tier - The tier of the user
 * @property {number} [user.currentInvestment] - The current investment amount made by the user (optional)
 * @property {number} user.maxInvestment - The maximum investment amount allowed for the user
 * @property {Function} onInvest - Callback function to handle investment actions
 * @property {Function} onUpgradeTier - Callback function to handle tier upgrades
 */
export interface ProjectInvestmentProps {
  readonly state: ProjectStates.FUNDING_PHASE_1 | ProjectStates.FUNDING_PHASE_2 | ProjectStates.FUNDING_PHASE_3;
  readonly investment: {
    readonly max: number;
    readonly current: number;
    readonly limitDate: Project["TGEDate"];
    readonly threshold: Project["threshold"];
    readonly token: {
      readonly price: number;
      readonly currency: Pick<Currency, "id" | "name">;
    };
  };

  readonly user: {
    readonly tier: Pick<Tier, "id" | "name">;
    readonly currentInvestment?: number;
    readonly maxInvestment: number;
  };

  readonly onInvest: (value: number) => void;
  readonly onUpgradeTier: () => void;
}

/**
 * ProjectInvestment component renders the investment section for a project.
 *
 * This component displays investment information and provides interface for users
 * to invest in a project or upgrade their tier if needed.
 *
 * @component
 * @param {Function} props.onUpgradeTier - Callback function to handle tier upgrades
 * @returns {JSX.Element} The rendered ProjectInvestment component
 */
export const ProjectInvestment: React.FC<ProjectInvestmentProps> = ({ state, user, investment }) => {
  /**
   * Labels for different funding phases of the project.
   *
   * This object maps each funding phase state to its corresponding display title
   * that will be shown in the investment section header.
   *
   * @type {Object.<ProjectStates, {title: string}>}
   */
  const labels = {
    [ProjectStates.FUNDING_PHASE_1]: {
      tag: "Phase 1",
      title: "Invest in the project (Phase 1)",
    },
    [ProjectStates.FUNDING_PHASE_2]: {
      tag: "Phase 2",
      title: "Invest in the project (Phase 2)",
    },
    [ProjectStates.FUNDING_PHASE_3]: {
      tag: "Phase 3",
      title: "Invest in the project (Phase 3)",
    },
  };

  /**
   * Renders the user's investment information based on their current state.
   *
   * This function handles three different scenarios:
   * 1. User has no tier (TIER_NONE) - Shows a message indicating they have no tier
   * 2. User has a tier but hasn't invested yet - Shows tier information and investment form
   * 3. User has already invested - Shows their current investment amount
   *
   * @returns {JSX.Element} The rendered component showing user's investment information
   */
  const renderUserInvestment = () => {
    if (!user.currentInvestment) {
      if (user.tier.id === Tiers.TIER_NONE) {
        return null;
      }

      return (
        <div className={styles.tier}>
          <div className={styles.info}>
            <TierImage tier={user.tier.id} size={72} />
            <div className={styles.line}>
              <Typography as={"p"} variant={"body"} size={"medium"} textAlign={"left"} className={styles.description}>
                You have the "{user.tier.name}" Tier and can invest a max of{" "}
                {formatPrice(user.maxInvestment, investment.token.currency.name)} in {labels[state].tag}
              </Typography>
            </div>
          </div>
          {!user.currentInvestment && (
            <InvestmentForm
              isLoading={false}
              user={{
                tier: user.tier,
                maxInvestment: user.maxInvestment,
              }}
              token={{
                currency: investment.token.currency,
                price: investment.token.price,
              }}
              onSubmit={() => {}}
            />
          )}
        </div>
      );
    }

    return (
      <DataLabel
        label={"Your investment"}
        icon={<RiCoinLine />}
        value={formatPrice(user.currentInvestment, investment.token.currency.name)}
      />
    );
  };

  /**
   * Renders the countdown component for the project investment.
   *
   * This function displays a countdown timer that shows the remaining time until the investment limit date.
   * It uses the Countdown component to display the countdown and updates the time left every second.
   *
   * @returns {JSX.Element} The rendered countdown component
   */
  const renderCountdown = () => {
    return (
      <div className={styles.field}>
        <Typography as={"h2"} variant="label" size={"small"} textTransform="uppercase">
          Time left
        </Typography>
        <Countdown date={investment.limitDate}>
          {(timeLeft) => (
            <div className={styles.countdown}>
              <div className={styles.box}>
                <Typography as={"h3"} variant={"heading"} size={"medium"}>
                  {timeLeft.days}
                </Typography>
                <Typography as={"p"} variant={"body"} size={"xsmall"} textTransform={"lowercase"}>
                  Days
                </Typography>
              </div>
              <div className={styles.box}>
                <Typography as={"h3"} variant={"heading"} size={"medium"}>
                  {timeLeft.hours}
                </Typography>
                <Typography as={"p"} variant={"body"} size={"xsmall"} textTransform={"lowercase"}>
                  Hours
                </Typography>
              </div>
              <div className={styles.box}>
                <Typography as={"h3"} variant={"heading"} size={"medium"}>
                  {timeLeft.minutes}
                </Typography>
                <Typography as={"p"} variant={"body"} size={"xsmall"} textTransform={"lowercase"}>
                  Minutes
                </Typography>
              </div>
              <div className={styles.box}>
                <Typography as={"h3"} variant={"heading"} size={"medium"}>
                  {timeLeft.seconds}
                </Typography>
                <Typography as={"p"} variant={"body"} size={"xsmall"} textTransform={"lowercase"}>
                  Seconds
                </Typography>
              </div>
            </div>
          )}
        </Countdown>
      </div>
    );
  };

  return (
    <Fieldset title={labels[state].title} className={styles.section}>
      <div className={classNames(styles.grid, styles.two)}>
        <DataLabel
          label={"Total Invested"}
          icon={<RiCoinLine />}
          value={formatPrice(investment.current, investment.token.currency.name)}
        />
        {renderCountdown()}
      </div>

      <ProgressBar
        value={investment.current}
        max={investment.max}
        label={
          <div className={styles.progressLabel}>
            <Typography as={"span"} className={styles.green} variant="label" size={"medium"} textTransform="uppercase">
              {formatPrice(investment.current, investment.token.currency.name)}
            </Typography>
            <Typography as={"span"} className={styles.gray} variant="label" size={"medium"} textTransform="uppercase">
              /
            </Typography>
            <Typography as={"span"} className={styles.white} variant="label" size={"medium"} textTransform="uppercase">
              {formatPrice(investment.max, investment.token.currency.name)}
            </Typography>
          </div>
        }
        color={"green"}
      />
      <Separator />

      <div className={classNames(styles.grid, styles.twoFill)}>
        <div className={classNames(styles.grid)}>
          <DataLabel label={"Max allocation"} value={formatPrice(investment.max, investment.token.currency.name)} />
          <DataLabel label={"Threshold"} value={`${investment.threshold}%`} />
          <DataLabel
            label={"Token Price"}
            value={formatPrice(investment.token.price, investment.token.currency.name)}
          />
        </div>

        {renderUserInvestment()}
      </div>
    </Fieldset>
  );
};

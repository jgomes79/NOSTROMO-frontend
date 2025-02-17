import classNames from "clsx";
import { RiArrowUpCircleFill, RiQuillPenFill } from "react-icons/ri";

import { Currency } from "@/currency/currency.types";
import { formatNumber, formatPrice } from "@/lib/number";
import { Button } from "@/shared/components/Button";
import { Countdown } from "@/shared/components/Countdown";
import { DataLabel } from "@/shared/components/DataLabel";
import { Fieldset } from "@/shared/components/Fieldset";
import { Separator } from "@/shared/components/Separator";
import { Typography } from "@/shared/components/Typography";
import useResponsive from "@/shared/hooks/useResponsive";
import { TierImage } from "@/tier/components/TierImage";
import { Tier } from "@/tier/tier.types";

import styles from "./ProjectRegister.module.scss";

/**
 * Props for the ProjectRegister component.
 */
export interface ProjectRegisterProps {
  /**
   * Registration details for the project.
   */
  readonly registration: {
    /**
     * The limit date for registration.
     */
    readonly limitDate: Date;
    /**
     * The total count of votes.
     */
    readonly count: number;
  };
  /**
   * User details related to the registration.
   */
  readonly user: {
    /**
     * The user's tier information.
     */
    readonly tier: Pick<Tier, "id" | "name">;
    /**
     * Investment details for the user.
     */
    readonly investment: {
      /**
       * The current investment value.
       */
      readonly value: number;
      /**
       * The maximum investment details.
       */
      readonly max: {
        /**
         * The maximum investment value allowed.
         */
        readonly value: number;
        /**
         * The currency of the maximum investment.
         */
        readonly currency: Pick<Currency, "name">;
      };
    };
    /**
     * Indicates if the user is registered.
     */
    readonly isRegistered: boolean;
  };
  /**
   * Callback function for click events.
   */
  readonly onClick?: () => void;
  /**
   * Indicates if the component is in a loading state.
   */
  readonly isLoading?: boolean;
}

/**
 * ProjectRegister component renders the registration section for investing in a project.
 *
 * @returns {JSX.Element} The JSX code for the ProjectRegister component.
 */
export const ProjectRegister: React.FC<ProjectRegisterProps> = ({ registration, user, isLoading, onClick }) => {
  const { isMobile } = useResponsive();

  return (
    <Fieldset title={"Register to Invest"} className={styles.section}>
      <div className={classNames(styles.inline, styles.data)}>
        <DataLabel label={"Total Votes"} value={formatNumber(registration.count, 0)} />
        <Countdown date={registration.limitDate}>
          {(timeLeft) => (
            <DataLabel
              label={"Time left"}
              value={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`}
            />
          )}
        </Countdown>
      </div>
      <Separator />
      <div className={classNames(styles.field, styles.welcome)}>
        <TierImage tier={user.tier.id} size={86} />
        <div className={styles.line}>
          <Typography
            as={"p"}
            variant={"body"}
            size={"medium"}
            textAlign={isMobile ? "center" : "left"}
            className={styles.description}
          >
            You have the “{user.tier.name}” Tier and can invest a max of{" "}
            {formatPrice(user.investment.max.value, user.investment.max.currency.name)} in phase 1
          </Typography>
          {!user.isRegistered && (
            <div className={styles.actions}>
              <Button
                caption="Register"
                color={"secondary"}
                size={"small"}
                onClick={onClick}
                isLoading={isLoading}
                iconLeft={<RiQuillPenFill size={24} />}
              />
              <Button
                caption="Upgrade Tier"
                color={"yellow"}
                onClick={onClick}
                size={"small"}
                iconLeft={<RiArrowUpCircleFill size={24} />}
              />
            </div>
          )}
        </div>
      </div>
    </Fieldset>
  );
};

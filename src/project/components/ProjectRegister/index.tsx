import { useNavigate } from "react-router-dom";

import classNames from "clsx";
import { RiArrowUpCircleFill, RiQuillPenFill } from "react-icons/ri";

import { Currency } from "@/currency/currency.types";
import { formatNumber, formatPrice } from "@/lib/number";
import { getRoute } from "@/lib/router";
import { Button } from "@/shared/components/Button";
import { Countdown } from "@/shared/components/Countdown";
import { DataLabel } from "@/shared/components/DataLabel";
import { Fieldset } from "@/shared/components/Fieldset";
import { Separator } from "@/shared/components/Separator";
import { Typography } from "@/shared/components/Typography";
import useResponsive from "@/shared/hooks/useResponsive";
import { TierImage } from "@/tier/components/TierImage";
import { Tier, Tiers } from "@/tier/tier.types";
import { USER_ROUTES } from "@/user/user.constants";

import styles from "./ProjectRegister.module.scss";

/**
 * Props for the ProjectRegister component.
 * @property {Object} registration - Registration details for the project.
 * @property {Object} registration.limitDate - The limit date for registration.
 * @property {Date} registration.limitDate - The limit date for registration.
 * @property {number} registration.count - The total count of votes.
 * @property {Object} user - User details related to the registration.
 * @property {Object} user.tier - The user's tier information.
 * @property {Object} user.tier.id - The ID of the user's tier.
 * @property {string} user.tier.name - The name of the user's tier.
 * @property {Object} user.investment - Investment details for the user.
 * @property {number} user.investment.value - The current investment value.
 * @property {Object} user.investment.max - The maximum investment details.
 * @property {number} user.investment.max.value - The maximum investment value allowed.
 * @property {Object} user.investment.max.currency - The currency of the maximum investment.
 * @property {string} user.investment.max.currency.name - The name of the currency.
 * @property {boolean} user.isRegistered - Indicates if the user is registered.
 * @property {Function} [onClick] - Callback function for click events.
 * @property {boolean} [isLoading] - Indicates if the component is in a loading state.
 */
export interface ProjectRegisterProps {
  readonly registration: {
    readonly limitDate: Date;
    readonly count: number;
  };
  readonly user: {
    readonly tier: Pick<Tier, "id" | "name">;
    readonly investment: {
      readonly value: number;
      readonly max: {
        readonly value: number;
        readonly currency: Pick<Currency, "name">;
      };
    };
    readonly isRegistered: boolean;
  };
  readonly onClick?: () => void;
  readonly isLoading?: boolean;
}

/**
 * ProjectRegister component renders the registration section for investing in a project.
 *
 * @returns {JSX.Element} The JSX code for the ProjectRegister component.
 */
export const ProjectRegister: React.FC<ProjectRegisterProps> = ({ registration, user, isLoading, onClick }) => {
  const { isMobile } = useResponsive();
  const navigate = useNavigate();

  /**
   * Handles the click event for upgrading the user's tier.
   * Navigates the user to the change tier route.
   */
  const handleClickUpgradeTier = () => {
    navigate(getRoute(USER_ROUTES.CHANGE_TIER));
  };

  /**
   * Renders the user's tier information and actions based on their registration status.
   *
   * @returns {JSX.Element | null} The JSX code for the tier display, or null if the user has no tier.
   */
  const renderTier = () => {
    if (user.tier.id === Tiers.TIER_NONE) return null;

    return (
      <>
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
                  color={"primary"}
                  size={"small"}
                  onClick={onClick}
                  isLoading={isLoading}
                  iconLeft={<RiQuillPenFill size={24} />}
                />
                <Button
                  caption="Upgrade Tier"
                  color={"warning"}
                  size={"small"}
                  iconLeft={<RiArrowUpCircleFill size={24} />}
                  onClick={handleClickUpgradeTier}
                />
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

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
      {renderTier()}
    </Fieldset>
  );
};

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
import { TierImage } from "@/tier/components/TierImage";
import { Tier } from "@/tier/tier.types";

import styles from "./ProjectRegister.module.scss";

/**
 * Props for the ProjectRegister component.
 *
 * @property {Object} registration - The registration details for the project.
 * @property {Date} registration.limit - The deadline for registration.
 * @property {number} registration.count - The current count of registrations.
 * @property {Object} user - The user details.
 * @property {Object} user.tier - The tier information of the user.
 * @property {string} user.tier.id - The ID of the user's tier.
 * @property {boolean} user.isRegistered - Indicates if the user is registered.
 * @property {() => void} [onClick] - Optional callback function for button click events.
 * @property {boolean} [isLoading] - Optional loading state for the component.
 */
export interface ProjectRegisterProps {
  registration: {
    limitDate: Date;
    count: number;
  };
  user: {
    tier: Pick<Tier, "id" | "name">;
    investment: {
      value: number;
      max: {
        value: number;
        currency: Pick<Currency, "name">;
      };
    };
    isRegistered: boolean;
  };
  onClick?: () => void;
  isLoading?: boolean;
}

/**
 * ProjectRegister component renders the registration section for investing in a project.
 *
 * @returns {JSX.Element} The JSX code for the ProjectRegister component.
 */
export const ProjectRegister: React.FC<ProjectRegisterProps> = ({ registration, user, isLoading, onClick }) => {
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
          <Typography as={"p"} variant={"body"} size={"medium"} textAlign={"left"} className={styles.description}>
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

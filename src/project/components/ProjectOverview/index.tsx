import React from "react";

import { RiDiscordFill, RiMediumFill, RiTelegramFill, RiTwitterXFill, RiWallet2Line } from "react-icons/ri";

import { formatPrice } from "@/lib/number";
import { Button } from "@/shared/components/Button";
import { Countdown } from "@/shared/components/Countdown";
import { Links } from "@/shared/components/Links";
import { Typography } from "@/shared/components/Typography";

import styles from "./ProjectOverview.module.scss";

interface ProjectOverviewProps {
  readonly name: string;
  readonly description: string;
  readonly photoUrl: string;
  readonly bannerUrl: string;
  readonly fundraisingGoal: number;
  readonly tokenPrice: number;
  readonly currency: string;
  readonly date: Date;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  name,
  description,
  photoUrl,
  bannerUrl,
  fundraisingGoal,
  tokenPrice,
  currency,
  date,
}) => {
  /**
   * Renders a field with a label and value.
   *
   * @param {string} label - The label of the field.
   * @param {string} value - The value of the field.
   * @returns {JSX.Element} The rendered field component.
   */
  const renderField = (label: string, value: string): JSX.Element => (
    <div className={styles.row}>
      <Typography variant={"body"} size={"small"}>
        {label}
      </Typography>
      <Typography className={styles.value} variant={"body"} size={"small"}>
        {value}
      </Typography>
    </div>
  );

  return (
    <div className={styles.layout}>
      <div className={styles.banner}>
        <img src={bannerUrl} alt={name} />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <img src={photoUrl} alt={name} className={styles.image} />
          <Typography variant={"heading"} size={"large"}>
            {name}
          </Typography>
        </div>
        <Typography variant={"body"} size={"medium"} className={styles.description}>
          {description}
        </Typography>
        <div className={styles.date}>
          <Typography variant={"heading"} size={"small"}>
            Starts in
          </Typography>
          <Countdown date={date}>
            {(timeLeft) => (
              <Typography variant={"heading"} size={"small"}>
                {timeLeft.days}D - {timeLeft.hours}H - {timeLeft.minutes}M - {timeLeft.seconds}S
              </Typography>
            )}
          </Countdown>
        </div>

        {/* Fields */}
        <div className={styles.field}>
          {renderField("Fundraising Goal", formatPrice(fundraisingGoal, currency))}
          {renderField("Token Price", formatPrice(tokenPrice, currency))}
        </div>

        <div className={styles.inline}>
          <Links
            data={[
              { path: "https://www.google.com", icon: <RiTwitterXFill /> },
              { path: "https://www.google.com", icon: <RiDiscordFill /> },
              { path: "https://www.google.com", icon: <RiTelegramFill /> },
              { path: "https://www.google.com", icon: <RiMediumFill /> },
            ]}
          />
          <Button caption={"Connect"} size={"medium"} iconLeft={<RiWallet2Line />} />
        </div>
      </div>
    </div>
  );
};

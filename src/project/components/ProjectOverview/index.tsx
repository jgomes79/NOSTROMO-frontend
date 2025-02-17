import React from "react";

import { RiDiscordFill, RiMediumFill, RiTelegramFill, RiTwitterXFill, RiWallet2Line } from "react-icons/ri";

import { formatPrice } from "@/lib/number";
import { getRoute } from "@/lib/router";
import { trimString } from "@/lib/string";
import { Button } from "@/shared/components/Button";
import { Countdown } from "@/shared/components/Countdown";
import { Links } from "@/shared/components/Links";
import { Typography } from "@/shared/components/Typography";
import useResponsive from "@/shared/hooks/useResponsive";

import styles from "./ProjectOverview.module.scss";
import { PROJECT_ROUTES } from "../../project.constants";
import { ProjectFormTabs } from "../../project.types";

/**
 * Props for the ProjectOverview component.
 */
interface ProjectOverviewProps {
  /**
   * The name of the project.
   */
  readonly name: string;

  /**
   * The unique identifier for the project.
   */
  readonly slug: string;

  /**
   * A brief description of the project.
   */
  readonly description: string;

  /**
   * The URL of the project's photo.
   */
  readonly photoUrl: string;

  /**
   * The URL of the project's banner image.
   */
  readonly bannerUrl: string;

  /**
   * The fundraising goal for the project.
   */
  readonly fundraisingGoal: number;

  /**
   * The price of the token associated with the project.
   */
  readonly tokenPrice: number;

  /**
   * The currency in which the fundraising goal is set.
   */
  readonly currency: string;

  /**
   * The date when the project is scheduled to start or has started.
   */
  readonly date: Date;
}

/**
 * ProjectOverview component displays an overview of a project including its
 * name, description, fundraising goal, token price, and start date.
 *
 * @param {ProjectOverviewProps} props - The props for the component.
 * @returns {JSX.Element} The rendered ProjectOverview component.
 */
export const ProjectOverview: React.FC<ProjectOverviewProps> = ({
  name,
  slug,
  description,
  photoUrl,
  bannerUrl,
  fundraisingGoal,
  tokenPrice,
  currency,
  date,
}) => {
  const { isMobile } = useResponsive();
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
      <Typography className={styles.value} variant={"body"} size={isMobile ? "medium" : "small"}>
        {value}
      </Typography>
    </div>
  );

  /**
   * Renders the header section of the project overview.
   *
   * @returns {JSX.Element} The rendered header component.
   */
  const renderHeader = (): JSX.Element => (
    <div className={styles.header}>
      <div className={styles.project}>
        <img src={photoUrl} alt={name} className={styles.image} />
        <Typography variant={"heading"} size={"large"}>
          {name}
        </Typography>
      </div>
    </div>
  );

  return (
    <div className={styles.layout}>
      <a
        href={getRoute(PROJECT_ROUTES.PROJECT_DETAILS, { slug, tabId: ProjectFormTabs.RAISING_FUNDS })}
        className={styles.banner}
      >
        <img src={bannerUrl} alt={name} />

        {isMobile && renderHeader()}
      </a>

      <div className={styles.content}>
        {!isMobile && renderHeader()}
        <Typography variant={"body"} size={"medium"} className={styles.description}>
          {trimString(description, 256)}
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

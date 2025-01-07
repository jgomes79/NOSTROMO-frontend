import { Link } from "react-router-dom";

import { formatPrice } from "@/lib/number";
import { getRoute } from "@/lib/router";
import { trimString } from "@/lib/string";
import { PROJECT_ROUTES } from "@/project/project.constants";
import { ProjectDetailsTabs } from "@/project/project.types";
import { Countdown } from "@/shared/components/Countdown";
import { Typography } from "@/shared/components/Typography";

import styles from "./ProjectCard.module.scss";

/**
 * Props for the ProjectCard component.
 */
interface ProjectCardProps {
  /**
   * The unique identifier for the project.
   */
  slug: string;

  /**
   * The title of the project.
   */
  title: string;

  /**
   * A brief description of the project.
   */
  description: string;

  /**
   * The URL of the project's photo.
   */
  photoUrl: string;

  /**
   * The URL of the project's banner image.
   */
  bannerUrl: string;

  /**
   * The fundraising goal amount for the project.
   */
  fundraisingGoal: number;

  /**
   * The price of the project's token.
   */
  tokenPrice: number;

  /**
   * The currency in which the fundraising goal and token price are denominated.
   */
  currency: string;

  /**
   * The date when the project registration ends.
   */
  date: Date;

  /**
   * Project state
   */
  state: number;
}

/**
 * A card component that displays information about a project.
 *
 * @param {ProjectCardProps} props - The props for the component.
 * @returns {JSX.Element} The rendered ProjectCard component.
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  slug,
  title,
  description,
  photoUrl,
  bannerUrl,
  fundraisingGoal,
  tokenPrice,
  currency,
  date,
  state,
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
    <Link
      className={styles.layout}
      to={getRoute(PROJECT_ROUTES.PROJECT_DETAILS, { slug, tab: ProjectDetailsTabs.INFORMATION })}
    >
      <div className={styles.body}>
        {/* Banner */}
        <img src={bannerUrl} className={styles.banner} width={"100%"} height={160} alt={"Project Banner"} />

        {/* Date */}
        <div className={styles.date}>
          <Typography variant={"body"} textTransform={"uppercase"} size={"xsmall"}>
            Registration ends in
          </Typography>
          <Typography variant={"body"} size={"xsmall"}>
            <Countdown date={date}>
              {(timeLeft) => (
                <>
                  {timeLeft.days}D {timeLeft.hours}H {timeLeft.minutes}M {timeLeft.seconds}S
                </>
              )}
            </Countdown>
          </Typography>
        </div>

        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <img src={photoUrl} className={styles.image} width={"100%"} height={94} alt={"Project Photo"} />
            <Typography as={"h3"} variant="heading" size="small">
              {title}
            </Typography>
          </div>

          {/* Description */}
          <Typography variant={"body"} className={styles.description} size={"medium"} textAlign={"center"}>
            {trimString(description, 90)}
          </Typography>

          {/* Fields */}
          <div className={styles.field}>
            {renderField("Fundraising Goal", formatPrice(fundraisingGoal, currency))}
            {renderField("Token Price", formatPrice(tokenPrice, currency))}
          </div>
        </div>
        <div className={styles.footer}>
          <Typography variant={"body"} size={"xsmall"} textTransform={"uppercase"}>
            {state === 0 || state === 1
              ? "Edit draft"
              : state === 2
                ? "Review and vote"
                : state === 4
                  ? "Register to invest"
                  : state === 5
                    ? "Invest"
                    : state === 8
                      ? "Claim tokens"
                      : ""}
          </Typography>
        </div>
      </div>
    </Link>
  );
};

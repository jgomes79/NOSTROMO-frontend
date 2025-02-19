import { Link } from "react-router-dom";

import classNames from "clsx";

import { formatPrice } from "@/lib/number";
import { getRoute } from "@/lib/router";
import { trimString } from "@/lib/string";
import { Countdown } from "@/shared/components/Countdown";
import { Typography } from "@/shared/components/Typography";

import styles from "./ProjectCard.module.scss";
import { PROJECT_ROUTES, PROJECT_STATE_STRING } from "../../project.constants";
import { ProjectFormTabs, ProjectStates } from "../../project.types";

/**
 * Props for the ProjectCard component.
 * @property {string} slug - The unique identifier for the project.
 * @property {string} title - The title of the project.
 * @property {string} description - A brief description of the project.
 * @property {string} photoUrl - The URL of the project's photo.
 * @property {string} bannerUrl - The URL of the project's banner image.
 * @property {number} fundraisingGoal - The fundraising goal for the project.
 * @property {number} tokenPrice - The price of the token associated with the project.
 * @property {string} currency - The currency in which the fundraising goal is set.
 * @property {Date} date - The date when the project is scheduled to start or has started.
 * @property {ProjectStates} state - The current state of the project.
 */
interface ProjectCardProps {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly photoUrl: string;
  readonly bannerUrl: string;
  readonly fundraisingGoal: number;
  readonly tokenPrice: number;
  readonly currency: string;
  readonly date: Date;
  readonly state: ProjectStates;
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
   * Determines the appropriate route for the project based on its state.
   *
   * @returns {string} The route path for the project:
   *                   - Edit project route if the project is in DRAFT state
   *                   - Project details route for all other states
   */
  const getProjectRoute = () => {
    if (state === ProjectStates.DRAFT) {
      return getRoute(PROJECT_ROUTES.EDIT_PROJECT, { slug });
    }
    return getRoute(PROJECT_ROUTES.PROJECT_DETAILS, { slug, tabId: ProjectFormTabs.RAISING_FUNDS });
  };

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

  const stateLabels = {
    [ProjectStates.ALL]: { title: "", banner: "", footer: "" },
    [ProjectStates.DRAFT]: { title: "Draft", banner: "", footer: "Edit" },
    [ProjectStates.SENT_TO_REVIEW]: { title: "Sent to Review", banner: "", footer: "Review" },
    [ProjectStates.REJECTED]: { title: "Rejected", banner: "", footer: "Project Rejected" },
    [ProjectStates.CLOSED]: { title: "Closed", banner: "Claim tokens in", footer: "Project Closed" },
    [ProjectStates.FAILED]: { title: "Failed", banner: "", footer: "" },
    [ProjectStates.FUNDING_PHASE_1]: { title: "Funding Phase 1", banner: "Phase 1 ends in", footer: "Invest" },
    [ProjectStates.FUNDING_PHASE_2]: { title: "Funding Phase 2", banner: "Phase 2 ends in", footer: "Invest" },
    [ProjectStates.FUNDING_PHASE_3]: { title: "Funding Phase 3", banner: "Phase 3 ends in", footer: "Invest" },
    [ProjectStates.READY_TO_VOTE]: { title: "Ready to Vote", banner: "Voting ends in", footer: "Vote" },
    [ProjectStates.REQUEST_MORE_INFO]: { title: "More Info Requested", banner: "", footer: "Edit" },
    [ProjectStates.UPCOMING]: { title: "Upcoming", banner: "Registration ends in", footer: "Register" },
  };

  return (
    <Link className={styles.layout} to={getProjectRoute()}>
      <div className={styles.body}>
        {/* Banner */}
        <img src={bannerUrl} className={styles.banner} width={"100%"} height={160} alt={"Project Banner"} />

        <div className={classNames(styles.state, styles[PROJECT_STATE_STRING[state]])}>
          <Typography variant={"label"} size={"small"}>
            {stateLabels[state].title}
          </Typography>
        </div>

        {/* Date */}
        {stateLabels[state].banner !== "" && (
          <div className={styles.date}>
            <Typography variant={"body"} textTransform={"uppercase"} size={"xsmall"}>
              {stateLabels[state].banner}
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
        )}

        <div className={styles.container}>
          {/* Header */}
          <div className={styles.header}>
            <img src={photoUrl} className={styles.image} width={"100%"} height={94} alt={"Project Photo"} />
            <Typography as={"h3"} variant="heading" size="small">
              {title}
            </Typography>
          </div>

          {/* Description */}
          <Typography variant={"body"} className={styles.description} size={"medium"} textAlign={"left"}>
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
            {stateLabels[state].footer}
          </Typography>
        </div>
      </div>
    </Link>
  );
};

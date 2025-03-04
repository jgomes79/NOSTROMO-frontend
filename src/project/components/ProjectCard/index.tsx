import { Link } from "react-router-dom";

import classNames from "clsx";

import { formatPrice } from "@/lib/number";
import { getRoute } from "@/lib/router";
import { trimString } from "@/lib/string";
import { Countdown } from "@/shared/components/Countdown";
import { Image } from "@/shared/components/Image";
import { Separator } from "@/shared/components/Separator";
import { Typography } from "@/shared/components/Typography";

import styles from "./ProjectCard.module.scss";
import { PROJECT_ROUTES, PROJECT_STATE_STRING } from "../../project.constants";
import { Project, ProjectFormTabs, ProjectStates } from "../../project.types";

/**
 * A card component that displays information about a project.
 *
 * @param {ProjectCardProps} props - The props for the component.
 * @returns {JSX.Element} The rendered ProjectCard component.
 */
export const ProjectCard: React.FC<Project> = ({
  slug,
  name,
  description,
  photoUrl,
  bannerUrl,
  amountToRaise,
  tokenPrice,
  startDate,
  currency,
  state,
}) => {
  const stateLabels = {
    [ProjectStates.ALL]: { title: "", banner: "", footer: "" },
    [ProjectStates.DRAFT]: { title: "Draft", banner: "", footer: "Edit Project" },
    [ProjectStates.SENT_TO_REVIEW]: { title: "Sent to Review", banner: "", footer: "Review" },
    [ProjectStates.REJECTED]: { title: "Rejected", banner: "", footer: "Project Rejected" },
    [ProjectStates.CLOSED]: { title: "Closed", banner: "Claim tokens in", footer: "Claim tokens" },
    [ProjectStates.FAILED]: { title: "Failed", banner: "", footer: "" },
    [ProjectStates.FUNDING_PHASE_1]: { title: "Funding Phase 1", banner: "Phase 1 ends in", footer: "Invest" },
    [ProjectStates.FUNDING_PHASE_2]: { title: "Funding Phase 2", banner: "Phase 2 ends in", footer: "Invest" },
    [ProjectStates.FUNDING_PHASE_3]: { title: "Funding Phase 3", banner: "Phase 3 ends in", footer: "Invest" },
    [ProjectStates.READY_TO_VOTE]: { title: "Ready to Vote", banner: "Voting ends in", footer: "Vote" },
    [ProjectStates.REQUEST_MORE_INFO]: { title: "Needs more info", banner: "", footer: "Edit Project" },
    [ProjectStates.UPCOMING]: { title: "Upcoming", banner: "Register ends in", footer: "Register" },
  };

  /**
   * Determines the appropriate route for the project based on its state.
   *
   * @returns {string} The route path for the project:
   *                   - Edit project route if the project is in DRAFT state
   *                   - Project details route for all other states
   */
  const getProjectRoute = () => {
    if (state === ProjectStates.DRAFT || state === ProjectStates.REQUEST_MORE_INFO) {
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
      <Typography className={styles.value} variant={"body"} size={"small"} textAlign={"right"}>
        {value}
      </Typography>
    </div>
  );

  /**
   * Renders the content section of the project card.
   *
   * This function determines what content to display based on the project state.
   * Currently, it handles the CLOSED state separately, with a default display
   * for all other states.
   *
   * @returns {JSX.Element} The rendered content component with project information
   */
  const renderContent = () => {
    if (state === ProjectStates.CLOSED) {
      return (
        <div className={styles.content}>
          {renderField("Available to claim", formatPrice(amountToRaise, currency.name))}
          {renderField("Pending to claim", formatPrice(tokenPrice, currency.name))}
          {renderField("Total claimed", formatPrice(tokenPrice, currency.name))}
        </div>
      );
    }

    return (
      <div className={styles.content}>
        <Typography variant={"body"} size={"small"} as={"p"}>
          {trimString(description, 90)}
        </Typography>

        {renderField("Fundraising Goal", formatPrice(amountToRaise, currency.name))}
        {renderField("Token Price", formatPrice(tokenPrice, currency.name))}
      </div>
    );
  };

  return (
    <Link className={styles.layout} to={getProjectRoute()}>
      <div className={styles.banner}>
        <img src={bannerUrl} width={"100%"} alt={name} />

        <div className={classNames(styles.state, styles[PROJECT_STATE_STRING[state]])}>
          <Typography variant={"label"} size={"small"} as={"p"} textTransform={"uppercase"}>
            {stateLabels[state].title}
          </Typography>
        </div>
      </div>
      {stateLabels[state].banner && (
        <div className={styles.counter}>
          <Countdown date={startDate}>
            {({ days, hours, minutes, seconds }) => (
              <Typography variant={"body"} size={"small"}>
                {stateLabels[state].banner} {days}d {hours}h {minutes}m {seconds}s
              </Typography>
            )}
          </Countdown>
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.header}>
          <Image url={photoUrl} alt={name} size={42} borderRadius={8} className={styles.avatar} />
          <div className={styles.title}>
            <Typography variant={"heading"} size={"small"}>
              {name}
            </Typography>
          </div>
        </div>
        <Separator />

        {renderContent()}
      </div>
      <Separator />
      <Typography
        variant={"label"}
        size={"small"}
        textAlign={"center"}
        className={styles.footer}
        textTransform={"uppercase"}
      >
        {stateLabels[state].footer}
      </Typography>
    </Link>
  );
};

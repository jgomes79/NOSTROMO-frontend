import React, { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import classNames from "clsx";

import { InformationPage } from "@/project/pages/InformationPage";
import { PaymentRulesPage } from "@/project/pages/PaymentRulesPage";
import { RaisingFundsPage } from "@/project/pages/RaisingFundsPage";
import { StakeOptionsPage } from "@/project/pages/StakeOptionsPage";
import { TokenInformationPage } from "@/project/pages/TokenInformationPage";
import { VestingOptionsPage } from "@/project/pages/VestingOptionsPage";
import { PROJECT_RETAILS_TABS } from "@/project/project.constants";
import { ProjectDetailsTabs } from "@/project/project.types";
import { Button } from "@/shared/components/Button";
import { Countdown } from "@/shared/components/Countdown";
import { Loader } from "@/shared/components/Loader";
import { Tabs } from "@/shared/components/Tabs";
import { Typography } from "@/shared/components/Typography";
import { ErrorPage } from "@/shared/pages/ErrorPage";

import styles from "./ProjectDetails.module.scss";
import { useProject } from "../../hooks/useProject";

/**
 * Type representing the parameters for the ProjectDetails component.
 *
 * @property {string} slug - The unique identifier (slug) of the project.
 * @property {ProjectDetailsTabs} tab - The current active tab in the project details.
 */
type ProjectDetailsParams = {
  slug: string;
  tab: ProjectDetailsTabs;
};

export const ProjectDetails: React.FC = () => {
  const navigate = useNavigate();
  const { slug, tab } = useParams<ProjectDetailsParams>();

  const activeTab = tab || ProjectDetailsTabs.INFORMATION;

  const project = useProject(slug);

  /**
   * Handles the change of the tab.
   *
   * @param {ProjectDetailsTabs} tab - The selected tab.
   */
  const handleChangeTab = useCallback(
    (tab: ProjectDetailsTabs) => {
      if (!slug) return;
      navigate(`/projects/${slug}/${tab}`);
    },
    [slug, navigate],
  );

  /**
   * Renders a loader if the project data is still loading.
   *
   * @returns {JSX.Element} The loader component.
   */
  if (project.isLoading && !project.data) {
    return <Loader variant={"full"} size={42} />;
  }

  /**
   * Renders an error page if the project data is not found or unavailable.
   *
   * @returns {JSX.Element} The error page component.
   */
  if ((!project.isLoading && !project.data) || !project.data) {
    return (
      <ErrorPage
        code={"404"}
        title={"Project Not Found"}
        description={"We're sorry, but the project you're looking for is either unavailable or doesn't exist."}
        actions={[<Button key={"home"} caption={"Return Home"} />]}
      />
    );
  }

  /**
   * Renders the appropriate tab content based on the active tab.
   *
   * @returns {JSX.Element | null} The component corresponding to the active tab, or null if no matching tab is found.
   */
  const renderTab = (): JSX.Element | null => {
    switch (activeTab) {
      case ProjectDetailsTabs.INFORMATION:
        return <InformationPage />;
      case ProjectDetailsTabs.RAISING_INFORMATION:
        return <RaisingFundsPage />;
      case ProjectDetailsTabs.TOKEN_INFORMATION:
        return <TokenInformationPage />;
      case ProjectDetailsTabs.VESTING_OPTIONS:
        return <VestingOptionsPage />;
      case ProjectDetailsTabs.STAKE_OPTIONS:
        return <StakeOptionsPage />;
      case ProjectDetailsTabs.PAYMENT_RULES:
        return <PaymentRulesPage />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.banner}>
        <img src={project.data.bannerUrl} width={"100%"} height={500} alt={`${project.data.name} banner`} />

        <div className={styles.bar}>
          <div className={styles.content}>
            {project.data.startDate && (
              <div className={styles.time}>
                <Typography as={"h2"}>REGISTRATION ENDS IN</Typography>
                <Countdown date={project.data.startDate}>
                  {(timeLeft) => (
                    <Typography variant={"heading"} size={"small"}>
                      {timeLeft.days}D - {timeLeft.hours}H - {timeLeft.minutes}M - {timeLeft.seconds}S
                    </Typography>
                  )}
                </Countdown>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.stars}>
        <div className={classNames(styles.content, styles.extended)}>
          {/* Project Description */}
          <div className={styles.inline}>
            <div className={styles.avatar}>
              <img src={project.data.photoUrl} width={48} height={48} alt={`${project.data.name} avatar`} />
            </div>
            <div>
              <Typography as={"h1"} variant={"heading"} size={"large"}>
                {project.data.name}
              </Typography>
              <div className={styles.description}>
                <Typography as={"p"} variant={"body"} size={"medium"}>
                  <span dangerouslySetInnerHTML={{ __html: project.data.description }} />
                </Typography>
              </div>
            </div>
          </div>

          <Tabs<ProjectDetailsTabs>
            itemClassName={styles.tabItem}
            activeId={activeTab}
            tabs={PROJECT_RETAILS_TABS}
            onChange={handleChangeTab}
          />

          {renderTab()}
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import classNames from "clsx";
import { format } from "date-fns/format";
import { useWalletClient } from "wagmi";

import { formatPrice } from "@/lib/number";
import { getRoute } from "@/lib/router";
import { ProjectEvaluation } from "@/project/components/ProjectEvaluation";
import { ProjectVoting } from "@/project/components/ProjectVoting";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { DataLabel } from "@/shared/components/DataLabel";
import { Loader } from "@/shared/components/Loader";
import { Tabs } from "@/shared/components/Tabs";
import { ErrorPage } from "@/shared/pages/ErrorPage";

import styles from "./ProjectDetailsPage.module.scss";
import { ProjectHeader } from "../../components/ProjectHeader";
import { ProjectRegister } from "../../components/ProjectRegister";
import { ThresholdCalculator } from "../../components/ThresholdCalculator";
import { useProject } from "../../hooks/useProject";
import { PROJECT_ROUTES, ProjectTabLabels } from "../../project.constants";
import { ProjectFormTabs, ProjectStates } from "../../project.types";

/**
 * Type representing the parameters for the ProjectDetails component.
 *
 * @property {string} slug - The unique identifier (slug) of the project.
 * @property {ProjectDetailsTabs} tab - The current active tab in the project details.
 */
type ProjectDetailsPageParams = {
  slug: string;
  tabId?: ProjectFormTabs;
};

/**
 * ProjectDetailsPage component displays detailed information about a specific project.
 *
 * This component fetches and displays project data based on the URL slug parameter.
 * It handles loading states, error cases, and renders the project information
 * with a tabbed interface for different sections of content.
 *
 * @component
 * @returns {JSX.Element} The rendered ProjectDetailsPage component
 */
export const ProjectDetailsPage: React.FC = () => {
  const { slug, tabId } = useParams<ProjectDetailsPageParams>(),
    { data: wallet } = useWalletClient(),
    { data, ...project } = useProject(slug);

  const navigate = useNavigate();

  /**
   * Array of tabs to be excluded from the project details view.
   * @type {ProjectFormTabs[]}
   */
  const excludedTabs = [
    ProjectFormTabs.BASIC_INFORMATION,
    ProjectFormTabs.DOCUMENTATION,
    ProjectFormTabs.SOCIAL_NETWORKS,
    ProjectFormTabs.TOKEN_INFORMATION,
  ];

  /**
   * Array of tab objects for display in the project details interface.
   * Each tab object contains an id and label.
   *
   * @type {Array<{id: ProjectFormTabs, label: string}>}
   * @remarks
   * - Filters out excluded tabs defined in `excludedTabs`
   * - Maps remaining tabs to objects with id and label properties
   * - Labels are retrieved from ProjectTabLabels mapping
   */
  const currentTabs = Object.values(ProjectFormTabs)
    .filter((tab) => !excludedTabs.includes(tab))
    .map((tab) => ({
      id: tab,
      label: ProjectTabLabels[tab],
    }));

  /**
   * Renders an action card based on the current state of the project.
   *
   * @returns {JSX.Element | null} The rendered action card component or null if no matching state is found
   *
   * @remarks
   * - Returns a ProjectEvaluation component if the project state is SENT_TO_REVIEW
   * - Returns null for any other project state
   */
  const renderActionCard = (): JSX.Element | null => {
    if (!data || !wallet) return null;

    switch (data.state) {
      case ProjectStates.UPCOMING:
        return (
          <ProjectRegister
            registration={{
              limitDate: data.startDate,
              count: 5000,
            }}
            user={{
              tier: {
                id: 6,
                name: "Tier 1",
              },
              investment: {
                value: 1000,
                max: {
                  value: 1000,
                  currency: {
                    name: "USD",
                  },
                },
              },
              isRegistered: false,
            }}
            onClick={() => {}}
            isLoading={false}
          />
        );

      case ProjectStates.READY_TO_VOTE:
        return (
          <ProjectVoting
            votation={{
              limitDate: data.startDate,
              count: [5000, 5533],
            }}
            user={{
              vote: undefined,
            }}
            onClick={() => {}}
            isLoading={undefined}
          />
        );

      case ProjectStates.SENT_TO_REVIEW:
        return (
          <ProjectEvaluation
            projectId={data.id}
            admin={{
              wallet: wallet.account.address,
            }}
          />
        );

      default:
        return null;
    }
  };

  /**
   * Renders the content for a specific project tab based on the tab ID.
   *
   * @param {ProjectFormTabs} tabId - The ID of the tab to render
   * @returns {JSX.Element | null} The rendered tab content component or null if no matching tab is found
   *
   * @example
   * ```tsx
   * renderTab(ProjectFormTabs.TOKEN_INFORMATION)
   * ```
   */
  const renderTab = () => {
    if (!data) return null;

    switch (tabId) {
      case ProjectFormTabs.VESTING_OPTIONS:
        return (
          <Card className={classNames(styles.grid, styles.labels)}>
            <DataLabel
              label={"Token Listing"}
              value={format(new Date(data.TGEDate), "EEEE, MMMM do, yyyy 'at' h:mm a")}
            />
            <DataLabel label={"Tokens Unlocked at TGE"} value={formatPrice(data.unlockTokensTGE, data.tokenName)} />
            <DataLabel label={"Cliff Period"} value={`${data.cliff} days`} />
            <DataLabel label={"Vesting Duration"} value={`${data.vestingDays} days`} />
          </Card>
        );

      default:
      case ProjectFormTabs.RAISING_FUNDS:
        return (
          <Card className={classNames(styles.grid, styles.labels)}>
            <DataLabel label={"Currency"} value={data.currency.name} />
            <DataLabel label={"Token For Sale"} value={formatPrice(data.tokensForSale, data.currency.name)} />
            <DataLabel
              label={"ICO Start date"}
              value={format(new Date(data.startDate), "EEEE, MMMM do, yyyy 'at' h:mm a")}
            />
            <div className={styles.grid}>
              <div className={classNames(styles.grid, styles.two)}>
                <DataLabel label={"Amount to Raise"} value={formatPrice(data.amountToRaise, data.currency.name)} />
                <DataLabel label={"Threshold"} value={`${data.threshold}%`} />
              </div>
              <ThresholdCalculator
                currency={data.currency}
                amountToRaise={data.amountToRaise}
                threshold={data.threshold}
              />
            </div>
          </Card>
        );
    }
  };

  /**
   * Renders a loader if the project data is still loading.
   *
   * @returns {JSX.Element} The loader component.
   */
  if (project.isLoading && !data) {
    return <Loader variant={"full"} size={42} />;
  }

  /**
   * Renders an error page if the project data is not found or unavailable.
   *
   * @returns {JSX.Element} The error page component.
   */
  if (!slug || (!project.isLoading && !data) || !data) {
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
   * Redirects to the default project details tab (RAISING_FUNDS) if no tab is specified.
   * This ensures that users always see a valid tab when viewing project details.
   *
   * @returns {JSX.Element} Navigate component redirecting to the default project tab
   */
  if (!tabId) {
    return <Navigate to={getRoute(PROJECT_ROUTES.PROJECT_DETAILS, { slug, tabId: ProjectFormTabs.RAISING_FUNDS })} />;
  }

  return (
    <div className={styles.layout}>
      <ProjectHeader {...data} />

      <div className={styles.container}>
        {renderActionCard()}

        <Tabs<ProjectFormTabs>
          size={"large"}
          tabs={currentTabs}
          activeId={tabId}
          onChange={(tabId) => navigate(getRoute(PROJECT_ROUTES.PROJECT_DETAILS, { slug, tabId }))}
          onRender={renderTab()}
        />
      </div>
    </div>
  );
};

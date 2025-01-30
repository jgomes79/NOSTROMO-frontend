import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { getRoute } from "@/lib/router";
import { Button } from "@/shared/components/Button";
import { Loader } from "@/shared/components/Loader";
import { Tabs } from "@/shared/components/Tabs";
import { ErrorPage } from "@/shared/pages/ErrorPage";

import styles from "./ProjectDetailsPage.module.scss";
import { ProjectHeader } from "../../components/ProjectHeader";
import { useProject } from "../../hooks/useProject";
import { PROJECT_ROUTES, ProjectTabLabels } from "../../project.constants";
import { ProjectFormTabs } from "../../project.types";

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
    project = useProject(slug);

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
    switch (tabId) {
      default:
      case ProjectFormTabs.TOKEN_INFORMATION:
        return <div>Hola</div>;
    }
  };

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
  if (!slug || (!project.isLoading && !project.data) || !project.data) {
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
      <ProjectHeader {...project.data} />

      <div className={styles.container}>
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

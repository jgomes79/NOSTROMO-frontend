import { useEffect } from "react";

import { RiArrowDownLine } from "react-icons/ri";

import { Button } from "@/shared/components/Button";
import { Tabs, Tab } from "@/shared/components/Tabs";

import styles from "./ProjectsListByState.module.scss";
import { useProjectsByState } from "../../hooks/useProjectsByState";
import { ProjectStates } from "../../project.types";
import { ProjectList } from "../ProjectList";
/**
 * Props for the ProjectsListByState component.
 *
 * @typedef {Object} ProjectsListByStateProps
 * @property {ProjectStates} initialState - The initial state of the projects to display.
 * @property {Tab<ProjectStates>[]} tabs - An array of tab objects representing the project states.
 */

interface ProjectsListByStateProps {
  initialState?: ProjectStates;
  tabs?: Tab<ProjectStates>[];
}

/**
 * Component that displays a list of all projects with filtering tabs.
 *
 * @component
 * @returns {JSX.Element} The rendered ProjectsListByState component.
 */
export const ProjectsListByState: React.FC<ProjectsListByStateProps> = ({
  initialState = ProjectStates.ALL,
  tabs = [],
}) => {
  const { page, isLoading, projects, total, state, fetchProjectsByState } = useProjectsByState();

  /**
   * Effect to fetch projects when state changes
   */
  useEffect(() => {
    fetchProjectsByState(0, initialState);
  }, []);

  /**
   * Props to be passed to the ProjectList component.
   *
   * @typedef {Object} ProjectListProps
   * @property {number} page - The current page number of the project list.
   * @property {boolean} isLoading - Indicates whether the project list is currently loading.
   * @property {Project[]} projects - The array of projects to be displayed.
   * @property {number} total - The total number of projects available.
   */
  const projectListProps = {
    page,
    isLoading,
    projects,
    total,
  };

  return (
    <div className={styles.tabs}>
      {tabs && tabs.length > 0 ? (
        <Tabs<ProjectStates>
          size={"large"}
          activeId={state}
          tabs={tabs}
          onRender={<ProjectList {...projectListProps} />}
          onChange={(state) => fetchProjectsByState(1, state)}
        />
      ) : (
        <ProjectList {...projectListProps} />
      )}

      {total > 4 && (
        <div className={styles.actions}>
          <Button
            caption="Show more"
            iconRight={<RiArrowDownLine />}
            onClick={() => fetchProjectsByState(page + 1, state)}
          />
        </div>
      )}
    </div>
  );
};

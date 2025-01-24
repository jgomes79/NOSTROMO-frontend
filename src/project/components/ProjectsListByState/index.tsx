import { useEffect } from "react";

import { RiArrowDownLine } from "react-icons/ri";

import { useProjectsByState } from "@/project/hooks/useProjectsByState";
import { ProjectStates } from "@/project/project.types";
import { Button } from "@/shared/components/Button";
import { Tabs } from "@/shared/components/Tabs";

import styles from "./ProjectsListByState.module.scss";
import { ProjectList } from "../ProjectList";

/**
 * Component that displays a list of all projects with filtering tabs
 *
 * @component
 * @returns {JSX.Element} The rendered ProjectsListByState component
 */
export const ProjectsListByState = () => {
  const { page, isLoading, projects, total, state, fetchProjectsByState } = useProjectsByState();

  /**
   * Effect to fetch projects when state changes
   */
  useEffect(() => {
    fetchProjectsByState(0, state);
  }, [state]);

  /**
   * Array of project states with their respective IDs and labels.
   *
   * @type {Array<{ id: ProjectStates, label: string }>}
   */
  const projectStates = [
    {
      id: ProjectStates.FUNDING_PHASE_1,
      label: "Active",
    },
    {
      id: ProjectStates.UPCOMING,
      label: "Upcoming",
    },
    {
      id: ProjectStates.CLOSED,
      label: "Closed",
    },
  ];

  return (
    <div className={styles.tabs}>
      <Tabs<ProjectStates>
        size={"large"}
        activeId={state}
        tabs={projectStates}
        onRender={<ProjectList page={page} isLoading={isLoading} projects={projects} total={total} />}
        onChange={(state) => fetchProjectsByState(1, state)}
      />

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

import { useCallback, useState } from "react";

import { useProjects } from "./useProjects";
import { Project, ProjectStates } from "../project.types";

type UseProjectsProps = {
  page: number;
  state: ProjectStates;
  total: number;
  projects: Project[];
  isLoading: boolean;
  fetchProjects: (page: number, state: ProjectStates) => void;
};

type NavigationState = { page: number; state: ProjectStates };

/**
 * Custom hook to manage the state and data fetching for projects.
 *
 * @returns {UseProjectsControllerResult} - The result object containing the current page, state, setters for page and state, and the fetched data.
 */
export const useProjectsController = (): UseProjectsProps => {
  const [pagination, setState] = useState<NavigationState>({
    page: 1,
    state: ProjectStates.FUNDING_PHASE_1,
  });
  const projects = useProjects(pagination.page, pagination.state);

  /**
   * Fetches projects based on the provided page number and state.
   *
   * @param {number} page - The page number to fetch.
   * @param {ProjectStates} state - The state of the projects to fetch.
   */
  const fetchProjects = useCallback(
    (page: number, state: ProjectStates) => {
      setState({ page, state });
    },
    [projects],
  );

  return {
    page: pagination.page,
    state: pagination.state,

    total: projects.data?.count || 0,
    projects: projects.data?.projects || [],
    isLoading: projects.isLoading,

    fetchProjects,
  };
};

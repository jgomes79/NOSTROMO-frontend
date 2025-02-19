import { useCallback, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getProjects } from "../project.service";
import { Project, ProjectStates } from "../project.types";

/**
 * Props returned by the useProjectsByState hook
 * @typedef {Object} UseProjectsProps
 * @property {number} page - Current page number
 * @property {ProjectStates} state - Current project state filter
 * @property {number} total - Total number of projects
 * @property {Project[]} projects - Array of projects for current page and state
 * @property {boolean} isLoading - Loading state indicator
 * @property {function} fetchProjectsByState - Function to fetch projects for a specific page and state
 */
type UseProjectsProps = {
  page: number;
  state: ProjectStates;
  total: number;
  projects: Project[];
  isLoading: boolean;
  fetchProjectsByState: (page: number, state: ProjectStates) => void;
};

/**
 * Result type for project queries
 * @typedef {Object} UseProjectsResult
 * @property {number} count - Total number of projects matching the query
 * @property {Project[]} projects - Array of project objects returned from the query
 */
export type UseProjectsResult = {
  count: number;
  projects: Project[];
};

/**
 * State object for managing pagination and project state
 * @typedef {Object} NavigationState
 * @property {number} page - Current page number
 * @property {ProjectStates} state - Current project state filter
 */
type NavigationState = { page: number; state: ProjectStates };

/**
 * Custom hook to manage the state and data fetching for projects.
 *
 * @returns {Object} UseProjectsProps object containing:
 * - page: Current page number
 * - state: Current project state filter
 * - total: Total number of projects
 * - projects: Array of projects for current page and state
 * - isLoading: Loading state indicator
 * - fetchProjectsByState: Function to fetch projects for a specific page and state
 */
export const useProjectsByState = (): UseProjectsProps => {
  const [{ page, state }, setState] = useState<NavigationState>({
    page: 0,
    state: ProjectStates.FUNDING_PHASE_1,
  });

  const projects = useQuery<UseProjectsResult>({
    queryKey: ["projects", page, state],
    queryFn: async () => {
      const { count, rows } = await getProjects(page, state);

      return {
        count,
        projects: rows,
      };
    },
  });

  /**
   * Updates pagination state to fetch projects for the specified page and state.
   * This triggers a re-fetch of projects through the useProjects hook.
   *
   * @param {number} page - The page number to fetch
   * @param {ProjectStates} state - The project state to filter by
   */
  const fetchProjectsByState = useCallback(
    (page: number, state: ProjectStates) => {
      setState({ page, state });
    },
    [projects],
  );

  return {
    page,
    state,

    total: projects.data?.count || 0,
    projects: projects.data?.projects || [],
    isLoading: projects.isLoading || projects.isFetching,

    fetchProjectsByState,
  };
};

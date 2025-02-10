import { useCallback, useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { getProjectsByWallet } from "../project.service";
import { Project, ProjectStates } from "../project.types";

/**
 * Props returned by the useProjectsByWallet hook
 * @interface UseProjectsByWalletProps
 * @property {number} page - Current page number
 * @property {ProjectStates} state - Current project state filter
 * @property {number} total - Total number of projects
 * @property {Project[]} projects - Array of projects for current page and state
 * @property {boolean} isLoading - Loading state indicator
 * @property {(page: number, state: ProjectStates) => void} fetchProjectsByWallet - Function to fetch projects for a specific page and state
 */
type UseProjectsByWalletProps = {
  page: number;
  state: ProjectStates;
  total: number;
  projects: Project[];
  isLoading: boolean;
  isFetching: boolean;
  fetchProjectsByWallet: (page: number, state: ProjectStates) => void;
};

/**
 * Result type for project queries by wallet
 * @interface UseProjectByWalletResult
 * @property {number} count - Total number of projects matching the query
 * @property {Project[]} projects - Array of project objects returned from the query
 */
export type UseProjectByWalletResult = {
  count: number;
  projects: Project[];
};

/**
 * State object for managing pagination and project state
 * @interface NavigationState
 * @property {number} page - Current page number
 * @property {ProjectStates} state - Current project state filter
 */
type NavigationState = { page: number; state: ProjectStates };

type UseProjectsByWalletParams = {
  limit?: number;
};

/**
 * Custom hook to manage the state and data fetching for projects by wallet address.
 *
 * @param {Project["owner"]["wallet"] | null} walletAddress - The wallet address to fetch projects for
 * @returns {UseProjectsByWalletProps} Object containing:
 * - page: Current page number
 * - state: Current project state filter
 * - total: Total number of projects
 * - projects: Array of projects for current page and state
 * - isLoading: Loading state indicator
 * - fetchProjectsByWallet: Function to fetch projects for a specific page and state
 */
export const useProjectsByWallet = (
  walletAddress: Project["owner"]["wallet"] | null,
  params: UseProjectsByWalletParams,
): UseProjectsByWalletProps => {
  const [{ page, state }, setState] = useState<NavigationState>({
    page: 0,
    state: ProjectStates.ALL,
  });

  const [response, setResponse] = useState<UseProjectByWalletResult>({
    count: 0,
    projects: [],
  });

  const projects = useQuery<UseProjectByWalletResult>({
    queryKey: ["projects", walletAddress, page, state, params.limit],
    initialData: {
      count: 0,
      projects: [],
    },
    queryFn: async (): Promise<UseProjectByWalletResult> => {
      if (!walletAddress)
        return {
          count: 0,
          projects: [],
        };

      const { count, rows } = await getProjectsByWallet(walletAddress, state, page, params.limit ?? 4);

      return {
        count,
        projects: rows,
      };
    },
    enabled: !!walletAddress,
  });

  /**
   * Updates pagination state to fetch projects for the specified page and state.
   * This triggers a re-fetch of projects through the useQuery hook.
   *
   * @param {number} page - The page number to fetch
   * @param {ProjectStates} state - The project state to filter by
   * @returns {void}
   */
  const fetchProjectsByWallet = useCallback(
    (page: number, state: ProjectStates) => {
      setState({ page, state });
    },
    [projects],
  );

  useEffect(() => {
    if (page === 0) {
      setResponse({
        count: projects.data?.count || 0,
        projects: projects.data?.projects || [],
      });
    } else {
      setResponse((prevResponse) => ({
        ...prevResponse,
        projects: [...prevResponse.projects, ...(projects.data?.projects || [])],
      }));
    }
  }, [page, projects.data?.projects]);

  return {
    page,
    state,
    total: response.count,
    projects: response.projects,
    isLoading: projects.isLoading || projects.isFetching,
    isFetching: projects.isRefetching,
    fetchProjectsByWallet,
  };
};

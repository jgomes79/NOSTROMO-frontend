import { useQuery } from "@tanstack/react-query";

import { UseProjectsResult } from "./useProjectsByState";
import { getProjectsVip } from "../project.service";

/**
 * Custom hook to fetch VIP projects.
 *
 * This hook uses the `useQuery` from React Query to fetch a list of VIP projects
 * from the projects service. It returns the query result, which includes loading
 * state and the fetched data.
 *
 * @returns {Object} The result of the query, including:
 * - data: The fetched VIP projects.
 * - isLoading: A boolean indicating if the query is currently loading.
 * - isError: A boolean indicating if there was an error during the fetch.
 * - refetch: A function to manually refetch the data.
 */
export const useProjectsVip = () => {
  const projects = useQuery<UseProjectsResult>({
    queryKey: ["projects", "vip"],
    queryFn: async () => {
      const { count, rows } = await getProjectsVip();

      return {
        count,
        projects: rows,
      };
    },
  });

  return {
    total: projects.data?.count || 0,
    projects: projects.data?.projects || [],
    isLoading: projects.isLoading || projects.isFetching,

    refetch: projects.refetch,
  };
};

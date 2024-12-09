import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { getProjects } from "../project.service";
import { Project, ProjectStates } from "../project.types";

type UseProjectsResult = {
  count: number;
  projects: Project[];
};

/**
 * Custom hook to fetch a list of projects by their state and page number using react-query.
 *
 * @param {number} page - The page number to fetch.
 * @param {ProjectStates} state - The state of the projects to fetch.
 * @returns {UseQueryResult<{ count: number; projects: Project[] }>} - The result object containing the total count of projects and an array of project data.
 */
export const useProjects = (page: number, state: ProjectStates): UseQueryResult<UseProjectsResult> =>
  useQuery<UseProjectsResult>({
    queryKey: ["projects", page, state],
    queryFn: async () => {
      const { count, rows } = await getProjects(page, state);

      return {
        count,
        projects: rows,
      };
    },
  });

import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { getProjectById } from "../project.service";
import { Project } from "../project.types";

/**
 * Custom hook to fetch a project by its ID using react-query.
 *
 * @param {Project["id"]} [id] - The unique identifier (ID) of the project.
 * @returns {UseQueryResult<Project | null>} - The result object containing the project data or null.
 */
export const useProjectById = (id?: Project["id"]): UseQueryResult<Project | null> =>
  useQuery<Project | null>({
    queryKey: ["project", id],
    queryFn: () => {
      if (!id) return null;

      return getProjectById(id);
    },
    enabled: !!id,
  });

import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { getProjectBySlug } from "../project.service";
import { Project } from "../project.types";

/**
 * Custom hook to fetch a project by its slug using react-query.
 *
 * @param {Project["slug"]} [slug] - The unique identifier (slug) of the project.
 * @returns {UseQueryResult<Project | null>} - The result object containing the project data or null.
 */
export const useProject = (slug?: Project["slug"]): UseQueryResult<Project | null> =>
  useQuery<Project | null>({
    queryKey: ["project", slug],
    queryFn: async () => {
      if (!slug) return null;

      const project = await getProjectBySlug(slug);

      project.startDate = new Date(project.startDate);
      project.TGEDate = new Date(project.TGEDate);

      return project;
    },
    enabled: !!slug,
  });

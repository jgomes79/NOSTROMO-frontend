import { useMutation } from "@tanstack/react-query";

import { publishProject } from "../project.service";
import { Project } from "../project.types";

/**
 * Custom hook to publish an existing project.
 *
 * @returns {object} A mutation object that handles the project publishing process.
 * @example
 * ```typescript
 * const { mutate, isLoading } = usePublishProject();
 *
 * const handlePublish = () => {
 *   mutate("123");
 * };
 * ```
 */
export const usePublishProject = () => {
  return useMutation({
    mutationFn: async (projectId: Project["id"]) => {
      return publishProject(projectId);
    },
  });
};

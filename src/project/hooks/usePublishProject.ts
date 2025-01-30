import { useMutation } from "@tanstack/react-query";

import { publishProject } from "../project.service";
import { Project } from "../project.types";

/**
 * Parameters for publishing a project
 */
interface PublishProjectParams {
  /** The unique identifier of the project to be published */
  projectId: Project["id"];
}

/**
 * Custom hook to publish an existing project.
 *
 * @returns A mutation object that handles the project publishing process
 * @example
 * ```typescript
 * const { mutate, isLoading } = usePublishProject();
 *
 * const handlePublish = () => {
 *   mutate({ projectId: "123" });
 * };
 * ```
 */
export const usePublishProject = () => {
  return useMutation({
    mutationFn: async ({ projectId }: PublishProjectParams) => {
      return publishProject(projectId);
    },
    onSuccess: (data) => {
      console.log({ data });
    },
  });
};

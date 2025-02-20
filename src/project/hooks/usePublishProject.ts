import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";

import { ToastIds, useToast } from "@/core/toasts/hooks/useToast";
import { getRoute } from "@/lib/router";

import { PROJECT_ROUTES } from "../project.constants";
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
  const navigate = useNavigate(),
    { createToast } = useToast();

  return useMutation<Project, Error, Project["id"]>({
    mutationFn: async (projectId: Project["id"]) => {
      return publishProject(projectId);
    },
    onSuccess: (data) => {
      createToast(ToastIds.CONFIRMATION, {
        type: "success",
        title: "Project published successfully",
        description: "Your project has been published and is now visible to the public.",
      });

      navigate(getRoute(PROJECT_ROUTES.PROJECT_DETAILS, { slug: data.slug }));
    },
  });
};

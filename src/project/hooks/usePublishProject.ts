import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";

import { ToastIds, useToast } from "@/core/toasts/hooks/useToast";
import { getRoute } from "@/lib/router";
import { useCreateProject } from "@/wallet/hooks/useCreateProject";
import { useQubicConnect } from "@/wallet/qubic/QubicConnectContext";

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
  const navigate = useNavigate();
  const { createToast } = useToast();
  const { wallet } = useQubicConnect();
  const createProjectSC = useCreateProject(); // Smart contract hook

  return useMutation<Project, Error, Project["id"]>({
    mutationFn: async (projectId: Project["id"]) => {
      // First, publish in the database
      const publishedProject = await publishProject(projectId);

      // Then, create the project on the smart contract
      if (wallet?.publicKey) {
        console.log("📝 Publishing project to smart contract...");
        try {
          await createProjectSC.mutate(publishedProject);
          console.log("✅ Project published to smart contract successfully");
        } catch (error) {
          console.error("❌ Failed to publish to smart contract:", error);
          // Note: We could decide whether to fail the whole operation or just warn
          // For now, let's just log the error and continue
        }
      }

      return publishedProject;
    },
    onSuccess: (data) => {
      createToast(ToastIds.CONFIRMATION, {
        type: "success",
        title: "Project published successfully",
        description: "Your project has been published to the database and smart contract.",
      });

      navigate(getRoute(PROJECT_ROUTES.PROJECT_DETAILS, { slug: data.slug }));
    },
  });
};

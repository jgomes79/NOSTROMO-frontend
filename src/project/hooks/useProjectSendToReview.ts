import { useMutation } from "@tanstack/react-query";
import { sendProjectToReview } from "../project.service";
import { Project } from "../project.types";

/**
 * Props for the useProjectSendToReview hook.
 *
 * @property {Project["id"]} projectId - The unique identifier of the project to send to review.
 */
interface ProjectSendToReviewProps {
  projectId: Project["id"];
}

/**
 * Custom hook to send a project to review.
 *
 * @returns {Object} The mutation object containing:
 * - mutate: A function to trigger the project send to review.
 * - isLoading: A boolean indicating if the mutation is currently loading.
 * - isError: A boolean indicating if there was an error during the mutation.
 * - data: The response data from the mutation, if any.
 */
export const useProjectSendToReview = () => {
  return useMutation({
    mutationFn: async ({ projectId }: ProjectSendToReviewProps) => {
      return await sendProjectToReview(projectId);
    },
  });
};

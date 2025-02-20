import { useMutation } from "@tanstack/react-query";

import { User } from "@/user/user.types";

import { reviewProject, ReviewProjectData } from "../project.service";
import { Project } from "../project.types";

interface ReviewProjectProps {
  id: Project["id"];
  wallet: User["wallet"];
  data: ReviewProjectData;
}

/**
 * Custom hook to handle the review of a project.
 *
 * This hook uses the `useMutation` from React Query to submit a review for a specific project.
 * It returns a mutation object that can be used to trigger the review submission and track its state.
 *
 * @returns {Object} The mutation object containing:
 * - mutate: A function to trigger the review submission.
 * - isLoading: A boolean indicating if the mutation is currently loading.
 * - isError: A boolean indicating if there was an error during the mutation.
 * - data: The response data from the mutation, if any.
 */
export const useReviewProject = () => {
  return useMutation<void, Error, ReviewProjectProps>({
    mutationFn: ({ id, wallet, data }) => reviewProject(id, wallet, data),
  });
};

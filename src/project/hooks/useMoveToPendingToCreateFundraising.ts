import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ToastIds, useToast } from "@/core/toasts/hooks/useToast";

import { User } from "@/user/user.types";
import { moveToPendingToCreateFundraising } from "../project.service";
import { Project } from "../project.types";

interface MoveToPendingToCreateFundraisingProps {
  projectId: Project["id"];
  wallet: User["wallet"];
}

/**
 * Custom hook to move a project to the pending to create fundraising phase.
 *
 * This hook provides a mutation function that moves a project from its current state
 * to the pending to create fundraising phase, which is typically used after a project
 * has completed the voting phase and is ready to have its fundraising contract created
 * on the blockchain.
 *
 * @returns {object} A mutation object that handles the project state transition.
 * @property {Function} mutate - Function to trigger the mutation with project ID and wallet.
 * @property {boolean} isPending - Indicates if the mutation is currently in progress.
 * @property {boolean} isError - Indicates if the mutation failed.
 * @property {boolean} isSuccess - Indicates if the mutation completed successfully.
 * @property {Error | null} error - The error object if the mutation failed.
 * @property {Function} reset - Function to reset the mutation state.
 *
 * @example
 * ```typescript
 * const moveToPendingToCreateFundraising = useMoveToPendingToCreateFundraising();
 *
 * const handleMoveToPendingToCreateFundraising = async () => {
 *   await moveToPendingToCreateFundraising.mutateAsync({
 *     projectId: "123",
 *     wallet: "wallet-address"
 *   });
 * };
 * ```
 */
export const useMoveToPendingToCreateFundraising = () => {
  const queryClient = useQueryClient();
  const { createToast } = useToast();

  return useMutation({
    mutationFn: async ({ projectId, wallet }: MoveToPendingToCreateFundraisingProps) => {
      return await moveToPendingToCreateFundraising(projectId, wallet);
    },
    onSuccess: (data: Project) => {
      queryClient.invalidateQueries({ queryKey: ["project", data.slug] });
      createToast(ToastIds.CONFIRMATION, {
        type: "success",
        title: "Project moved to pending to create fundraising successfully",
        description: "Your project has been moved to the pending to create fundraising phase.",
      });
    },
  });
};

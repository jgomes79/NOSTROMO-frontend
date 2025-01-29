import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { Tier } from "@/tier/tier.types";

import { setUserTier } from "../user.service";
import { User } from "../user.types";

type SetTierParams = {
  wallet: User["wallet"];
  tierId: Tier["id"];
};

/**
 * React Query mutation hook for updating a user's tier.
 *
 * @description
 * This hook provides a mutation function to update a user's tier level in the system.
 * It internally uses the setUserTier service function and wraps it in a React Query mutation.
 *
 * @returns {UseMutationResult} A React Query mutation object containing:
 * - mutate: Function to trigger the tier update
 * - isLoading: Boolean indicating if the mutation is in progress
 * - isError: Boolean indicating if the mutation encountered an error
 * - isSuccess: Boolean indicating if the mutation was successful
 * - error: Any error that occurred during the mutation
 * - data: The response data from the mutation
 *
 * @param {SetTierParams} params - The mutation parameters
 * @param {string} params.wallet - The user's wallet address
 * @param {string} params.tierId - The ID of the tier to set for the user
 *
 * @example
 * ```typescript
 * const setTier = useSetUserTier();
 *
 * // Update user's tier
 * setTier.mutate({
 *   wallet: "0x123...",
 *   tierId: "tier1"
 * });
 *
 * // Handle loading state
 * if (setTier.isLoading) {
 *   console.log("Updating tier...");
 * }
 * ```
 */
export const useSetUserTier = () => {
  const [currentTierSetting, setCurrentTierSettings] = useState<Tier["id"] | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ wallet, tierId }: SetTierParams) => setUserTier(wallet, tierId),
    onMutate: ({ tierId }) => setCurrentTierSettings(tierId),
    onError: () => setCurrentTierSettings(null),
    onSuccess: () => setCurrentTierSettings(null),
  });

  return {
    ...mutation,
    currentTierSetting,
  };
};

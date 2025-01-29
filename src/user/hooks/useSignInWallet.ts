import { useMutation } from "@tanstack/react-query";

import { signInWallet } from "../user.service";
import { User } from "../user.types";

type SignInUserParams = {
  wallet: User["wallet"];
};

/**
 * Custom hook for handling wallet sign-in mutations.
 * Uses react-query's useMutation to manage the sign-in state and process.
 *
 * @returns {UseMutationResult} A mutation object that handles the wallet sign-in process
 * @example
 * const signInMutation = useSignInWallet();
 * signInMutation.mutate({ wallet: '0x123...' });
 */
export const useSignInWallet = () =>
  useMutation({
    mutationFn: async ({ wallet }: SignInUserParams) => signInWallet(wallet),
  });

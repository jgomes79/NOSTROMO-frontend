import { useQuery } from "@tanstack/react-query";

import { useSignInWallet } from "./useSignInWallet";
import { getUserByWallet } from "../user.service";
import { User } from "../user.types";

/**
 * Custom hook to fetch user information by wallet address.
 *
 * @param {User["wallet"]} wallet - The wallet address of the user.
 * @returns {UseQueryResult<User | null>} Query result object containing:
 * - data: The user data or null if not found
 * - isLoading: Loading state boolean
 * - error: Error object if query fails
 * - and other TanStack Query result properties
 */
export const useUserByWallet = (wallet?: User["wallet"]) => {
  const signInWallet = useSignInWallet();

  return useQuery<User | null>({
    queryKey: ["user", wallet],
    queryFn: async () => {
      if (!wallet) return null;

      let user = await getUserByWallet(wallet);

      if (!user) {
        user = await signInWallet.mutateAsync({ wallet });
      }

      return user;
    },
    enabled: !!wallet,
  });
};

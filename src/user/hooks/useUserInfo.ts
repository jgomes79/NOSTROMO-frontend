import { useQuery } from "@tanstack/react-query";

import { getUserByWallet } from "../user.service";
import { User } from "../user.types";

/**
 * Custom hook to fetch user information by wallet address.
 *
 * @param {User["wallet"]} wallet - The wallet address of the user.
 * @returns {object} - The result of the query, including status and data.
 */
export const useUserInfo = (wallet: User["wallet"]) => {
  return useQuery<User>({
    queryKey: ["user", wallet],
    queryFn: () => getUserByWallet(wallet),
  });
};

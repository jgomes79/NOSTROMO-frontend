import { getEndpoint, request } from "@/core/api/api.helpers";

import { User } from "./user.types";

/**
 * Fetches a user by their wallet address.
 *
 * @param {User["wallet"]} wallet - The wallet address of the user.
 * @returns {Promise<User>} - A promise that resolves to the user data.
 */
export const getUserByWallet = (wallet: User["wallet"]): Promise<User> =>
  request<User>(getEndpoint("users-service", `/user/${wallet}`), {
    method: "GET",
  });

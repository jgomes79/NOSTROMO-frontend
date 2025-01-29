import { getEndpoint, request } from "@/core/api/api.helpers";
import { Tier } from "@/tier/tier.types";

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

/**
 * Updates the tier of a user.
 *
 * @param {User["wallet"]} wallet - The wallet address of the user.
 * @param {Tier["id"]} tierId - The ID of the tier to set for the user.
 * @returns {Promise<Tier>} - A promise that resolves to the updated tier data.
 */
export const setUserTier = (wallet: User["wallet"], tierId: Tier["id"]): Promise<Tier> =>
  request<Tier>(getEndpoint("users-service", `/user/${wallet}/tier/${tierId}`), {
    method: "PUT",
  });

/**
 * Signs in a user with their wallet address.
 *
 * @param {User["wallet"]} wallet - The wallet address of the user to sign in.
 * @returns {Promise<User>} - A promise that resolves to the signed-in user data.
 */
export const signInWallet = (wallet: User["wallet"]): Promise<User> =>
  request<User>(getEndpoint("users-service", `/user/${wallet}`), {
    method: "POST",
  });

import { useUserByWallet } from "./useUserByWallet";

/**
 * Custom hook to manage user authentication by wallet.
 *
 * This hook retrieves the wallet client and fetches the user information
 * associated with the wallet address. If the wallet or user data is not
 * available, it returns null.
 *
 * @returns {User | null} The user data if available, otherwise null.
 */
export const useAuth = () => {
  const { wallet } = useQubicConnect(),
    user = useUserByWallet(wallet.publicKey);

  if (!wallet?.publicKey || !user.data) return null;

  return user;
};

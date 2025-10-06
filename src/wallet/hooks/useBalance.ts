import { create } from "zustand";

import { fetchBalance } from "../../lib/nostromo/services/rpc.service";
import { useQubicConnect } from "../qubic/QubicConnectContext";

interface Store {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  balance: number;
  setBalance: (tierLevel: number) => void;
}

/**
 * Store for managing tier level state
 */
const store = create<Store>((set) => ({
  /** Loading state */
  isLoading: true,

  /** Function to update loading state
   * @param isLoading - New loading state value
   */
  setLoading: (isLoading: boolean) => set({ isLoading }),

  /** Current tier level */
  balance: 0,

  /** Function to update tier level
   * @param balance - New tier level value
   */
  setBalance: (balance: number) => set({ balance }),
}));

/**
 * Hook for interacting with contract tier functionality
 * @returns Object containing loading state, fetch function and tier level data
 */
export const useBalance = () => {
  const { wallet } = useQubicConnect();
  const { isLoading, setLoading, balance, setBalance } = store();

  /**
   * Fetches the current balance for the connected wallet
   * @returns void
   * @throws Will not fetch if wallet public key is missing
   */
  const refetch = async () => {
    if (!wallet?.publicKey) {
      return;
    }

    setLoading(true);
    try {
      const balanceData = await fetchBalance(wallet.publicKey);
      const balanceAmount = parseInt(balanceData.balance) || 0;
      setBalance(balanceAmount);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance(0);
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    refetch,
    data: {
      balance,
    },
  };
};

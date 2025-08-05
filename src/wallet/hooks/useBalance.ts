import { create } from "zustand";

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
  const { getBalance, wallet } = useQubicConnect();
  const { isLoading, setLoading, balance, setBalance } = store();

  /**
   * Fetches the current tier level for the connected wallet
   * @returns void
   * @throws Will not fetch if httpEndpoint or wallet public key is missing
   */
  const refetch = async () => {
    if (!wallet || !wallet?.publicKey) {
      return;
    }

    setLoading(true);
    try {
      const {
        balance: { balance },
      } = await getBalance(wallet.publicKey);
      setBalance(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
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

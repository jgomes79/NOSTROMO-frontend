import { useState } from "react";

import { create } from "zustand";

import { getTierLevelByUser } from "../qubic/contract/nostromoApi";
import { useQubicConnect } from "../qubic/QubicConnectContext";

/**
 * Store for managing tier level state
 */
const store = create<{ tierLevel: number; setTierLevel: (tierLevel: number) => void }>((set) => ({
  /** Current tier level */
  tierLevel: 0,

  /** Function to update tier level
   * @param tierLevel - New tier level value
   */
  setTierLevel: (tierLevel: number) => set({ tierLevel }),
}));

/**
 * Hook for interacting with contract tier functionality
 * @returns Object containing loading state, fetch function and tier level data
 */
export const useContractTier = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { httpEndpoint, wallet, qHelper } = useQubicConnect();
  const { tierLevel, setTierLevel } = store();

  /**
   * Fetches the current tier level for the connected wallet
   * @returns void
   * @throws Will not fetch if httpEndpoint or wallet public key is missing
   */
  const refetch = async () => {
    if (!httpEndpoint || !wallet?.publicKey) {
      return;
    }

    setLoading(true);
    try {
      const result = await getTierLevelByUser(httpEndpoint, wallet.publicKey, qHelper);
      const tierLevel = result.decodedFields?.tierLevel as number | undefined;
      setTierLevel(tierLevel ?? 0);
    } catch (error) {
      console.error("Error fetching tier level:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    refetch,
    data: {
      tierLevel,
    },
  };
};

import { create } from "zustand";

import { getTierLevelByUser, getStats } from "../qubic/contract/nostromoApi";
import { useQubicConnect } from "../qubic/QubicConnectContext";

interface Stats {
  epochRevenue: number;
  totalPoolWeight: number;
  numberOfRegister: number;
  numberOfCreatedProject: number;
  numberOfFundraising: number;
}

interface Store {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  tierLevel: number;
  setTierLevel: (tierLevel: number) => void;

  stats: Stats;
  setStats: (stats: Stats) => void;
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
  tierLevel: 0,

  /** Function to update tier level
   * @param tierLevel - New tier level value
   */
  setTierLevel: (tierLevel: number) => set({ tierLevel }),

  stats: {
    epochRevenue: 0,
    totalPoolWeight: 0,
    numberOfRegister: 0,
    numberOfCreatedProject: 0,
    numberOfFundraising: 0,
  },

  setStats: (stats: Stats) => set({ stats }),
}));

/**
 * Hook for interacting with contract tier functionality
 * @returns Object containing loading state, fetch function and tier level data
 */
export const useContractTier = () => {
  const { httpEndpoint, wallet, qHelper } = useQubicConnect();
  const { isLoading, setLoading, tierLevel, setTierLevel, stats, setStats } = store();

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

      const stat = await getStats(httpEndpoint, qHelper);
      const statLevel = stat.decodedFields as unknown as Stats;
      console.log("statLevel", statLevel);
      setStats(statLevel as Stats);
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
      stats,
    },
  };
};

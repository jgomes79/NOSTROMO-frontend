import { create } from "zustand";

import { getStats, getTierLevelByUser } from "../../lib/nostromo/services/nostromo.service";
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
  const { wallet } = useQubicConnect();
  const { isLoading, setLoading, tierLevel, setTierLevel, stats, setStats } = store();

  /**
   * Fetches the current tier level for the connected wallet
   * @returns void
   * @throws Will not fetch if httpEndpoint or wallet public key is missing
   */
  const refetch = async () => {
    if (!wallet?.publicKey) {
      return;
    }

    setLoading(true);
    try {
      const tierLevel = await getTierLevelByUser(wallet.publicKey);
      setTierLevel(tierLevel);

      const stats = await getStats();
      console.log("stats", stats);
      setStats(stats);
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

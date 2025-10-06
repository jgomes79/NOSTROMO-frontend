import { create } from "zustand";

import { getUserVoteStatus } from "../../lib/nostromo/services/nostromo.service";
import { useQubicConnect } from "../qubic/QubicConnectContext";

export interface ProjectIndexList {
  [key: number]: number;
}

interface Store {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  userVotes: number;
  setUserVotes: (userVotes: number) => void;
  projectIndexList: ProjectIndexList[];
  setProjectIndexList: (projectIndexList: ProjectIndexList[]) => void;
  isError: boolean;
  setIsError: (isError: boolean) => void;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
}

/**
 * Store for managing user votes state
 */
const store = create<Store>((set) => ({
  /** Loading state */
  isLoading: true,

  /** Function to update loading state
   * @param isLoading - New loading state value
   */
  setLoading: (isLoading: boolean) => set({ isLoading }),

  /** Current user votes */
  userVotes: 0,

  /** Function to update user votes
   * @param userVotes - New user votes value
   */
  setUserVotes: (userVotes: number) => set({ userVotes }),

  /** Current project index list */
  projectIndexList: [],

  /** Function to update project index list
   * @param projectIndexList - New project index list value
   */
  setProjectIndexList: (projectIndexList: ProjectIndexList[]) => set({ projectIndexList }),

  /** Error state */
  isError: false,

  /** Function to update error state
   * @param isError - New error state value
   */
  setIsError: (isError: boolean) => set({ isError }),

  /** Error message */
  errorMessage: "",

  /** Function to update error message
   * @param errorMessage - New error message value
   */
  setErrorMessage: (errorMessage: string) => set({ errorMessage }),
}));

/**
 * Hook for interacting with contract user votes functionality
 * @returns Object containing loading state, fetch function and user votes data
 */
export const useContractUserVotes = () => {
  const { wallet } = useQubicConnect();
  const {
    isLoading,
    setLoading,
    userVotes,
    setUserVotes,
    projectIndexList,
    setProjectIndexList,
    isError,
    setIsError,
    errorMessage,
    setErrorMessage,
  } = store();

  /**
   * Fetches the current user votes for the connected wallet
   * @returns void
   * @throws Will not fetch if wallet public key is missing
   */
  const refetch = async () => {
    if (!wallet?.publicKey) {
      return;
    }

    setLoading(true);
    setIsError(false);
    setErrorMessage("");
    try {
      const result = await getUserVoteStatus(wallet.publicKey);
      console.log("User vote status:", result);
      setUserVotes(result.numberOfVotedProjects);
      setProjectIndexList(result.projectIndexList as unknown as ProjectIndexList[]);
    } catch (error) {
      console.error("Error fetching user votes:", error);
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    refetch,
    data: {
      numberOfVotedProjects: userVotes,
      projectIndexList,
    },
    isError,
    errorMessage,
  };
};

import { create } from "zustand";

import { TransactionResult } from "../qubic/contract/contractApi";
import { voteInProject, waitForTxReceipt } from "../qubic/contract/nostromoApi";
import { useQubicConnect } from "../qubic/QubicConnectContext";

interface Store {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  isError: boolean;
  setError: (isError: boolean) => void;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
  txHash: string;
  setTxHash: (txHash: string) => void;
}

/**
 * Store for managing vote state
 */
const store = create<Store>((set) => ({
  /** Loading state */
  isLoading: false,

  /** Function to update loading state
   * @param isLoading - New loading state value
   */
  setLoading: (isLoading: boolean) => set({ isLoading }),

  /** Error state */
  isError: false,

  /** Function to update error state
   * @param isError - New error state value
   */
  setError: (isError: boolean) => set({ isError }),

  /** Error message */
  errorMessage: "",

  /** Function to update error message
   * @param errorMessage - New error message value
   */
  setErrorMessage: (errorMessage: string) => set({ errorMessage }),

  /** Transaction hash */
  txHash: "",

  /** Function to update transaction hash
   * @param txHash - New transaction hash value
   */
  setTxHash: (txHash: string) => set({ txHash }),
}));

/**
 * Custom hook for voting on projects in the Nostromo contract.
 *
 * @returns {Object} An object containing the voting state and mutation function
 *
 * @example
 * ```tsx
 * const { isLoading, mutate, isError, errorMessage, txHash, reset } = useVote();
 *
 * const handleVote = async () => {
 *   try {
 *     await mutate({ indexOfProject: 1, decision: true });
 *     console.log('Vote successful!', txHash);
 *   } catch (error) {
 *     console.error('Vote failed:', errorMessage);
 *   }
 * };
 * ```
 */
export const useVote = () => {
  const { isLoading, setLoading, isError, setError, errorMessage, setErrorMessage, txHash, setTxHash } = store();
  const qubicConnect = useQubicConnect();

  /**
   * Executes a vote transaction for a specific project.
   *
   * @param {VoteParams} params - The voting parameters
   * @param {number} params.indexOfProject - The index of the project to vote on
   * @param {boolean} params.decision - The voting decision (true for yes, false for no)
   * @throws {Error} Throws an error if the transaction fails
   */
  const mutate = async (indexOfProject: number, decision: boolean): Promise<void> => {
    try {
      setLoading(true);
      setError(false);
      setErrorMessage("");

      const result: TransactionResult = await voteInProject(qubicConnect, indexOfProject, decision);

      if (result.success) {
        setTxHash(result.txHash || "");
        await waitForTxReceipt(qubicConnect.httpEndpoint, result.txHash || "");
      } else {
        setError(true);
        setErrorMessage(result.error || "Unknown error occurred during voting");
        throw new Error(result.error || "Vote transaction failed");
      }
    } catch (error) {
      setError(true);
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      setErrorMessage(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets the hook state to initial values.
   * Useful for clearing error states and preparing for a new vote.
   */
  const reset = (): void => {
    setLoading(false);
    setError(false);
    setErrorMessage("");
    setTxHash("");
  };

  return {
    isLoading,
    isError,
    errorMessage,
    txHash,
    reset,
    mutate,
  };
};

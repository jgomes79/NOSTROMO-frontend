import { create } from "zustand";

import { getUserVoteStatus, voteInProject } from "@/lib/nostromo/services/nostromo.service";
import { broadcastTx, fetchTickInfo } from "@/lib/nostromo/services/rpc.service";
import { useQubicConnect } from "../qubic/QubicConnectContext";
import { useTransactionMonitor } from "./useTransactionMonitor";

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
  const { wallet, getSignedTx } = useQubicConnect();
  const { isMonitoring, monitorTransaction } = useTransactionMonitor();

  /**
   * Executes a vote transaction for a specific project.
   *
   * @param {VoteParams} params - The voting parameters
   * @param {number} params.indexOfProject - The index of the project to vote on
   * @param {boolean} params.decision - The voting decision (true for yes, false for no)
   * @throws {Error} Throws an error if the transaction fails
   */
  const mutate = async (indexOfProject: number, decision: boolean): Promise<void> => {
    if (!wallet?.publicKey) {
      setError(true);
      setErrorMessage("Wallet not connected");
      return;
    }

    setLoading(true);
    setError(false);
    setErrorMessage("");

    try {
      console.log("🗳️ Starting vote process...");
      console.log("🗳️ Project index:", indexOfProject);
      console.log("🗳️ Decision:", decision ? "YES" : "NO");
      console.log("🗳️ Wallet:", wallet.publicKey);

      // Get current tick info
      console.log("🗳️ Fetching tick info...");
      const tickInfo = await fetchTickInfo();
      const targetTick = tickInfo.tick + 20; // Add offset
      console.log("🗳️ Current tick:", tickInfo.tick, "Target tick:", targetTick);

      // Get initial vote status for verification
      console.log("🗳️ Getting initial vote status...");
      const initialVoteStatus = await getUserVoteStatus(wallet.publicKey);
      const initialVotedProjects = initialVoteStatus.numberOfVotedProjects;
      console.log("🗳️ Initial voted projects:", initialVotedProjects);

      // Create the vote transaction
      console.log("🗳️ Creating vote transaction...");
      const tx = await voteInProject(wallet.publicKey, indexOfProject, decision, targetTick);
      console.log("🗳️ Vote transaction created:", tx);

      // Sign transaction - handle both WalletConnect and other wallets
      let signedResult;
      if (wallet.connectType === "walletconnect") {
        signedResult = await getSignedTx(tx);
      } else {
        const rawTx = await tx.build("0".repeat(55));
        signedResult = await getSignedTx(rawTx, rawTx.length - 64);
      }

      // Broadcast transaction
      const res = await broadcastTx(signedResult.tx);
      console.log("📡 Vote broadcast response:", res);
      console.log("📡 Response keys:", Object.keys(res || {}));

      // Check different possible response formats for transaction ID
      const txId = res?.result?.transactionId || res?.transactionId || res?.result?.id || res?.txId;
      console.log("📡 Found transaction ID:", txId);

      if (res && txId) {
        setTxHash(txId);
        setLoading(false);

        console.log("🔄 Vote transaction broadcast successful. Monitoring for confirmation...");

        // Monitor transaction with verification function
        await monitorTransaction({
          txId: txId,
          targetTick,
          verificationFunction: async () => {
            const currentVoteStatus = await getUserVoteStatus(wallet.publicKey);
            return currentVoteStatus.numberOfVotedProjects > initialVotedProjects;
          },
          onSuccess: () => {
            console.log(`🎉 Vote confirmed! Successfully voted on project ${indexOfProject}`);
          },
          onError: (error) => {
            setError(true);
            setErrorMessage(error);
          },
        });
      } else {
        console.error("❌ Vote broadcast failed - no transaction ID found");
        console.error("📡 Full response:", res);
        throw new Error("Failed to broadcast vote transaction - no transaction ID returned");
      }
    } catch (error) {
      setError(true);
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      setErrorMessage(message);
      setLoading(false);
      throw error;
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
    isMonitoring,
  };
};

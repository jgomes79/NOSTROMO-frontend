import { useState } from "react";

import { Project } from "@/project/project.types";
import { createProject, getProjectIndexListByCreator } from "../../lib/nostromo/services/nostromo.service";
import { broadcastTx, fetchTickInfo } from "../../lib/nostromo/services/rpc.service";
import { tokenNameToUint64 } from "../qubic/contract/nostromoApi";
import { useQubicConnect } from "../qubic/QubicConnectContext";
import { useTransactionMonitor } from "./useTransactionMonitor";

/**
 *
 * @returns
 */
export const useCreateProject = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const { wallet, getSignedTx } = useQubicConnect();
  const { isMonitoring, monitorTransaction } = useTransactionMonitor();

  /**
   * Creates a project on the Nostromo contract.
   *
   * @param {Project} data - The project data to create
   * @returns {Promise<number | null>} The smart contract ID or null if the project creation fails
   */
  const mutate = async (data: Project): Promise<number | null> => {
    if (!wallet?.publicKey) {
      setIsError(true);
      setErrorMessage("Wallet not connected");
      return null;
    }

    setLoading(true);
    setIsError(false);
    setErrorMessage("");

    try {
      // Use the actual dates from the form (don't override end date)
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.TGEDate || data.startDate); // Use TGEDate as endDate

      // Get current tick info
      const tickInfo = await fetchTickInfo();
      const targetTick = tickInfo.tick + 20;

      // Get initial project count for verification
      const initialProjects = await getProjectIndexListByCreator(wallet.publicKey);
      const initialProjectCount = initialProjects.indexListForProjects.length;
      console.log("🔍 Initial project count:", initialProjectCount);
      console.log("🔍 Initial projects:", initialProjects);

      // Create the project transaction
      // Based on C++ GetYear: ((data >> 26) + 24) + 2000 = actualYear
      // So: (data >> 26) = actualYear - 2024
      // For 2025: (data >> 26) = 1, so we need to send 1 << 26
      const encodeYear = (year: number) => (year - 2000) << 26;
      const encodeMonth = (month: number) => (month & 0b1111) << 22;
      const encodeDay = (day: number) => (day & 0b11111) << 17;
      const encodeHour = (hour: number) => (hour & 0b11111) << 12;

      const startDatePacked =
        encodeYear(startDate.getUTCFullYear()) |
        encodeMonth(startDate.getUTCMonth() + 1) |
        encodeDay(startDate.getUTCDate()) |
        encodeHour(startDate.getUTCHours());

      const endDatePacked =
        encodeYear(endDate.getUTCFullYear()) |
        encodeMonth(endDate.getUTCMonth() + 1) |
        encodeDay(endDate.getUTCDate()) |
        encodeHour(endDate.getUTCHours());

      console.log("🔢 Encoded dates:", {
        startDatePacked: startDatePacked.toString(16),
        endDatePacked: endDatePacked.toString(16),
        startYear: startDate.getUTCFullYear(),
        endYear: endDate.getUTCFullYear(),
      });

      const tx = await createProject(
        wallet.publicKey,
        parseInt(tokenNameToUint64(data.tokenName)),
        data.tokensForSale,
        startDate.getUTCFullYear() - 2000, // Try integration scripts approach
        startDate.getUTCMonth() + 1,
        startDate.getUTCDate(),
        startDate.getUTCHours(),
        endDate.getUTCFullYear() - 2000,
        endDate.getUTCMonth() + 1,
        endDate.getUTCDate(),
        endDate.getUTCHours(),
        targetTick,
      );

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
      console.log("📡 Full broadcast response:", res);
      console.log("📡 Response keys:", Object.keys(res || {}));
      console.log("📡 Looking for transaction ID...");

      // Check different possible response formats
      const txId = res?.result?.transactionId || res?.transactionId || res?.result?.id || res?.txId;
      console.log("📡 Found transaction ID:", txId);

      if (res && txId) {
        setTxHash(txId);

        console.log("🔄 Project creation transaction broadcast successful. Monitoring for confirmation...");

        // Monitor transaction with verification function
        // The await ensures code doesn't continue until monitoring completes
        await monitorTransaction({
          txId: txId,
          targetTick,
          verificationFunction: async () => {
            const currentProjects = await getProjectIndexListByCreator(wallet.publicKey);
            const currentProjectCount = currentProjects.indexListForProjects.length;
            return currentProjectCount > initialProjectCount;
          },
          onError: (error) => {
            setIsError(true);
            setErrorMessage(error);
            return null;
          },
        });

        const currentProjects = await getProjectIndexListByCreator(wallet.publicKey);
        const smartContractId = currentProjects.indexListForProjects[currentProjects.indexListForProjects.length - 1];
        console.log("🔍 Smart contract ID:", smartContractId);

        // Only set loading to false after monitoring completes
        setLoading(false);
        return smartContractId;
      } else {
        throw new Error("Failed to broadcast project creation transaction");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      setLoading(false);
      return null;
    }
  };

  return {
    isLoading,
    mutate,
    isError,
    errorMessage,
    txHash,
    isMonitoring,
  };
};

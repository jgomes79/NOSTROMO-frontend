import { useState } from "react";

import { getTierLevelByUser, logoutFromTier } from "../../lib/nostromo/services/nostromo.service";
import { broadcastTx, fetchTickInfo } from "../../lib/nostromo/services/rpc.service";
import { useQubicConnect } from "../qubic/QubicConnectContext";
import { useTransactionMonitor } from "./useTransactionMonitor";

/**
 *
 * @returns
 */
export const useRemoveTier = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const { wallet, getSignedTx } = useQubicConnect();
  const { isMonitoring, monitorTransaction } = useTransactionMonitor();

  const mutate = async () => {
    if (!wallet?.publicKey) {
      setIsError(true);
      setErrorMessage("Wallet not connected");
      return;
    }

    setLoading(true);
    setIsError(false);
    setErrorMessage("");

    try {
      // Get current tick info
      const tickInfo = await fetchTickInfo();
      const targetTick = tickInfo.tick + 10;

      // Get current tier level for verification
      const currentTierLevel = await getTierLevelByUser(wallet.publicKey);

      console.log(`Removing from tier ${currentTierLevel}`);

      // Create the logout transaction
      const tx = await logoutFromTier(wallet.publicKey, targetTick);

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

      if (res && res.result?.transactionId) {
        setTxHash(res.result.transactionId);
        setLoading(false);

        console.log("🔄 Tier removal transaction broadcast successful. Monitoring for confirmation...");

        // Monitor transaction with verification function
        await monitorTransaction({
          txId: res.result.transactionId,
          targetTick,
          verificationFunction: async () => {
            const updatedTierLevel = await getTierLevelByUser(wallet.publicKey);
            return updatedTierLevel === 0; // Should be 0 after logout
          },
          onSuccess: () => {
            console.log(`🎉 Tier removal confirmed! Successfully removed from tier`);
          },
          onError: (error) => {
            setIsError(true);
            setErrorMessage(error);
          },
        });
      } else {
        throw new Error("Failed to broadcast tier removal transaction");
      }
    } catch (error) {
      console.error("Error removing tier:", error);
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      setLoading(false);
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

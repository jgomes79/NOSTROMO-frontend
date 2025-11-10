import { useState } from "react";

import { useToast } from "@/core/toasts/hooks/useToast";
import { ToastIds } from "@/core/toasts/toasts.types";
import { getTierLevelByUser, registerInTier } from "../../lib/nostromo/services/nostromo.service";
import { broadcastTx, fetchTickInfo } from "../../lib/nostromo/services/rpc.service";
import { useQubicConnect } from "../qubic/QubicConnectContext";
import { useTransactionMonitor } from "./useTransactionMonitor";

/**
 * Hook for registering in a tier
 * @returns Object with loading state, mutate function, error state, and transaction hash
 */
export const useRegisterTier = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const { wallet, getSignedTx } = useQubicConnect();
  const { isMonitoring, monitorTransaction } = useTransactionMonitor();
  const { createToast } = useToast();

  const mutate = async (tierLevel: number) => {
    if (!wallet?.publicKey) {
      setIsError(true);
      setErrorMessage("Wallet not connected");
      return;
    }

    setLoading(true);
    setIsError(false);
    setErrorMessage("");

    try {
      console.log("🔄 Starting tier registration process...");

      // Get current tick info
      console.log("📡 Fetching current tick info...");
      const tickInfo = await fetchTickInfo();
      const targetTick = tickInfo.tick + 10;
      console.log(`✅ Current tick: ${tickInfo.tick}, Target tick: ${targetTick}`);

      // Create the smart contract transaction using our service
      console.log(`🔨 Creating registerInTier transaction for tier ${tierLevel}...`);
      const tx = await registerInTier(wallet.publicKey, tierLevel, targetTick);
      console.log("✅ Transaction created:", tx);

      // Sign the transaction - pass QubicTransaction directly for WalletConnect compatibility
      console.log("✍️ Requesting signature from wallet...");
      console.log("🔗 Wallet type:", wallet.connectType);

      let signedResult;
      if (wallet.connectType === "walletconnect") {
        // For WalletConnect, pass the QubicTransaction object directly (like qearn)
        signedResult = await getSignedTx(tx);
      } else {
        // For other wallets, build and pass raw bytes with offset
        const rawTx = await tx.build("0".repeat(55));
        signedResult = await getSignedTx(rawTx, rawTx.length - 64);
      }
      console.log("✅ Transaction signed successfully");

      // Broadcast the signed transaction
      console.log("📡 Broadcasting transaction to custom endpoint...");
      const res = await broadcastTx(signedResult.tx);
      console.log("📡 Broadcast response:", res);

      if (res && res.transactionId) {
        setTxHash(res.transactionId);

        // Start monitoring the transaction like qearn does

        // Log monitoring status
        console.log("🔄 Transaction broadcast successful. Monitoring for confirmation...");

        // Monitor transaction confirmation
        await monitorTransaction({
          txId: res.transactionId,
          targetTick,
          verificationFunction: async () => {
            const updatedTierLevel = await getTierLevelByUser(wallet.publicKey);
            return updatedTierLevel === tierLevel;
          },
          onSuccess: () => {
            console.log(`🎉 Tier registration confirmed! Successfully registered in tier ${tierLevel}`);
            setLoading(false);
          },
          onError: (error) => {
            setIsError(true);
            setErrorMessage(error);
          },
        });
      } else {
        throw new Error("Failed to broadcast transaction");
      }
    } catch (error) {
      setIsError(true);

      createToast(ToastIds.CONFIRMATION, {
        title: "Error upgrading tier",
        type: "error",
        description: "An error occurred, please verify you have sufficient funds and try again",
      });

      setErrorMessage(errorMessage);
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

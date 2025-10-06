import { useState } from "react";

import { getTierLevelByUser, registerInTier } from "../../lib/nostromo/services/nostromo.service";
import { broadcastTx, fetchTickInfo } from "../../lib/nostromo/services/rpc.service";
import { useQubicConnect } from "../qubic/QubicConnectContext";

/**
 * Hook for registering in a tier
 * @returns Object with loading state, mutate function, error state, and transaction hash
 */
export const useRegisterTier = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
  const { wallet, getSignedTx } = useQubicConnect();

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

      if (res && res.result?.transactionId) {
        setTxHash(res.result.transactionId);

        // Start monitoring the transaction like qearn does
        setIsMonitoring(true);
        setLoading(false); // Stop initial loading, but keep monitoring

        // Log monitoring status
        console.log("🔄 Transaction broadcast successful. Monitoring for confirmation...");

        // Monitor transaction confirmation
        await monitorTransaction(res.result.transactionId, targetTick, tierLevel);
      } else {
        throw new Error("Failed to broadcast transaction");
      }
    } catch (error) {
      console.error("Error registering in tier:", error);
      setIsError(true);

      // Better error message handling
      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        errorMessage = JSON.stringify(error);
      }

      setErrorMessage(errorMessage);
      setLoading(false);
    }
  };

  // Transaction monitoring function (like qearn)
  const monitorTransaction = async (txId: string, targetTick: number, expectedTierLevel: number) => {
    const maxWaitTicks = 15; // Wait max 15 ticks like qearn
    let currentTick = 0;

    const checkInterval = setInterval(async () => {
      try {
        const tickInfo = await fetchTickInfo();
        currentTick = tickInfo.tick;

        console.log(`Monitoring transaction ${txId}: current tick ${currentTick}, target tick ${targetTick}`);

        if (currentTick > targetTick) {
          if (currentTick > targetTick + maxWaitTicks) {
            // Transaction failed - timeout
            clearInterval(checkInterval);
            setIsMonitoring(false);
            setIsError(true);
            setErrorMessage("Transaction failed - timeout waiting for confirmation");
            console.error("Transaction timeout");

            // Log timeout error
            console.error("❌ Transaction timeout - failed to confirm within expected time");
            return;
          }

          // Check if tier level actually changed by querying the smart contract
          const currentTierLevel = await getTierLevelByUser(wallet!.publicKey);

          if (currentTierLevel === expectedTierLevel) {
            // Success! Tier level changed
            clearInterval(checkInterval);
            setIsMonitoring(false);
            console.log(`✅ Tier registration successful! New tier level: ${currentTierLevel}`);

            // Log success
            console.log(`🎉 Tier registration confirmed! Successfully registered in tier ${expectedTierLevel}`);
          } else {
            // Keep waiting, transaction might still be processing
            console.log(`Waiting for tier change... Current: ${currentTierLevel}, Expected: ${expectedTierLevel}`);
          }
        }
      } catch (error) {
        console.error("Error monitoring transaction:", error);
      }
    }, 2000); // Check every 2 seconds like qearn

    // Cleanup after 5 minutes max
    setTimeout(() => {
      clearInterval(checkInterval);
      if (isMonitoring) {
        setIsMonitoring(false);
        setIsError(true);
        setErrorMessage("Transaction monitoring timeout");
      }
    }, 300000); // 5 minutes
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

import { useState } from "react";
import { fetchTickInfo } from "../../lib/nostromo/services/rpc.service";

export interface TransactionMonitorOptions {
  txId: string;
  targetTick: number;
  verificationFunction: () => Promise<boolean>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  maxWaitTicks?: number;
  checkIntervalMs?: number;
}

/**
 * Reusable transaction monitoring hook following qearn pattern
 */
export const useTransactionMonitor = () => {
  const [isMonitoring, setIsMonitoring] = useState<boolean>(false);

  const monitorTransaction = async ({
    txId,
    targetTick,
    verificationFunction,
    onSuccess,
    onError,
    maxWaitTicks = 30, // Increased from 15 to 30 ticks
    checkIntervalMs = 5000, // Increased from 2000ms to 5000ms
  }: TransactionMonitorOptions) => {
    setIsMonitoring(true);
    console.log(`🔄 Starting transaction monitoring for ${txId}...`);

    const checkInterval = setInterval(async () => {
      try {
        const tickInfo = await fetchTickInfo();
        const currentTick = tickInfo.tick;

        console.log(`Monitoring transaction ${txId}: current tick ${currentTick}, target tick ${targetTick}`);

        if (currentTick > targetTick) {
          if (currentTick > targetTick + maxWaitTicks) {
            // Transaction failed - timeout
            clearInterval(checkInterval);
            setIsMonitoring(false);
            const errorMsg = "Transaction failed - timeout waiting for confirmation";
            console.error("❌ Transaction timeout");
            onError?.(errorMsg);
            return;
          }

          // Check if transaction actually succeeded using verification function
          const isSuccess = await verificationFunction();

          if (isSuccess) {
            // Success! Transaction confirmed
            clearInterval(checkInterval);
            setIsMonitoring(false);
            console.log(`✅ Transaction confirmed successfully!`);
            onSuccess?.();
          } else {
            // Keep waiting, transaction might still be processing
            console.log(`⏳ Waiting for transaction confirmation...`);
          }
        }
      } catch (error) {
        console.error("Error monitoring transaction:", error);
      }
    }, checkIntervalMs); // Check every 5 seconds (adjustable)

    // Cleanup after 5 minutes max
    setTimeout(() => {
      clearInterval(checkInterval);
      if (isMonitoring) {
        setIsMonitoring(false);
        onError?.("Transaction monitoring timeout");
      }
    }, 300000); // 5 minutes
  };

  return {
    isMonitoring,
    monitorTransaction,
  };
};

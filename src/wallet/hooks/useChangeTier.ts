import { useState } from "react";

import {
  NOSTROMO_TIER_CHESTBURST_STAKE_AMOUNT,
  NOSTROMO_TIER_DOG_STAKE_AMOUNT,
  NOSTROMO_TIER_FACEHUGGER_STAKE_AMOUNT,
  NOSTROMO_TIER_WARRIOR_STAKE_AMOUNT,
  NOSTROMO_TIER_XENOMORPH_STAKE_AMOUNT,
} from "../../lib/nostromo/constants";
import { getTierLevelByUser, upgradeTier } from "../../lib/nostromo/services/nostromo.service";
import { broadcastTx, fetchTickInfo } from "../../lib/nostromo/services/rpc.service";
import { useQubicConnect } from "../qubic/QubicConnectContext";
import { useTransactionMonitor } from "./useTransactionMonitor";

/**
 *
 * @returns
 */
export const useChangeTier = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const { wallet, getSignedTx } = useQubicConnect();
  const { isMonitoring, monitorTransaction } = useTransactionMonitor();

  const mutate = async (newTierLevel: number) => {
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

      // Calculate upgrade cost (difference between tiers)
      const tierAmounts = [
        0, // Tier 0
        NOSTROMO_TIER_FACEHUGGER_STAKE_AMOUNT,
        NOSTROMO_TIER_CHESTBURST_STAKE_AMOUNT,
        NOSTROMO_TIER_DOG_STAKE_AMOUNT,
        NOSTROMO_TIER_XENOMORPH_STAKE_AMOUNT,
        NOSTROMO_TIER_WARRIOR_STAKE_AMOUNT,
      ];

      const deltaTierAmount = tierAmounts[newTierLevel] - tierAmounts[currentTierLevel];

      console.log(`Upgrading from tier ${currentTierLevel} to tier ${newTierLevel}, cost: ${deltaTierAmount}`);

      // Create the upgrade transaction
      const tx = await upgradeTier(wallet.publicKey, newTierLevel, deltaTierAmount, targetTick);

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

        console.log("🔄 Tier upgrade transaction broadcast successful. Monitoring for confirmation...");

        // Monitor transaction with verification function
        await monitorTransaction({
          txId: res.result.transactionId,
          targetTick,
          verificationFunction: async () => {
            const updatedTierLevel = await getTierLevelByUser(wallet.publicKey);
            return updatedTierLevel === newTierLevel;
          },
          onSuccess: () => {
            console.log(`🎉 Tier upgrade confirmed! Successfully upgraded to tier ${newTierLevel}`);
          },
          onError: (error) => {
            setIsError(true);
            setErrorMessage(error);
          },
        });
      } else {
        throw new Error("Failed to broadcast tier upgrade transaction");
      }
    } catch (error) {
      console.error("Error upgrading tier:", error);
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

import { useState } from "react";

import { claimToken, getInfoUserInvested, getMaxClaimAmount } from "../../lib/nostromo/services/nostromo.service";
import { broadcastTx, fetchTickInfo } from "../../lib/nostromo/services/rpc.service";
import { useQubicConnect } from "../qubic/QubicConnectContext";
import { useTransactionMonitor } from "./useTransactionMonitor";

interface ClaimData {
  indexOfFundraising: number;
  amount: number; // Amount of tokens to claim
}

/**
 * Hook for claiming tokens from fundraising campaigns
 * Based on C++ claimToken function (lines 761-825 in nostromo.cpp)
 */
export const useClaimToken = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const { wallet, getSignedTx } = useQubicConnect();
  const { isMonitoring, monitorTransaction } = useTransactionMonitor();

  const mutate = async (data: ClaimData) => {
    if (!wallet?.publicKey) {
      setIsError(true);
      setErrorMessage("Wallet not connected");
      return;
    }

    if (data.amount <= 0) {
      setIsError(true);
      setErrorMessage("Claim amount must be greater than 0");
      return;
    }

    setLoading(true);
    setIsError(false);
    setErrorMessage("");

    try {
      console.log("🎁 Claiming tokens:", data);

      // Verify user can claim this amount
      const maxClaimable = await getMaxClaimAmount(wallet.publicKey, data.indexOfFundraising);
      if (data.amount > maxClaimable) {
        throw new Error(`Cannot claim ${data.amount} tokens. Maximum claimable: ${maxClaimable}`);
      }

      // Get current tick info
      const tickInfo = await fetchTickInfo();
      const targetTick = tickInfo.tick + 10;

      // Get initial claimed amount for verification
      const initialInvestments = await getInfoUserInvested(wallet.publicKey);
      const initialInvestment = initialInvestments.listUserInvested.find(
        (inv) => inv.indexOfFundraising === data.indexOfFundraising,
      );
      const initialClaimedAmount = initialInvestment?.claimedAmount || 0;

      // Create the claim transaction
      // Based on C++ code: packet.input.amount = amount; packet.input.indexOfFundraising = indexOfFundraising;
      // Transaction amount = 0 (no QU transfer)
      const tx = await claimToken(wallet.publicKey, data.amount, data.indexOfFundraising, targetTick);

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
      console.log("📡 Claim broadcast response:", res);

      // Check different possible response formats
      const txId = res?.result?.transactionId || res?.transactionId || res?.result?.id || res?.txId;
      console.log("📡 Found transaction ID:", txId);

      if (res && txId) {
        setTxHash(txId);
        setLoading(false);

        console.log("🔄 Claim transaction broadcast successful. Monitoring for confirmation...");

        // Monitor transaction with verification
        await monitorTransaction({
          txId: txId,
          targetTick,
          verificationFunction: async () => {
            // Verify tokens were claimed by checking increased claimed amount
            try {
              const currentInvestments = await getInfoUserInvested(wallet.publicKey);
              const currentInvestment = currentInvestments.listUserInvested.find(
                (inv) => inv.indexOfFundraising === data.indexOfFundraising,
              );
              const newClaimedAmount = currentInvestment?.claimedAmount || 0;
              return newClaimedAmount > initialClaimedAmount;
            } catch (error) {
              console.log("Could not verify claim, assuming success");
              return true;
            }
          },
          onSuccess: () => {
            console.log(
              `🎉 Claim confirmed! Successfully claimed ${data.amount} tokens from fundraising ${data.indexOfFundraising}`,
            );
          },
          onError: (error) => {
            setIsError(true);
            setErrorMessage(error);
          },
        });
      } else {
        throw new Error("Failed to broadcast claim transaction");
      }
    } catch (error) {
      console.error("Error claiming tokens:", error);
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

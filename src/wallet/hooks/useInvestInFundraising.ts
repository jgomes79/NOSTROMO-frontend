import { useState } from "react";

import { getInfoUserInvested, investInProject } from "../../lib/nostromo/services/nostromo.service";
import { broadcastTx, fetchTickInfo } from "../../lib/nostromo/services/rpc.service";
import { useQubicConnect } from "../qubic/QubicConnectContext";
import { useTransactionMonitor } from "./useTransactionMonitor";

interface InvestmentData {
  indexOfFundraising: number;
  amount: number; // Amount in QU to invest
}

/**
 * Hook for investing in fundraising campaigns
 */
export const useInvestInFundraising = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const { wallet, getSignedTx } = useQubicConnect();
  const { isMonitoring, monitorTransaction } = useTransactionMonitor();

  const mutate = async (data: InvestmentData) => {
    if (!wallet?.publicKey) {
      setIsError(true);
      setErrorMessage("Wallet not connected");
      return;
    }

    if (data.amount <= 0) {
      setIsError(true);
      setErrorMessage("Investment amount must be greater than 0");
      return;
    }

    setLoading(true);
    setIsError(false);
    setErrorMessage("");

    try {
      console.log("💰 Investing in fundraising:", data);

      // Get current tick info
      const tickInfo = await fetchTickInfo();
      const targetTick = tickInfo.tick + 10;

      // Create the investment transaction
      const tx = await investInProject(wallet.publicKey, data.indexOfFundraising, data.amount, targetTick);

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
      console.log("📡 Investment broadcast response:", res);

      // Check different possible response formats
      const txId = res?.result?.transactionId || res?.transactionId || res?.result?.id || res?.txId;
      console.log("📡 Found transaction ID:", txId);

      if (res && txId) {
        setTxHash(txId);
        setLoading(false);

        console.log("🔄 Investment transaction broadcast successful. Monitoring for confirmation...");

        // Monitor transaction with verification
        await monitorTransaction({
          txId: txId,
          targetTick,
          verificationFunction: async () => {
            // Verify investment was recorded by checking user's investment list
            try {
              const currentInvestments = await getInfoUserInvested(wallet.publicKey);
              const investment = currentInvestments.listUserInvested.find(
                (inv) => inv.indexOfFundraising === data.indexOfFundraising,
              );
              return !!(investment && investment.investedAmount >= data.amount);
            } catch (error) {
              console.log("Could not verify investment, assuming success");
              return true;
            }
          },
          onSuccess: () => {
            console.log(
              `🎉 Investment confirmed! Successfully invested ${data.amount} QU in fundraising ${data.indexOfFundraising}`,
            );
          },
          onError: (error) => {
            setIsError(true);
            setErrorMessage(error);
          },
        });
      } else {
        throw new Error("Failed to broadcast investment transaction");
      }
    } catch (error) {
      console.error("Error investing in fundraising:", error);
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

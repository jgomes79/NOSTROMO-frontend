/* eslint-disable */
// @ts-nocheck

import { useState } from "react";

import { registerInTier } from "../qubic/contract/nostromoApi";
import { useQubicConnect } from "../qubic/QubicConnectContext";
import { TransactionResult } from "../qubic/contract/contractApi";
// import { waitForTxReceipt } from "../qubic/contract/nostromoApi";

/**
 *
 * @returns
 */
export const useRegisterTier = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const qubic = useQubicConnect();

  const mutate = async (tierLevel: number) => {
    setLoading(true);
    const result: TransactionResult = await registerInTier(qubic as any, tierLevel);
    if (result.result.success) {
      setTxHash(result.result.transactionId);
      // await waitForTxReceipt(qubic.httpEndpoint, result.result.transactionId);
    } else {
      setIsError(true);
      setErrorMessage(result.error);
    }
    setLoading(false);
  };

  return {
    isLoading,
    mutate,
    isError,
    errorMessage,
    txHash,
  };
};

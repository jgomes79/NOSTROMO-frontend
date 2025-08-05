/* eslint-disable */
// @ts-nocheck

import { useState } from "react";

import { logoutFromTier } from "../qubic/contract/nostromoApi";
import { useQubicConnect } from "../qubic/QubicConnectContext";
import { TransactionResult } from "../qubic/contract/contractApi";
import { waitForTxReceipt } from "../qubic/contract/nostromoApi";

/**
 *
 * @returns
 */
export const useRemoveTier = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const qubic = useQubicConnect();

  const mutate = async () => {
    setLoading(true);
    const result: TransactionResult = await logoutFromTier(qubic as any);
    if (result.success) {
      setTxHash(result.txHash);
      await waitForTxReceipt(qubic.httpEndpoint, result.txHash);
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

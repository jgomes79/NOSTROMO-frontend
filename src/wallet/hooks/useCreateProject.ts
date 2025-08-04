/* eslint-disable */
// @ts-nocheck

import { useState } from "react";

import { createProject } from "../qubic/contract/nostromoApi";
import { TransactionResult } from "../qubic/contract/contractApi";
import { useQubicConnect } from "../qubic/QubicConnectContext";
import { ProjectData } from "../qubic/contract/nostromoApi";
// import { waitForTxReceipt } from "../qubic/contract/nostromoApi";

/**
 *
 * @returns
 */
export const useCreateProject = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const qubic = useQubicConnect();

  const mutate = async (projectData: ProjectData) => {
    setLoading(true);
    const result: TransactionResult = await createProject(qubic as any, projectData);
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

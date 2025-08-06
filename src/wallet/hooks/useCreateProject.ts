/* eslint-disable */
// @ts-nocheck

import { useState } from "react";

import { createProject } from "../qubic/contract/nostromoApi";
import { TransactionResult } from "../qubic/contract/contractApi";
import { useQubicConnect } from "../qubic/QubicConnectContext";
import { ProjectData } from "../qubic/contract/nostromoApi";
import { waitForTxReceipt } from "../qubic/contract/nostromoApi";
import { Project } from "@/project/project.types";

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

  const mutate = async (data: Project) => {


    const projectData: ProjectData = {
      tokenName: data.tokenName,
      supply: data.tokensForSale,
      startYear: new Date(data.startDate).getFullYear(),
      startMonth: new Date(data.startDate).getMonth() + 1,
      startDay: new Date(data.startDate).getDate(),
      startHour: new Date(data.startDate).getHours(),
      endYear: new Date(data.startDate).getFullYear(),
      endMonth: new Date(data.startDate).getMonth() + 1,
      endDay: new Date(data.startDate).getDate(),
      endHour: new Date(data.startDate).getHours(),
    };

    setLoading(true);
    const result = await createProject(qubic, projectData);
    if (result.success) {
      console.log("result", result);
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

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
    // Calcula endDate como un mes más que startDate, pero ajusta correctamente el mes (getMonth() es base 0)
    const startDate = new Date(data.startDate);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const projectData: ProjectData = {
      tokenName: data.tokenName,
      supply: data.tokensForSale,
      startYear: startDate.getFullYear(),
      startMonth: startDate.getMonth() + 1,
      startDay: startDate.getDate(),
      startHour: startDate.getHours(),
      endYear: endDate.getFullYear(),
      endMonth: endDate.getMonth() + 1,
      endDay: endDate.getDate(),
      endHour: endDate.getHours(),
    };

    console.log("projectData", projectData);

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

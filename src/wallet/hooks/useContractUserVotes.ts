import { useState } from "react";

import { getUserVoteStatus } from "../qubic/contract/nostromoApi";
import { useQubicConnect } from "../qubic/QubicConnectContext";

export interface ProjectIndexList {
  [key: number]: number;
}

/**
 * Hook for interacting with contract tier functionality
 * @returns Object containing loading state, fetch function and tier level data
 */
export const useContractUserVotes = () => {
  const { httpEndpoint, wallet, qHelper } = useQubicConnect();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [userVotes, setUserVotes] = useState<number>(0);
  const [projectIndexList, setProjectIndexList] = useState<ProjectIndexList[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  /**
   * Fetches the current tier level for the connected wallet
   * @returns void
   * @throws Will not fetch if httpEndpoint or wallet public key is missing
   */
  const refetch = async () => {
    if (!httpEndpoint || !wallet?.publicKey) {
      return;
    }

    setLoading(true);
    try {
      const result = await getUserVoteStatus(httpEndpoint, wallet.publicKey, qHelper);
      console.log("result", result);
      const numberOfVotedProjects = result.decodedFields?.numberOfVotedProjects;
      const projectIndexList = result.decodedFields?.projectIndexList;
      setUserVotes(numberOfVotedProjects as number);
      setProjectIndexList(projectIndexList as ProjectIndexList[]);
    } catch (error) {
      console.error("Error fetching tier level:", error);
      setIsError(true);
      setErrorMessage(error as string);
    } finally {
      setLoading(false);
    }
  };

  return {
    isLoading,
    refetch,
    data: {
      numberOfVotedProjects: userVotes,
      projectIndexList,
    },
    isError,
    errorMessage,
  };
};

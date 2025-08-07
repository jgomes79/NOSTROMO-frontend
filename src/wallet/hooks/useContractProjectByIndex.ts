import { useEffect } from "react";

import { create } from "zustand";

import { getProjectByIndex, Project } from "../qubic/contract/nostromoApi";
import { useQubicConnect } from "../qubic/QubicConnectContext";

interface Store {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
  project: Project | null;
  setProject: (project: Project | null) => void;
  isError: boolean;
  setIsError: (isError: boolean) => void;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
}

/**
 * Store for managing project by index state
 */
const store = create<Store>((set) => ({
  /** Loading state */
  isLoading: true,

  /** Function to update loading state
   * @param isLoading - New loading state value
   */
  setLoading: (isLoading: boolean) => set({ isLoading }),

  /** Current project */
  project: null,

  /** Function to update project
   * @param project - New project value
   */
  setProject: (project: Project | null) => set({ project }),

  /** Error state */
  isError: false,

  /** Function to update error state
   * @param isError - New error state value
   */
  setIsError: (isError: boolean) => set({ isError }),

  /** Error message */
  errorMessage: "",

  /** Function to update error message
   * @param errorMessage - New error message value
   */
  setErrorMessage: (errorMessage: string) => set({ errorMessage }),
}));

/**
 * Hook for interacting with contract project by index functionality
 * @returns Object containing loading state, fetch function and project data
 */
export const useContractProjectByIndex = (indexOfProject?: number) => {
  const { httpEndpoint, qHelper } = useQubicConnect();
  const { isLoading, setLoading, project, setProject, isError, setIsError, errorMessage, setErrorMessage } = store();

  /**
   * Fetches the project by index from the contract
   * @param indexOfProject - The index of the project to fetch
   * @returns void
   * @throws Will not fetch if httpEndpoint is missing
   */
  const refetch = async () => {
    if (!httpEndpoint || indexOfProject === undefined || indexOfProject === null) {
      return;
    }
    reset();
    try {
      console.log("XXXXXXXXXXXXXXindexOfProject", indexOfProject);
      const result = await getProjectByIndex(httpEndpoint, indexOfProject, qHelper);
      console.info("XXXXXXXXXXXXXresult", result);
      const projectData = result.decodedFields as unknown as Project;
      setProject(projectData);
    } catch (error) {
      console.error("Error fetching project by index:", error);
      setIsError(true);
      setErrorMessage(error as string);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setProject(null);
    setIsError(false);
    setErrorMessage("");
  };

  useEffect(() => {
    if (indexOfProject !== undefined) {
      refetch();
    }
  }, [indexOfProject]);

  return {
    isLoading,
    refetch,
    data: {
      project,
    },
    isError,
    errorMessage,
  };
};

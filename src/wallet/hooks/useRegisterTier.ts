/* eslint-disable */
// @ts-nocheck

import { useState } from "react";

import { registerInTier } from "../qubic/contract/nostromoApi";
import { useQubicConnect } from "../qubic/QubicConnectContext";

/**
 *
 * @returns
 */
export const useRegisterTier = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const qubic = useQubicConnect();

  const mutate = async (tierLevel: number) => {
    setLoading(true);
    await registerInTier(qubic as any, tierLevel);
    setLoading(false);
  };

  return {
    isLoading,
    mutate,
  };
};

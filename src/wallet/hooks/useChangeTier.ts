/* eslint-disable */
// @ts-nocheck

import { useState } from "react";

import { upgradeTier } from "../qubic/contract/nostromoApi";
import { useQubicConnect } from "../qubic/QubicConnectContext";

/**
 *
 * @returns
 */
export const useChangeTier = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const qubic = useQubicConnect();

  const mutate = async (tierLevel: number) => {
    setLoading(true);
    await upgradeTier(qubic as any, tierLevel);
    setLoading(false);
  };

  return {
    isLoading,
    mutate,
  };
};
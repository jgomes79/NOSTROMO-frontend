/* eslint-disable */
// @ts-nocheck

import { useState } from "react";

import { logoutFromTier } from "../qubic/contract/nostromoApi";
import { useQubicConnect } from "../qubic/QubicConnectContext";

/**
 *
 * @returns
 */
export const useRemoveTier = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const qubic = useQubicConnect();

  const mutate = async () => {
    setLoading(true);
    await logoutFromTier(qubic as any);
    setLoading(false);
  };

  return {
    isLoading,
    mutate,
  };
};

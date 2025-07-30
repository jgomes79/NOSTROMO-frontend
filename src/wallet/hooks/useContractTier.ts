/* eslint-disable */
// @ts-nocheck

import { useState } from "react";

import { getTierLevelByUser } from "../qubic/contract/nostromoApi";
import { useQubicConnect } from "../qubic/QubicConnectContext";

/**
 *
 * @returns
 */
export const useContractTier = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { httpEndpoint, wallet, qHelper } = useQubicConnect();

  const mutate = async (): Promise<number> => {
    if (!httpEndpoint || !wallet?.publicKey) {
      return;
    }

    setLoading(true);
    const result = await getTierLevelByUser(httpEndpoint, wallet.publicKey, qHelper);
    setLoading(false);

    return result.decodedFields?.tierLevel;
  };

  return {
    isLoading,
    mutate,
  };
};

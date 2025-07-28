import type { MetaMaskInpageProvider } from "@metamask/providers";

import { GetSnapsResponse, Snap } from "../../wallet.types";
import { getSnapOrigin } from "../config";

/**
 * Get the installed snaps in MetaMask.
 *
 * @param provider - The MetaMask inpage provider.
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (provider?: MetaMaskInpageProvider): Promise<GetSnapsResponse> => {
  const ethereumProvider = provider ?? window.ethereum;
  if (!ethereumProvider) {
    throw new Error("No Ethereum provider available");
  }
  return (await ethereumProvider.request({
    method: "wallet_getSnaps",
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (snapId: string | undefined, params: Record<"version" | string, unknown> = {}) => {
  snapId = getSnapOrigin(snapId);
  console.log("Connecting snap:", snapId);
  if (!snapId) {
    console.error("Invalid snapId provided");
    return;
  }
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not available");
    }
    await window.ethereum.request({
      method: "wallet_requestSnaps",
      params: {
        [snapId]: params,
      },
    });
    console.log("Snap connected successfully:", snapId);
  } catch (error) {
    console.error("Failed to connect snap", error);
  }
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find((snap) => snap.id === getSnapOrigin() && (!version || snap.version === version));
  } catch (error) {
    console.error("Failed to obtain installed snap", error);
    return undefined;
  }
};

export const isLocalSnap = (snapId: string) => snapId.startsWith("local:");

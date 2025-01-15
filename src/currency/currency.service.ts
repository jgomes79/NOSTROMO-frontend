import { getEndpoint, request } from "@/core/api/api.helpers";

import { Currency } from "./currency.types";

/**
 * Fetches all available currencies.
 *
 * @returns {Promise<Currency[]>} - A promise that resolves to an array of currency data.
 */
export const getAllCurrencies = (): Promise<Currency[]> =>
  request<Currency[]>(getEndpoint("currencies-service", "/currencies"), {
    method: "GET",
  });

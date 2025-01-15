import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { getAllCurrencies } from "../currency.service";
import { Currency } from "../currency.types";

/**
 * Custom hook to fetch all available currencies.
 *
 * @returns {UseQueryResult<Currency[] | null>} - A react-query result object containing an array of currency data or null.
 */
export const useCurrencies = (): UseQueryResult<Currency[]> =>
  useQuery<Currency[]>({
    queryKey: ["currencies"],
    initialData: [],
    queryFn: () => getAllCurrencies(),
  });

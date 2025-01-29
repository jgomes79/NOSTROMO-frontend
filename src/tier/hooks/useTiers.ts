import { useQuery } from "@tanstack/react-query";

import { getTiers } from "../tier.service";
import { Tier } from "../tier.types";

/**
 * Custom hook to fetch tiers data
 * @returns Query object containing tiers data and loading/error states
 */
export const useTiers = () => {
  return useQuery<Tier[]>({
    queryKey: ["tiers"],
    queryFn: () => getTiers(),
  });
};

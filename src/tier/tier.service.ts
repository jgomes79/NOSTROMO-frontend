import { getEndpoint, request } from "@/core/api/api.helpers";

import { Tier } from "./tier.types";

/**
 * Retrieves all available tiers from the tiers service.
 *
 * @returns {Promise<Tier[]>} A promise that resolves to an array of tier objects
 * @throws {Error} If the network request fails
 * @throws {Error} If the server returns an error response
 */
export const getTiers = () => request<Tier[]>(getEndpoint("tiers-service", "/tiers"));

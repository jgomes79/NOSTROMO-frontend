import { z } from "zod";

/**
 * Schema for validating Tier objects using Zod.
 *
 * @property {number} id - Unique identifier for the tier
 * @property {string} name - Name of the tier
 * @property {string} description - Detailed description of the tier
 * @property {number} stakeAmount - Amount of tokens required to stake for this tier
 * @property {number} poolWeight - Weight of the tier in the pool distribution
 * @property {string[]} benefits - Array of benefits associated with this tier
 */
export const TierSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  stakeAmount: z.number(),
  poolWeight: z.number(),
  benefits: z.string(),
});

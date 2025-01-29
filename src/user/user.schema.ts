import { z } from "zod";

import { TierSchema } from "@/tier/tier.schema";
import { UserTypes } from "@/user/user.types";

/**
 * Schema for the User validation using zod.
 */
export const UserSchema = z.object({
  id: z.number(),
  wallet: z.string(),
  tier: TierSchema,
  type: z.nativeEnum(UserTypes),
});

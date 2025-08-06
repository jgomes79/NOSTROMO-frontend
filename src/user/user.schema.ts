import { z } from "zod";

import { UserTypes } from "@/user/user.types";

/**
 * Schema for the User validation using zod.
 */
export const UserSchema = z.object({
  id: z.string(),
  wallet: z.string(),
  type: z.nativeEnum(UserTypes),
});

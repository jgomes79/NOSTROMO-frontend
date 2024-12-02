import { z } from "zod";

import { CurrencySchema } from "@/currency/currency.schema";

import { ProjectStates } from "./project.types";

/**
 * Schema for the Project validation using zod.
 */
export const ProjectSchema = z.object({
  id: z.number().nonnegative("ID must be a non-negative number"),
  state: z.nativeEnum(ProjectStates),
  name: z.string().min(1, { message: "Name is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  photoUrl: z.string().url({ message: "Invalid URL format" }),
  bannerUrl: z.string().url({ message: "Invalid URL format" }),
  whitepaperUrl: z.string().url({ message: "Invalid URL format" }),
  litepaperUrl: z.string().url({ message: "Invalid URL format" }),
  tokenomicsUrl: z.string().url({ message: "Invalid URL format" }),
  tokensCreated: z.string(),
  tokenPrice: z.string(),
  amountToRaise: z.string(),

  currency: CurrencySchema,

  social: z.object({
    instagramUrl: z
      .string()
      .url({ message: "Invalid Instagram URL format" })
      .regex(/^https:\/\/(www\.)?instagram\.com\/.*/, { message: "URL must be from Instagram" }),
    xUrl: z
      .string()
      .url({ message: "Invalid X URL format" })
      .regex(/^https:\/\/(www\.)?x\.com\/.*/, { message: "URL must be from X" }),
    discordUrl: z
      .string()
      .url({ message: "Invalid Discord URL format" })
      .regex(/^https:\/\/(www\.)?discord\.com\/.*/, { message: "URL must be from Discord" }),
    telegramUrl: z
      .string()
      .url({ message: "Invalid Telegram URL format" })
      .regex(/^https:\/\/(www\.)?t\.me\/.*/, { message: "URL must be from Telegram" }),
    mediumUrl: z
      .string()
      .url({ message: "Invalid Medium URL format" })
      .regex(/^https:\/\/(www\.)?medium\.com\/.*/, { message: "URL must be from Medium" }),
  }),
});

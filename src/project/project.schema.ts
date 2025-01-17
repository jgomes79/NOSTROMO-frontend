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
  tokenImageUrl: z.string().url({ message: "Invalid URL format" }),
  tokenName: z.string().min(1, { message: "Token name is required" }),

  tokensSupply: z
    .number({ invalid_type_error: "Tokens supply must be a number" })
    .positive("Tokens supply must be a positive number")
    .min(1, { message: "Tokens supply must be greater than zero" }),

  tokenPrice: z
    .number({ invalid_type_error: "Token price must be a number" })
    .positive("Token price must be a positive number")
    .min(1, { message: "Token price must be greater than zero" }),

  tokenDecimals: z
    .number({ invalid_type_error: "Token decimals must be a number" })
    .int()
    .nonnegative("Token decimals must be a non-negative integer")
    .min(1, { message: "Token decimals must be greater than zero" }),

  tokensForSale: z
    .number({ invalid_type_error: "Tokens for sale must be a number" })
    .positive("Tokens for sale must be a positive number")
    .min(1, { message: "Tokens for sale must be greater than zero" }),

  amountToRaise: z
    .number({ invalid_type_error: "Amount to raise must be a number" })
    .positive("Amount to raise must be a positive number")
    .min(1, { message: "Amount to raise must be greater than zero" }),

  threshold: z
    .number({ invalid_type_error: "Threshold must be a number" })
    .positive("Threshold must be a positive number"),

  startDate: z.date().superRefine((date, ctx) => {
    if (date <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date must be in the future",
      });
    }
  }),

  TGEDate: z.date().superRefine((date, ctx) => {
    if (date <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "TGE date must be in the future",
      });
    }
  }),

  unlockTokensTGE: z
    .number({ invalid_type_error: "Unlock tokens TGE must be a number" })
    .positive("Unlock tokens TGE must be a positive number")
    .refine((val) => val > 0, {
      message: "Unlock tokens TGE must be greater than zero",
    }),

  cliff: z
    .number({ invalid_type_error: "Cliff must be a number" })
    .positive("Cliff must be a positive number")
    .min(1, { message: "Cliff must be greater than zero" }),

  vestingDays: z
    .number({ invalid_type_error: "Vesting days must be a number" })
    .positive("Vesting days must be a positive number")
    .min(1, { message: "Vesting days must be greater than zero" }),

  currency: CurrencySchema,

  social: z.object({
    instagramUrl: z
      .string()
      .url({ message: "Invalid Instagram URL format" })
      .regex(/^https:\/\/(www\.)?instagram\.com\/.*/, { message: "URL must be from Instagram" })
      .optional(),
    xUrl: z
      .string()
      .url({ message: "Invalid X URL format" })
      .regex(/^https:\/\/(www\.)?x\.com\/.*/, { message: "URL must be from X" })
      .optional(),
    discordUrl: z
      .string()
      .url({ message: "Invalid Discord URL format" })
      .regex(/^https:\/\/(www\.)?discord\.com\/.*/, { message: "URL must be from Discord" })
      .optional(),
    telegramUrl: z
      .string()
      .url({ message: "Invalid Telegram URL format" })
      .regex(/^https:\/\/(www\.)?t\.me\/.*/, { message: "URL must be from Telegram" })
      .optional(),
    mediumUrl: z
      .string()
      .url({ message: "Invalid Medium URL format" })
      .regex(/^https:\/\/(www\.)?medium\.com\/.*/, { message: "URL must be from Medium" })
      .optional(),
  }),
});

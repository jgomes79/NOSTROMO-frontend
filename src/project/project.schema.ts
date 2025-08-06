import { z } from "zod";

import { CurrencySchema } from "@/currency/currency.schema";
import { UserSchema } from "@/user/user.schema";

import { ProjectStates } from "./project.types";

/**
 * Schema for the Project validation using zod.
 */
export const ProjectSchema = z.object({
  id: z.number().nonnegative("ID must be a non-negative number"),

  smartContractId: z.number().optional(),

  state: z.nativeEnum(ProjectStates),

  name: z.string().min(1, { message: "Name is required" }),

  slug: z
    .string()
    .min(1, { message: "Slug is required" })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Slug must not contain spaces or symbols, only letters, numbers, and hyphens are allowed",
    }),

  description: z.string().min(1, { message: "Description is required" }),

  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),

  comments: z.string().optional(),

  photoUrl: z.string().url({ message: "Invalid URL format" }),

  bannerUrl: z.string().url({ message: "Invalid URL format" }),

  whitepaperUrl: z.string().url({ message: "Invalid URL format" }),

  litepaperUrl: z.string().url({ message: "Invalid URL format" }),

  tokenomicsUrl: z.string().url({ message: "Invalid URL format" }),

  tokenImageUrl: z.string().url({ message: "Invalid URL format" }),

  tokenName: z.string().min(1, { message: "Token name is required" }),

  websiteUrl: z.string().url({ message: "Invalid URL format" }).min(1, { message: "Website URL is required" }),

  tokensSupply: z
    .number({ invalid_type_error: "Tokens supply must be a number" })
    .nonnegative("Tokens supply must be zero or greater"),

  tokenPrice: z.number({ invalid_type_error: "Token price must be a number" }),

  tokensForSale: z
    .number({ invalid_type_error: "Tokens for sale must be a number" })
    .min(1, { message: "Tokens for sale must be greater than 0" })
    .nonnegative("Tokens for sale must be zero or greater"),

  amountToRaise: z
    .number({ invalid_type_error: "Amount to raise must be a number" })
    .min(1, { message: "Amount to raise must be greater than 0" })
    .nonnegative("Amount to raise must be zero or greater"),

  threshold: z
    .number({ invalid_type_error: "Threshold must be a number" })
    .nonnegative("Threshold must be zero or greater"),

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
    .min(1, {
      message: "Unlock tokens TGE must be greater than 0",
    })
    .nonnegative("Unlock tokens TGE must be zero or greater"),

  cliff: z
    .number({ invalid_type_error: "Cliff must be a number" })
    .min(1, {
      message: "Cliff must be greater than 0",
    })
    .nonnegative("Cliff must be zero or greater"),

  vestingDays: z
    .number({ invalid_type_error: "Vesting days must be a number" })
    .nonnegative("Vesting days must be zero or greater"),

  currency: CurrencySchema,

  owner: UserSchema,

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

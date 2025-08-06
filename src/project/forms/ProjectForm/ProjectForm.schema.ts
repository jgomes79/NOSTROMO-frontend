import { z } from "zod";

import { CurrencySchema } from "@/currency/currency.schema";

import { ProjectSchema } from "../../project.schema";

/**
 * Base schema with required name and slug fields, and all other fields optional
 */
export const OptionalFormSchema = z.object({
  // Basic project information
  id: ProjectSchema.shape.id.optional(),
  name: ProjectSchema.shape.name,
  slug: ProjectSchema.shape.slug,
  email: ProjectSchema.shape.email,
  description: ProjectSchema.shape.description.optional().or(z.literal("")),

  // Token details and financial information
  tokensSupply: ProjectSchema.shape.tokensSupply.optional().or(z.literal("")),
  amountToRaise: ProjectSchema.shape.amountToRaise.optional().or(z.literal("")),
  startDate: ProjectSchema.shape.startDate.optional(),
  tokenName: ProjectSchema.shape.tokenName.optional().or(z.literal("")),
  tokensForSale: ProjectSchema.shape.tokensForSale.optional().or(z.literal("")),

  // Vesting and distribution parameters
  threshold: ProjectSchema.shape.threshold.optional().or(z.literal("")),
  cliff: ProjectSchema.shape.cliff.optional().or(z.literal("")),
  TGEDate: ProjectSchema.shape.TGEDate.optional(),
  unlockTokensTGE: ProjectSchema.shape.unlockTokensTGE.optional().or(z.literal("")),
  vestingDays: ProjectSchema.shape.vestingDays.optional().or(z.literal("")),
  websiteUrl: ProjectSchema.shape.websiteUrl.optional().or(z.literal("")),

  // Project media and documentation
  photoUrl: z.union([z.instanceof(File), z.string(), z.undefined(), z.null()]).optional(),
  bannerUrl: z.union([z.instanceof(File), z.string(), z.undefined(), z.null()]).optional(),
  whitepaperUrl: z.union([z.instanceof(File), z.string(), z.undefined(), z.null()]).optional(),
  litepaperUrl: z.union([z.instanceof(File), z.string(), z.undefined(), z.null()]).optional(),
  tokenomicsUrl: z.union([z.instanceof(File), z.string(), z.undefined(), z.null()]).optional(),
  tokenImageUrl: z.union([z.instanceof(File), z.string(), z.undefined(), z.null()]).optional(),

  // Social media links
  social: z
    .object({
      instagramUrl: ProjectSchema.shape.social.shape.instagramUrl.optional().or(z.literal("")),
      xUrl: ProjectSchema.shape.social.shape.xUrl.optional().or(z.literal("")),
      discordUrl: ProjectSchema.shape.social.shape.discordUrl.optional().or(z.literal("")),
      telegramUrl: ProjectSchema.shape.social.shape.telegramUrl.optional().or(z.literal("")),
      mediumUrl: ProjectSchema.shape.social.shape.mediumUrl.optional().or(z.literal("")),
    })
    .optional(),

  // Currency information
  currency: CurrencySchema.pick({
    id: true,
    name: true,
  }).optional(),
});

export const EntryFormSchema = z.object({
  name: ProjectSchema.shape.name,
  slug: ProjectSchema.shape.slug,
  email: ProjectSchema.shape.email,
  description: ProjectSchema.shape.description,
  websiteUrl: ProjectSchema.shape.websiteUrl,
  currency: CurrencySchema.pick({
    id: true,
    name: true,
  }).optional(),
});

/**
 * Extended schema with all fields required except social media
 */
export const ProjectFormSchema = OptionalFormSchema.extend({
  description: ProjectSchema.shape.description,
  websiteUrl: ProjectSchema.shape.websiteUrl,
  tokensSupply: ProjectSchema.shape.tokensSupply,
  amountToRaise: ProjectSchema.shape.amountToRaise,
  startDate: ProjectSchema.shape.startDate,
  tokenName: ProjectSchema.shape.tokenName,
  tokensForSale: ProjectSchema.shape.tokensForSale,
  threshold: ProjectSchema.shape.threshold,
  cliff: ProjectSchema.shape.cliff,
  TGEDate: ProjectSchema.shape.TGEDate,
  unlockTokensTGE: ProjectSchema.shape.unlockTokensTGE,
  vestingDays: ProjectSchema.shape.vestingDays,
  photoUrl: z.union([z.instanceof(File), z.string()]),
  bannerUrl: z.union([z.instanceof(File), z.string()]),
  whitepaperUrl: z.union([z.instanceof(File), z.string()]),
  litepaperUrl: z.union([z.instanceof(File), z.string()]),
  tokenomicsUrl: z.union([z.instanceof(File), z.string()]),
  tokenImageUrl: z.union([z.instanceof(File), z.string()]),
  currency: CurrencySchema.pick({
    id: true,
    name: true,
  }),
});

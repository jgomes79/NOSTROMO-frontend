import { z } from "zod";

import { CurrencySchema } from "@/currency/currency.schema";

import { ProjectSchema } from "../../project.schema";

/**
 * Defines a schema for the project form by extracting specific fields from the ProjectSchema.
 * This schema includes 'name', 'description', 'social', 'tokensSupply', 'tokenPrice', and 'amountToRaise'.
 * Additionally, it extends the schema to include 'photo', 'banner', 'whitepaper', 'litepaper', and 'tokenomics' fields, all of which are expected to be instances of File.
 */
export const ProjectFormSchema = z.object({
  // Basic project information
  id: ProjectSchema.shape.id.optional(),
  name: ProjectSchema.shape.name,
  slug: ProjectSchema.shape.slug,
  description: ProjectSchema.shape.description.optional().or(z.literal("")),

  // Token details and financial information
  tokensSupply: ProjectSchema.shape.tokensSupply.optional().or(z.literal("")),
  amountToRaise: ProjectSchema.shape.amountToRaise.optional().or(z.literal("")),
  startDate: ProjectSchema.shape.startDate,
  tokenName: ProjectSchema.shape.tokenName.optional().or(z.literal("")),
  tokenDecimals: ProjectSchema.shape.tokenDecimals.optional().or(z.literal("")),
  tokensForSale: ProjectSchema.shape.tokensForSale.optional().or(z.literal("")),

  // Vesting and distribution parameters
  threshold: ProjectSchema.shape.threshold.optional().or(z.literal("")),
  cliff: ProjectSchema.shape.cliff.optional().or(z.literal("")),
  TGEDate: ProjectSchema.shape.TGEDate,
  unlockTokensTGE: ProjectSchema.shape.unlockTokensTGE.optional().or(z.literal("")),
  vestingDays: ProjectSchema.shape.vestingDays.optional().or(z.literal("")),

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
  }),
});

/**
 * Type definition for the values derived from the ProjectFormSchema using Zod's infer method.
 */
export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;

/**
 * Type definition for the properties expected by the ProjectNameForm component.
 * @param defaultValues - Initial values for the form fields, based on the ProjectFormSchema.
 * @param onSubmit - Callback function that executes upon form submission.
 * @param onCancel - Callback function that executes to navigate back from the form.
 */
export interface ProjectFormProps {
  isLoading: boolean;
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (data: ProjectFormValues) => void;
}

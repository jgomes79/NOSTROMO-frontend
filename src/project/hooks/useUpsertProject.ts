import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { useWalletClient } from "wagmi";

import { getRoute } from "@/lib/router";
import { ProjectFormValues } from "@/project/forms/ProjectForm";
import { upsertProject } from "@/project/project.service";

import { PROJECT_ROUTES } from "../project.constants";

/**
 * Custom hook to create a new project using a mutation.
 */
export const useUpsertProject = () => {
  const wallet = useWalletClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      const formData: FormData = new FormData();

      const projectId = data.id ?? undefined;

      if (!wallet || !wallet.data?.account) {
        return new Error("Wallet not connected");
      }

      // Basic Info
      if (data.photoUrl && data.photoUrl instanceof File) {
        formData.append("photo", data.photoUrl);
      }

      if (data.bannerUrl && data.bannerUrl instanceof File) {
        formData.append("banner", data.bannerUrl);
      }

      formData.append("name", data.name);
      formData.append("slug", data.slug);
      formData.append("description", data.description ?? "");

      // Token Info
      formData.append("tokenName", data.tokenName ?? "");

      if (data.tokenImageUrl && data.tokenImageUrl instanceof File) {
        formData.append("tokenImage", data.tokenImageUrl);
      }

      formData.append("tokensSupply", String(data.tokensSupply));
      formData.append("tokenDecimals", String(data.tokenDecimals));

      // Raising Info
      formData.append("startDate", String(data.startDate));
      formData.append("amountToRaise", String(data.amountToRaise));
      formData.append("tokensForSale", String(data.tokensForSale));
      formData.append("unlockTokensTGE", String(data.unlockTokensTGE));
      formData.append("threshold", String(data.threshold));

      // Social URLs
      formData.append("instagramUrl", data.social?.instagramUrl ?? "");
      formData.append("discordUrl", data.social?.discordUrl ?? "");
      formData.append("xUrl", data.social?.xUrl ?? "");
      formData.append("mediumUrl", data.social?.mediumUrl ?? "");
      formData.append("telegramUrl", data.social?.telegramUrl ?? "");

      // Documents
      if (data.whitepaperUrl && data.whitepaperUrl instanceof File) {
        formData.append("whitepaper", data.whitepaperUrl);
      }

      if (data.tokenomicsUrl && data.tokenomicsUrl instanceof File) {
        formData.append("tokenomics", data.tokenomicsUrl);
      }

      if (data.litepaperUrl && data.litepaperUrl instanceof File) {
        formData.append("litepaper", data.litepaperUrl);
      }

      // Currency
      formData.append("currencyId", data.currency.id.toString());

      // Vesting Info
      formData.append("TGEDate", String(data.TGEDate) ?? addDays(new Date(), 10).toISOString());
      formData.append("cliff", String(data.cliff));
      formData.append("vestingDays", String(data.vestingDays));

      // Account
      formData.append("walletAddress", wallet.data.account.address);

      return upsertProject(projectId, formData);
    },
    onSuccess: (data) => {
      if (data && "slug" in data) {
        navigate(getRoute(PROJECT_ROUTES.EDIT_PROJECT, { slug: data.slug }));
      }
    },
  });
};

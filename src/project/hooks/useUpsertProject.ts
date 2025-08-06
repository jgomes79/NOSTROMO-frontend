import { useNavigate } from "react-router-dom";

import { useMutation } from "@tanstack/react-query";
import { addDays } from "date-fns";

import { ToastIds, useToast } from "@/core/toasts/hooks/useToast";
import { getRoute } from "@/lib/router";
import { ProjectFormValues } from "@/project/forms/ProjectForm";
import { upsertProject } from "@/project/project.service";
import { USER_ROUTES } from "@/user/user.constants";
import { UserSettingsTabs } from "@/user/user.types";
import { useQubicConnect } from "@/wallet/qubic/QubicConnectContext";

/**
 * Custom hook to create a new project using a mutation.
 */
export const useUpsertProject = () => {
  const { wallet } = useQubicConnect();
  const navigate = useNavigate();
  const { createToast } = useToast();

  return useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      const formData: FormData = new FormData();

      const projectId = data.id ?? undefined;

      if (!wallet || !wallet?.publicKey) {
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
      formData.append("email", data.email);
      formData.append("websiteUrl", data.websiteUrl);

      // Token Info
      formData.append("tokenName", data.tokenName ?? "");

      if (data.tokenImageUrl && data.tokenImageUrl instanceof File) {
        formData.append("tokenImage", data.tokenImageUrl);
      }

      formData.append("tokensSupply", String(data.tokensSupply));

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
      formData.append("walletAddress", wallet.publicKey);

      return upsertProject(projectId, formData);
    },
    onSuccess: () => {
      createToast(ToastIds.CONFIRMATION, {
        type: "success",
        title: "Changes saved successfully",
      });

      navigate(getRoute(USER_ROUTES.SETTINGS, { tabId: UserSettingsTabs.MY_PROJECTS }));
    },
  });
};

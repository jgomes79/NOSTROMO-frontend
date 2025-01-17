import { useMutation } from "@tanstack/react-query";

import { ProjectFormValues } from "@/project/forms/ProjectForm";
import { createProject } from "@/project/project.service";

/**
 * Custom hook to create a new project using a mutation.
 */
export const useNewProject = () =>
  useMutation({
    mutationFn: (data: ProjectFormValues) => {
      const formData: FormData = new FormData();

      // Basic Info
      formData.append("photo", data.photo);
      formData.append("banner", data.banner);
      formData.append("name", data.name);
      formData.append("description", data.description);

      // Token Info
      formData.append("tokenName", data.tokenName);
      formData.append("tokenImage", data.tokenImage);
      formData.append("tokenPrice", String(data.tokenPrice));
      formData.append("tokensSupply", String(data.tokensSupply));
      formData.append("tokenDecimals", String(data.tokenDecimals));

      // Raising Info
      formData.append("amountToRaise", String(data.amountToRaise));
      formData.append("tokensForSale", String(data.tokensForSale));

      // Social URLs
      formData.append("instagramUrl", data.social?.instagramUrl ?? "");
      formData.append("discordUrl", data.social?.discordUrl ?? "");
      formData.append("xUrl", data.social?.xUrl ?? "");
      formData.append("mediumUrl", data.social?.mediumUrl ?? "");
      formData.append("telegramUrl", data.social?.telegramUrl ?? "");

      // Documents
      formData.append("whitepaper", data.whitepaper);
      formData.append("tokenomics", data.tokenomics);
      formData.append("litepaper", data.litepaper);

      // Vesting Info
      formData.append("TGEDate", String(data.TGEDate));
      formData.append("cliff", String(data.cliff));
      formData.append("vestingDays", String(data.vestingDays));

      return createProject(formData);
    },
  });

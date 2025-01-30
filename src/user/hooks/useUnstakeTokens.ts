import { useState } from "react";

import { useMutation } from "@tanstack/react-query";

import { Tier } from "@/tier/tier.types";

import { unstakeTokens } from "../user.service";
import { User } from "../user.types";

type UnstakeTokensParams = {
  wallet: User["wallet"];
};

export const useUnstakeTokens = () => {
  const [currentTierSetting, setCurrentTierSettings] = useState<Tier["id"] | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ wallet }: UnstakeTokensParams) => unstakeTokens(wallet),
    onMutate: () => setCurrentTierSettings(1),
    onError: () => setCurrentTierSettings(null),
    onSuccess: () => setCurrentTierSettings(null),
  });

  return {
    ...mutation,
    currentTierSetting,
  };
};

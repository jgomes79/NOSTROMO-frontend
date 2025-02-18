import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useWalletClient } from "wagmi";

import { getRoute } from "@/lib/router";
import { NavigatorTitle } from "@/shared/components/NavigatorTitle";
import { useAppTitle } from "@/shared/hooks/useAppTitle";
import { TierSelector } from "@/tier/components/TierSelector";
import { Tier } from "@/tier/tier.types";

import { useSetUserTier } from "../../hooks/useSetUserTier";
import { USER_ROUTES } from "../../user.constants";
import { UserSettingsTabs } from "../../user.types";

/**
 * ChangeUserTierPage component allows users to upgrade their tier.
 * It provides a UI for selecting a new tier and handles the tier update process.
 *
 * @returns {JSX.Element} The rendered ChangeUserTierPage component.
 */
export const ChangeUserTierPage: React.FC = () => {
  const setUserTier = useSetUserTier();
  const { data: wallet } = useWalletClient();
  const navigate = useNavigate();

  useAppTitle("Upgrade Tier");

  /**
   * Handles the tier selection and updates the user's tier.
   *
   * @param {Tier} tier - The tier object containing id and other tier details.
   * @returns {Promise<void>} A promise that resolves when the tier is updated.
   * @throws {Error} If the wallet is not connected or if the mutation fails.
   */
  const handleClickSetTier = useCallback(
    async (tier: Tier) => {
      if (wallet) {
        await setUserTier.mutateAsync(
          { wallet: wallet.account.address, tierId: tier.id },
          {
            onSuccess: () => {
              navigate(getRoute(USER_ROUTES.SETTINGS, { tabId: UserSettingsTabs.MY_TIER }));
            },
          },
        );
      }
    },
    [wallet, setUserTier],
  );

  return (
    <>
      <NavigatorTitle
        text="Upgrade Tier"
        backPath={getRoute(USER_ROUTES.SETTINGS, { tabId: UserSettingsTabs.MY_TIER })}
      />
      <TierSelector
        focusLoadingId={setUserTier.currentTierSetting}
        isLoading={setUserTier.isPending}
        onSelectTier={handleClickSetTier}
      />
    </>
  );
};

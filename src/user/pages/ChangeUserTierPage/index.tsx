import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRoute } from "@/lib/router";
import { NavigatorTitle } from "@/shared/components/NavigatorTitle";
import { useAppTitle } from "@/shared/hooks/useAppTitle";
import { TierSelector } from "@/tier/components/TierSelector";
import { Tier, Tiers } from "@/tier/tier.types";
import { useChangeTier } from "@/wallet/hooks/useChangeTier";
import { useContractTier } from "@/wallet/hooks/useContractTier";
import { useQubicConnect } from "@/wallet/qubic/QubicConnectContext";

import { USER_ROUTES } from "../../user.constants";
import { UserSettingsTabs } from "../../user.types";

/**
 * ChangeUserTierPage component allows users to upgrade their tier.
 * It provides a UI for selecting a new tier and handles the tier update process.
 *
 * @returns {JSX.Element} The rendered ChangeUserTierPage component.
 */
export const ChangeUserTierPage: React.FC = () => {
  const { mutate: changeTier, isLoading: isLoadingChangeTier } = useChangeTier();
  const { mutate: getCurrentTier } = useContractTier();
  const [userTier, setUserTier] = useState<number>(Tiers.TIER_NONE);
  const { wallet } = useQubicConnect();
  const navigate = useNavigate();

  useAppTitle("Upgrade Tier");

  useEffect(() => {
    const fetchCurrentTier = async () => {
      const tier = await getCurrentTier();
      setUserTier(tier);
    };

    fetchCurrentTier();
  }, [wallet?.publicKey]);

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
        await changeTier(tier.id);
        navigate(getRoute(USER_ROUTES.SETTINGS, { tabId: UserSettingsTabs.MY_TIER }));
      }
    },
    [changeTier],
  );

  return (
    <>
      <NavigatorTitle
        text="Upgrade Tier"
        backPath={getRoute(USER_ROUTES.SETTINGS, { tabId: UserSettingsTabs.MY_TIER })}
      />
      <TierSelector currentTierId={userTier} isLoading={isLoadingChangeTier} onSelectTier={handleClickSetTier} />
    </>
  );
};

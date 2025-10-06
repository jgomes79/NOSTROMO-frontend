import { useCallback, useEffect } from "react";

import { useModal } from "@/core/modals/hooks/useModal";
import { ModalsIds } from "@/core/modals/modals.types";
import { useToast } from "@/core/toasts/hooks/useToast";
import { getRoute } from "@/lib/router";
import { NavigatorTitle } from "@/shared/components/NavigatorTitle";
import { useAppTitle } from "@/shared/hooks/useAppTitle";
import { TierSelector } from "@/tier/components/TierSelector";
import { Tier } from "@/tier/tier.types";
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
  const { mutate: changeTier } = useChangeTier();
  const { data, refetch: refetchTier, isLoading: isLoadingGetCurrentTier } = useContractTier();
  const { wallet } = useQubicConnect();
  const { openModal, closeModal } = useModal();
  const { createToast } = useToast();
  // const navigate = useNavigate();

  useAppTitle("Upgrade Tier");

  useEffect(() => {
    const fetchCurrentTier = async () => {
      await refetchTier();
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
        console.log("tier", tier);
        openModal(ModalsIds.CONFIRMATION, {
          title: "Change tier?",
          description: "Are you sure you want to change your tier?",
          type: "info",
          onConfirm: {
            caption: "Change Tier",
            action: async (setLoading) => {
              setLoading(true);
              await changeTier(tier.id);
              // createToast(ToastIds.CONFIRMATION, {
              //   title: "Tier changed",
              //   type: "success",
              // });
              // closeModal();
              // navigate(getRoute(USER_ROUTES.SETTINGS, { tabId: UserSettingsTabs.MY_TIER }));
            },
          },
          onDecline: {
            caption: "Cancel",
            action: () => {
              closeModal();
            },
          },
        });
      }
    },
    [changeTier, openModal, createToast],
  );

  return (
    <>
      <NavigatorTitle
        text="Upgrade Tier"
        backPath={getRoute(USER_ROUTES.SETTINGS, { tabId: UserSettingsTabs.MY_TIER })}
      />
      <TierSelector
        currentTierId={data.tierLevel}
        isLoading={isLoadingGetCurrentTier}
        onSelectTier={handleClickSetTier}
      />
    </>
  );
};

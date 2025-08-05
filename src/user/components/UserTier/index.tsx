import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import classNames from "clsx";
import { RiArrowUpCircleLine, RiHandCoinLine } from "react-icons/ri";

import { useModal } from "@/core/modals/hooks/useModal";
import { ModalsIds } from "@/core/modals/modals.types";
import { ToastIds, useToast } from "@/core/toasts/hooks/useToast";
import { formatPrice } from "@/lib/number";
import { getRoute } from "@/lib/router";
import { Button } from "@/shared/components/Button";
import { DataLabel } from "@/shared/components/DataLabel";
import { Fieldset } from "@/shared/components/Fieldset";
import { Typography } from "@/shared/components/Typography";
import { TierImage } from "@/tier/components/TierImage";
import { TierSelector } from "@/tier/components/TierSelector";
import { Tier, Tiers, TiersData } from "@/tier/tier.types";
import { USER_ROUTES } from "@/user/user.constants";
import { useContractTier } from "@/wallet/hooks/useContractTier";
import { useRegisterTier } from "@/wallet/hooks/useRegisterTier";
import { useRemoveTier } from "@/wallet/hooks/useRemoveTier";

import styles from "./UserTier.module.scss";
import { useUserByWallet } from "../../hooks/useUserByWallet";
import { User } from "../../user.types";

/**
 * Props interface for UserTier component
 * @interface UserTierProps
 * @property {User["wallet"]} walletAddress - The wallet address of the user
 */
interface UserTierProps {
  wallet: User["wallet"];
  userTier: number;
}

/**
 * Component that displays and manages user tiers
 * @component
 * @param {UserTierProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const UserTier: React.FC<UserTierProps> = ({ wallet, userTier }) => {
  const navigate = useNavigate();

  const { refetch: refetchUserbyWallet } = useUserByWallet(wallet);
  const { refetch: refetchTier } = useContractTier();
  const { mutate: registerInTier, isLoading: isLoadingRegisterInTier } = useRegisterTier();
  const { mutate: removeTier } = useRemoveTier();
  const { openModal, closeModal } = useModal();
  const { createToast } = useToast();

  /**
   * Handles the click event for upgrading the user's tier
   * Sets the trying upgrade state to true to indicate an upgrade attempt is in progress
   * @returns {void}
   */
  const handleClickUpgradeTier = useCallback(() => {
    navigate(getRoute(USER_ROUTES.CHANGE_TIER));
  }, []);

  /**
   * Handles the click event for unstaking tokens
   * Calls the unstake mutation and refreshes user data
   * @returns {Promise<void>} A promise that resolves when tokens are unstaked
   */
  const handleClickUnstakeTokens = useCallback(async () => {
    if (wallet) {
      openModal(ModalsIds.CONFIRMATION, {
        title: "Unstake Tokens",
        description: "Are you sure you want to unstake your tokens?",
        type: "info",
        onConfirm: {
          caption: "Unstake Tokens",
          action: async (setLoading) => {
            setLoading(true);
            await removeTier();
            await refetchUserbyWallet();
            await refetchTier();
            createToast(ToastIds.CONFIRMATION, {
              title: "Tokens Unstaked",
              type: "success",
            });
            closeModal();
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
  }, [wallet, removeTier, refetchUserbyWallet]);

  /**
   * Handles the tier selection and updates the user's tier
   * @param {Tier} tier - The tier object containing id and other tier details
   * @returns {Promise<void>} A promise that resolves when the tier is updated
   * @throws {Error} If the wallet is not connected or if the mutation fails
   */
  const handleClickSetTier = useCallback(
    async (tier: Tier) => {
      if (wallet) {
        openModal(ModalsIds.CONFIRMATION, {
          title: "Stake QUBIC to upgrade",
          description: "Are you sure you want to upgrade your tier?",
          type: "info",
          onConfirm: {
            caption: "Upgrade Tier",
            action: async (setLoading) => {
              setLoading(true);
              await registerInTier(tier.id);
              await refetchUserbyWallet();
              await refetchTier();
              createToast(ToastIds.CONFIRMATION, {
                title: "Tier Upgraded",
                type: "success",
              });
              closeModal();
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
    [wallet, registerInTier],
  );

  if (userTier === Tiers.TIER_NONE) {
    return (
      <div className={classNames(styles.grid, styles.spacing)}>
        <Typography variant={"body"} size={"xlarge"} className={styles.title} textAlign={"center"}>
          Select a tier to start investing in NOSTROMO Projects and unlock features
        </Typography>
        <TierSelector currentTierId={userTier} isLoading={isLoadingRegisterInTier} onSelectTier={handleClickSetTier} />
      </div>
    );
  }

  return (
    <div className={classNames(styles.grid, styles.two)}>
      <div className={styles.grid}>
        <div className={styles.tier}>
          <TierImage tier={userTier} size={256} />
        </div>
        <div className={styles.actions}>
          <Button
            variant={"solid"}
            color={"warning"}
            iconLeft={<RiArrowUpCircleLine />}
            caption={"Upgrade Tier"}
            onClick={handleClickUpgradeTier}
          />
          <Button
            variant={"solid"}
            color={"primary"}
            iconLeft={<RiHandCoinLine />}
            caption={"Unstake Tokens"}
            onClick={handleClickUnstakeTokens}
          />
        </div>
      </div>
      <div className={styles.grid}>
        <div className={classNames(styles.grid, styles.two, styles.labels)}>
          <DataLabel label={"Your tier"} value={TiersData[userTier as keyof typeof TiersData]?.name} />
          <DataLabel
            label={"Staked $QUBIC"}
            value={formatPrice(TiersData[userTier as keyof typeof TiersData]?.stakeAmount, "QUBIC", 0)}
          />
        </div>

        <Fieldset title={"Benefits"}>
          <Typography variant={"body"} size={"small"}>
            <p dangerouslySetInnerHTML={{ __html: TiersData[userTier as keyof typeof TiersData]?.benefits }} />
          </Typography>
        </Fieldset>
      </div>
    </div>
  );
};

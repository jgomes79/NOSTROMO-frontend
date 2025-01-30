import { useState, useCallback } from "react";

import classNames from "clsx";

import { formatPrice } from "@/lib/number";
import { Button } from "@/shared/components/Button";
import { DataLabel } from "@/shared/components/DataLabel";
import { Fieldset } from "@/shared/components/Fieldset";
import { Loader } from "@/shared/components/Loader";
import { Typography } from "@/shared/components/Typography";
import { TierImage } from "@/tier/components/TierImage";
import { TierSelector } from "@/tier/components/TierSelector";
import { Tier, Tiers } from "@/tier/tier.types";

import styles from "./UserTiersTab.module.scss";
import { useSetUserTier } from "../../hooks/useSetUserTier";
import { useUnstakeTokens } from "../../hooks/useUnstakeTokens";
import { useUserByWallet } from "../../hooks/useUserByWallet";
import { User } from "../../user.types";

/**
 * Props interface for UserTiersTab component
 * @interface UserTiersTabProps
 * @property {User["wallet"]} walletAddress - The wallet address of the user
 */
interface UserTiersTabProps {
  walletAddress: User["wallet"];
}

/**
 * Component that displays and manages user tiers
 * @component
 * @param {UserTiersTabProps} props - Component props
 * @returns {JSX.Element} Rendered component
 */
export const UserTiersTab: React.FC<UserTiersTabProps> = ({ walletAddress }) => {
  const setUserTier = useSetUserTier();
  const unstakeTokens = useUnstakeTokens();

  const { data: user, isLoading: isLoadingUser, refetch: refetchUserbyWallet } = useUserByWallet(walletAddress);
  const [isTryingUpgrade, setTryingUpgrade] = useState<boolean>(false);

  /**
   * Handles the click event for upgrading the user's tier
   * Sets the trying upgrade state to true to indicate an upgrade attempt is in progress
   * @returns {void}
   */
  const handleClickUpgradeTier = useCallback(() => {
    setTryingUpgrade(true);
  }, []);

  /**
   * Handles the click event for unstaking tokens
   * Calls the unstake mutation and refreshes user data
   * @returns {Promise<void>} A promise that resolves when tokens are unstaked
   */
  const handleClickUnstakeTokens = useCallback(async () => {
    if (walletAddress) {
      await unstakeTokens.mutateAsync({ wallet: walletAddress });
      refetchUserbyWallet();
      setTryingUpgrade(false);
    }
  }, [walletAddress, unstakeTokens, refetchUserbyWallet]);

  /**
   * Handles the tier selection and updates the user's tier
   * @param {Tier} tier - The tier object containing id and other tier details
   * @returns {Promise<void>} A promise that resolves when the tier is updated
   * @throws {Error} If the wallet is not connected or if the mutation fails
   */
  const handleClickSetTier = useCallback(
    async (tier: Tier) => {
      if (walletAddress) {
        await setUserTier.mutateAsync({ wallet: walletAddress, tierId: tier.id });
        refetchUserbyWallet();
        setTryingUpgrade(false);
      }
    },
    [walletAddress, setUserTier, refetchUserbyWallet],
  );

  if (!user || isLoadingUser) {
    return (
      <div className={classNames(styles.grid, styles.center)}>
        <Loader size={42} className={styles.loader} />
      </div>
    );
  }

  if (isTryingUpgrade || user.tier.id === Tiers.TIER_NONE) {
    return (
      <div className={classNames(styles.grid, styles.spacing)}>
        <Typography variant={"body"} size={"xlarge"} className={styles.title} textAlign={"center"}>
          Select a tier to start investing in NOSTROMO Projects and unlock features
        </Typography>
        <TierSelector
          focusLoadingId={setUserTier.currentTierSetting}
          isLoading={setUserTier.isPending}
          onSelectTier={handleClickSetTier}
        />
      </div>
    );
  }

  return (
    <div className={classNames(styles.grid, styles.two)}>
      <div className={styles.grid}>
        <div className={styles.tier}>
          <TierImage tier={user.tier.id} size={256} />
        </div>
        <div className={styles.actions}>
          <Button variant={"solid"} color={"primary"} caption={"Upgrade Tier"} onClick={handleClickUpgradeTier} />
          <Button variant={"ghost"} color={"primary"} caption={"Unstake Tokens"} onClick={handleClickUnstakeTokens} />
        </div>
      </div>
      <div className={styles.grid}>
        <div className={classNames(styles.grid, styles.two, styles.labels)}>
          <DataLabel label={"Your tier"} value={user.tier.name} />
          <DataLabel label={"Staked Token"} value={formatPrice(user.tier.stakeAmount, "QUBIC", 2)} />
        </div>

        <Fieldset title={"Benefits"}>
          <Typography variant={"body"} size={"small"}>
            <p dangerouslySetInnerHTML={{ __html: user.tier.benefits }} />
          </Typography>
        </Fieldset>
      </div>
    </div>
  );
};

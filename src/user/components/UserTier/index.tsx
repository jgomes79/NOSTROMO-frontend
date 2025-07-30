import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import classNames from "clsx";
import { RiArrowUpCircleLine, RiHandCoinLine } from "react-icons/ri";

import { formatPrice } from "@/lib/number";
import { getRoute } from "@/lib/router";
import { Button } from "@/shared/components/Button";
import { DataLabel } from "@/shared/components/DataLabel";
import { Fieldset } from "@/shared/components/Fieldset";
import { Loader } from "@/shared/components/Loader";
import { Typography } from "@/shared/components/Typography";
import { TierImage } from "@/tier/components/TierImage";
import { TierSelector } from "@/tier/components/TierSelector";
import { Tier, Tiers, TiersData } from "@/tier/tier.types";
import { USER_ROUTES } from "@/user/user.constants";
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

  const { data: user, isLoading: isLoadingUser, refetch: refetchUserbyWallet } = useUserByWallet(wallet);
  const { mutate: registerInTier, isLoading: isLoadingRegisterInTier } = useRegisterTier();
  const { mutate: removeTier, isLoading: isLoadingRemoveTier } = useRemoveTier();

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
      await removeTier();
      //window.location.reload();
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
        await registerInTier(tier.id);
        //window.location.reload();
      }
    },
    [wallet, registerInTier],
  );

  if (!user || isLoadingUser || isLoadingRegisterInTier || isLoadingRemoveTier) {
    return (
      <div className={classNames(styles.grid, styles.center)}>
        <Loader size={42} className={styles.loader} />
      </div>
    );
  }

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

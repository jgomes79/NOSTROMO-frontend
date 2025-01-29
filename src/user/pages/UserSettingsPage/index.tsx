import { useCallback, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { WalletButton } from "@rainbow-me/rainbowkit";
import classNames from "clsx";
import { RiAliensFill, RiWallet2Line } from "react-icons/ri";
import { useWalletClient } from "wagmi";

import { formatPrice } from "@/lib/number";
import { getRoute } from "@/lib/router";
import { ProjectsListByWallet } from "@/project/components/ProjectsListByWallet";
import { Button } from "@/shared/components/Button";
import { DataLabel } from "@/shared/components/DataLabel";
import { Fieldset } from "@/shared/components/Fieldset";
import { Tabs } from "@/shared/components/Tabs";
import { Typography } from "@/shared/components/Typography";
import { ErrorPage } from "@/shared/pages/ErrorPage";
import { TierSelector } from "@/tier/components/TierSelector";
import { Tier, Tiers } from "@/tier/tier.types";
import { useSetUserTier } from "@/user/hooks/useSetUserTier";

import styles from "./UserSettingsPage.module.scss";
import { TierImage } from "../../../tier/components/TierImage";
import { useUserByWallet } from "../../hooks/useUserByWallet";
import { USER_ROUTES } from "../../user.constants";
import { UserSettingsTabs } from "../../user.types";

/**
 * Parameters for the UserSettingsPage component
 * @typedef {Object} UserSettingsPageParams
 * @property {UserSettingsTabs} tabId - The ID of the currently selected settings tab
 */
type UserSettingsPageParams = {
  tabId: UserSettingsTabs;
};

/**
 * User Settings Page Component
 *
 * Renders the user settings interface with navigation tabs and content.
 * If no tab is selected, redirects to the tier settings tab by default.
 *
 * @component
 * @returns {JSX.Element} The rendered UserSettingsPage component
 */
export const UserSettingsPage: React.FC = () => {
  const params = useParams<UserSettingsPageParams>();
  const navigate = useNavigate();

  const { data: wallet } = useWalletClient();
  const setUserTier = useSetUserTier();
  const { data: user, refetch: refetchUserbyWalle } = useUserByWallet(wallet?.account.address);
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
   * Handles the tier selection and updates the user's tier
   * @param {Tier} tier - The tier object containing id and other tier details
   * @returns {Promise<void>} A promise that resolves when the tier is updated
   * @throws {Error} If the wallet is not connected or if the mutation fails
   */
  const handleClickSetTier = useCallback(
    async (tier: Tier) => {
      if (wallet) {
        await setUserTier.mutateAsync({ wallet: wallet.account.address, tierId: tier.id });
        refetchUserbyWalle();
        setTryingUpgrade(false);
      }
    },
    [wallet],
  );

  if (!params.tabId) {
    /**
     * Redirect to the tier settings tab if no tab is selected
     */
    return <Navigate to={getRoute(USER_ROUTES.SETTINGS, { tabId: UserSettingsTabs.TIER })} />;
  }

  /**
   * Display error page if wallet is not connected
   * Shows a connect wallet button using MetaMask
   * @returns {JSX.Element} Error page with wallet connection prompt
   */
  if (!wallet || !wallet.account.address) {
    return (
      <ErrorPage
        code={<RiAliensFill className={styles.alien} />}
        title={"No Signal"}
        description={"To create a project, you need to be connected to a wallet."}
        actions={[
          <WalletButton.Custom wallet="metamask" key={"connect"}>
            {({ connected, connect }) => (
              <>
                {!connected && (
                  <Button
                    variant={"solid"}
                    color={"secondary"}
                    size={"small"}
                    caption={"Connect Wallet"}
                    onClick={connect}
                    iconLeft={<RiWallet2Line />}
                  />
                )}
              </>
            )}
          </WalletButton.Custom>,
        ]}
      />
    );
  }

  /**
   * Renders the appropriate content based on the selected settings tab
   * @returns {JSX.Element} The rendered tab content component
   */
  const renderTab = () => {
    switch (params.tabId) {
      case UserSettingsTabs.TIER:
        return user && user.tier.id > Tiers.TIER_NONE && !isTryingUpgrade ? (
          <div className={classNames(styles.grid, styles.two)}>
            <div className={styles.grid}>
              <div className={styles.tier}>
                <TierImage tier={user.tier.id} size={256} />
              </div>
              <div className={styles.actions}>
                <Button variant={"solid"} color={"primary"} caption={"Upgrade Tier"} onClick={handleClickUpgradeTier} />
                <Button variant={"ghost"} color={"primary"} caption={"Unstake Tokens"} />
              </div>
            </div>
            <div className={styles.grid}>
              <div className={classNames(styles.grid, styles.two, styles.labels)}>
                <DataLabel label={"Your tier"} value={user.tier.name} />
                <DataLabel label={"Staked Token"} value={formatPrice(5000000, "QUBIC", 2)} />
              </div>

              <Fieldset title={"Benefits"}>
                <Typography variant={"body"} size={"small"}>
                  {user.tier.benefits}
                </Typography>
              </Fieldset>
            </div>
          </div>
        ) : (
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

      case UserSettingsTabs.MY_PROJECTS:
        return <ProjectsListByWallet walletAddress={wallet.account.address} limit={9} />;

      case UserSettingsTabs.CLAIM_TOKENS:
        return <div>Claim Tokens</div>;
    }
  };

  return (
    <div className={styles.layout}>
      <div className={styles.effect}>
        <div className={classNames(styles.container, styles.lighten)}>
          <div className={styles.header}>
            <div className={classNames(styles.inline, styles.center)}>
              <RiAliensFill size={42} />
              <Typography variant={"heading"} size={"xlarge"}>
                User Settings
              </Typography>
            </div>
            <div className={styles.tabs}>
              <Tabs
                size={"large"}
                tabs={[
                  {
                    id: UserSettingsTabs.TIER,
                    label: "Tier",
                  },
                  {
                    id: UserSettingsTabs.MY_PROJECTS,
                    label: "Projects",
                  },
                  {
                    id: UserSettingsTabs.CLAIM_TOKENS,
                    label: "Claim Tokens",
                  },
                ]}
                activeId={params.tabId}
                onChange={(tabId) => navigate(getRoute(USER_ROUTES.SETTINGS, { tabId }))}
              />
            </div>
          </div>
        </div>
        <div className={styles.body}>{renderTab()}</div>
      </div>
    </div>
  );
};

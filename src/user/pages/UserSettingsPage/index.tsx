import { Navigate, useNavigate, useParams } from "react-router-dom";

import { WalletButton } from "@rainbow-me/rainbowkit";
import classNames from "clsx";
import { RiAliensFill, RiWallet2Line } from "react-icons/ri";
import { useWalletClient } from "wagmi";

import { formatPrice } from "@/lib/number";
import { getRoute } from "@/lib/router";
import { ProjectsListByWallet } from "@/project/components/ProjectsListByWallet";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { DataLabel } from "@/shared/components/DataLabel";
import { Tabs } from "@/shared/components/Tabs";
import { Typography } from "@/shared/components/Typography";
import { ErrorPage } from "@/shared/pages/ErrorPage";
import { useUserInfo } from "@/user/hooks/useUserInfo";

import styles from "./UserSettingsPage.module.scss";
import { UserTierImage } from "../../components/UserTierImage";
import { TIER_NAMES, USER_ROUTES } from "../../user.constants";
import { UserSettingsTabs, UserTiers } from "../../user.types";

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
  const wallet = useWalletClient();
  const { data: user } = useUserInfo(wallet.data?.account.address);
  const params = useParams<UserSettingsPageParams>();
  const navigate = useNavigate();

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
  if (!wallet || !wallet.data?.account.address) {
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
        return user && user.tier && user.tier > UserTiers.TIER_NONE ? (
          <div className={classNames(styles.grid, styles.two)}>
            <div className={styles.grid}>
              <div className={styles.tier}>
                <UserTierImage tier={user?.tier} size={256} />
              </div>
              <div className={styles.actions}>
                <Button variant={"solid"} color={"primary"} caption={"Upgrade Tier"} />
                <Button variant={"ghost"} color={"primary"} caption={"Unstake Tokens"} />
              </div>
            </div>
            <div className={styles.grid}>
              <div className={classNames(styles.grid, styles.two, styles.labels)}>
                <DataLabel label={"Your tier"} value={user?.tier ? TIER_NAMES[user.tier] : ""} />
                <DataLabel label={"Staked Token"} value={formatPrice(5000000, "QUBIC", 2)} />
              </div>

              <Card title={"Benefits"}>
                <Typography variant={"body"} size={"small"}>
                  Hola
                </Typography>
              </Card>
            </div>
          </div>
        ) : (
          <div>No tier</div>
        );
      case UserSettingsTabs.MY_PROJECTS:
        return <ProjectsListByWallet walletAddress={wallet.data.account.address} limit={9} />;
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

import { Navigate, useNavigate, useParams } from "react-router-dom";

import { WalletButton } from "@rainbow-me/rainbowkit";
import classNames from "clsx";
import { RiAliensFill, RiWallet2Line } from "react-icons/ri";
import { useWalletClient } from "wagmi";

import { getRoute } from "@/lib/router";
import { ProjectsListByWallet } from "@/project/components/ProjectsListByWallet";
import { Button } from "@/shared/components/Button";
import { Loader } from "@/shared/components/Loader";
import { Tabs } from "@/shared/components/Tabs";
import { Typography } from "@/shared/components/Typography";
import { ErrorPage } from "@/shared/pages/ErrorPage";
import { UserTiersTab } from "@/user/components/UserTiersTab";

import styles from "./UserSettingsPage.module.scss";
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
 * Handles wallet connection state and displays appropriate UI based on connection status.
 *
 * @component
 * @returns {JSX.Element} The rendered UserSettingsPage component
 * @throws {Navigate} Redirects to tier settings tab if no tab is selected
 */
export const UserSettingsPage: React.FC = () => {
  const params = useParams<UserSettingsPageParams>();
  const navigate = useNavigate();

  const { data: wallet, isPending: isLoadingWallet } = useWalletClient();

  if (!params || !params.tabId) {
    return <Navigate to={getRoute(USER_ROUTES.SETTINGS, { tabId: UserSettingsTabs.TIER })} />;
  }

  /**
   * Renders the appropriate content based on the selected settings tab
   * @returns {JSX.Element | null} The rendered tab content component or null if wallet is not connected
   */
  const renderTab = () => {
    if (!wallet) return null;

    switch (params.tabId) {
      case UserSettingsTabs.TIER:
        return <UserTiersTab walletAddress={wallet.account.address} />;

      case UserSettingsTabs.MY_PROJECTS:
        return <ProjectsListByWallet walletAddress={wallet.account.address} limit={9} />;

      case UserSettingsTabs.CLAIM_TOKENS:
        return <div>Claim Tokens</div>;
    }
  };

  /**
   * Renders the main container with header and content
   * Handles loading state and wallet connection status
   * @returns {JSX.Element} The rendered container component
   */
  const renderContainer = () => {
    if (isLoadingWallet || !params.tabId) {
      return (
        <div className={classNames(styles.container, styles.center)}>
          <Loader size={42} className={styles.loader} />
        </div>
      );
    }

    if (!wallet || !wallet.account.address) {
      return (
        <div className={styles.container}>
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
        </div>
      );
    }

    return (
      <>
        <div className={classNames(styles.container, styles.lighten)}>
          <div className={styles.header}>
            <div className={classNames(styles.inline, styles.center)}>
              <RiAliensFill size={42} />
              <Typography variant={"heading"} size={"xlarge"}>
                User Settings
              </Typography>
            </div>
            <div className={styles.tabs}>
              <Tabs<UserSettingsTabs>
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
      </>
    );
  };

  return (
    <div className={styles.layout}>
      <div className={styles.effect}>{renderContainer()}</div>
    </div>
  );
};

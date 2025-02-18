import { Outlet } from "react-router-dom";

import { WalletButton } from "@rainbow-me/rainbowkit";
import classNames from "clsx";
import { RiAliensFill, RiWallet2Fill, RiWallet2Line } from "react-icons/ri";
import { useWalletClient } from "wagmi";

import { Button } from "@/shared/components/Button";
import { Loader } from "@/shared/components/Loader";
import { Typography } from "@/shared/components/Typography";
import useResponsive from "@/shared/hooks/useResponsive";
import { ErrorPage } from "@/shared/pages/ErrorPage";
import { shortHex } from "@/wallet/wallet.helpers";

import styles from "./UserSettingsLayout.module.scss";

/**
 * User Settings Layout Component
 *
 * Renders the user settings layout with a background effect and content.
 *
 * @component
 * @returns {JSX.Element} The rendered UserSettingsLayout component
 * @throws {Navigate} Redirects to tier settings tab if no tab is selected
 */
export const UserSettingsLayout: React.FC = () => {
  const { data: wallet, isLoading: isLoadingWallet } = useWalletClient();
  const { isMobile, isTabletVertical } = useResponsive();

  if (isLoadingWallet) {
    return (
      <div className={styles.container}>
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
    <div className={styles.layout}>
      <div className={styles.effect} />
      <div className={classNames(styles.container, styles.lighten)}>
        <div className={styles.header}>
          <div className={classNames(styles.inline, styles.center)}>
            <RiAliensFill size={42} />
            <div className={styles.title}>
              <Typography variant={"heading"} size={"xlarge"}>
                User Settings
              </Typography>
              <div className={classNames(styles.inline, styles.label)}>
                <RiWallet2Fill size={18} />
                <Typography variant={"label"} size={"medium"}>
                  {shortHex(wallet.account.address, isMobile || isTabletVertical ? 6 : 34)}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        <Outlet />
      </div>
    </div>
  );
};

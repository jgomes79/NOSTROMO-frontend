import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import classNames from "clsx";
import { RiAliensFill, RiCoinFill, RiWallet2Fill } from "react-icons/ri";

import { formatNumber } from "@/lib/number";
import { Loader } from "@/shared/components/Loader";
import { Typography } from "@/shared/components/Typography";
import useResponsive from "@/shared/hooks/useResponsive";
import { ErrorPage } from "@/shared/pages/ErrorPage";
import { useBalance } from "@/wallet/hooks/useBalance";
import { useQubicConnect } from "@/wallet/qubic/QubicConnectContext";
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
  const { wallet } = useQubicConnect();
  const {
    data: { balance },
    isLoading: isLoadingBalance,
    refetch,
  } = useBalance();
  const { isMobile, isTabletVertical } = useResponsive();

  useEffect(() => {
    async function getBalance() {
      await refetch();
    }
    getBalance().then();
  }, [wallet]);

  if (!wallet?.publicKey) {
    return (
      <div className={styles.container}>
        <Loader size={42} className={styles.loader} />
      </div>
    );
  }

  if (!wallet || !wallet.publicKey) {
    return (
      <div className={styles.container}>
        <ErrorPage
          code={<RiAliensFill className={styles.alien} />}
          title={"No Signal"}
          description={"To create a project, you need to be connected to a wallet."}
          actions={
            [
              // <WalletButton.Custom wallet="metamask" key={"connect"}>
              //   {({ connected, connect }) => (
              //     <>
              //       {!connected && (
              //         <Button
              //           variant={"solid"}
              //           color={"secondary"}
              //           size={"small"}
              //           caption={"Connect Wallet"}
              //           onClick={connect}
              //           iconLeft={<RiWallet2Line />}
              //         />
              //       )}
              //     </>
              //   )}
              // </WalletButton.Custom>,
            ]
          }
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
              <div className={styles.inline}>
                <div className={classNames(styles.inline, styles.label)}>
                  <RiWallet2Fill size={18} />
                  <Typography variant={"label"} size={"medium"}>
                    {shortHex(wallet.publicKey, isMobile || isTabletVertical ? 6 : 9)}
                  </Typography>
                </div>
                <div className={classNames(styles.inline, styles.label)}>
                  <RiCoinFill size={18} />
                  {isLoadingBalance ? (
                    <Loader size={20} />
                  ) : (
                    <Typography variant={"label"} size={"medium"}>
                      {formatNumber(balance)} QUBIC
                    </Typography>
                  )}
                </div>
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

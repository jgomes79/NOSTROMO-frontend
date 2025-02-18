import { useNavigate } from "react-router-dom";

import { WalletButton } from "@rainbow-me/rainbowkit";
import { RiAliensFill, RiLogoutBoxLine, RiWallet2Line } from "react-icons/ri";
import { useWalletClient, useDisconnect } from "wagmi";

import { HOME_ROUTES } from "@/home/home.constants";
import { getRoute } from "@/lib/router";
import { Button } from "@/shared/components/Button";
import { IconButton } from "@/shared/components/IconButton";
import useResponsive from "@/shared/hooks/useResponsive";
import { USER_ROUTES } from "@/user/user.constants";
import { UserSettingsTabs } from "@/user/user.types";

import styles from "./WalletAccount.module.scss";
import { shortHex } from "../../wallet.helpers";

/**
 * WalletAccount component that displays the connected wallet address or a button to connect the wallet.
 *
 * @returns {JSX.Element} The WalletAccount component.
 */
export const WalletAccount: React.FC = () => {
  const { data } = useWalletClient();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const { isMobile, isTabletVertical } = useResponsive();

  const isMobileOrTabletVertical = isMobile || isTabletVertical;

  /**
   * Handles the click event for the account button.
   * Navigates to the user settings page.
   */
  const handleClickAccount = () => {
    navigate(getRoute(USER_ROUTES.SETTINGS, { tabId: UserSettingsTabs.MY_TIER }));
  };

  /**
   * Handles the click event for the disconnect button.
   * Disconnects the wallet and navigates to the home page.
   */
  const handleClickDisconnect = () => {
    disconnect();
    navigate(getRoute(HOME_ROUTES.HOME));
  };

  return (
    <div className={styles.layout}>
      <WalletButton.Custom wallet="metamask">
        {({ connected, connect }) => (
          <>
            {connected && data ? (
              <div className={styles.actions}>
                {isMobileOrTabletVertical ? (
                  <IconButton size={"medium"} variant={"ghost"} icon={<RiAliensFill />} onClick={handleClickAccount} />
                ) : (
                  <Button
                    size={"medium"}
                    variant={"ghost"}
                    iconRight={<RiAliensFill />}
                    caption={shortHex(data.account.address, 5)}
                    onClick={handleClickAccount}
                  />
                )}

                <IconButton
                  size={"medium"}
                  variant={"ghost"}
                  icon={<RiLogoutBoxLine />}
                  onClick={handleClickDisconnect}
                />
              </div>
            ) : (
              <Button
                variant={"solid"}
                color={"primary"}
                size={"medium"}
                caption={"Connect Wallet"}
                onClick={connect}
                iconLeft={<RiWallet2Line />}
              />
            )}
          </>
        )}
      </WalletButton.Custom>
    </div>
  );
};

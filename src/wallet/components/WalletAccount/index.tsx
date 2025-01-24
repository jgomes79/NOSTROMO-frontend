import { useNavigate } from "react-router-dom";

import { WalletButton } from "@rainbow-me/rainbowkit";
import { RiAliensFill, RiWallet2Line } from "react-icons/ri";
import { useWalletClient } from "wagmi";

import { getRoute } from "@/lib/router";
import { Button } from "@/shared/components/Button";
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
  const navigate = useNavigate();

  /**
   * Handles the click event for the account button.
   * Navigates to the user settings page.
   */
  const handleClickAccount = () => {
    navigate(getRoute(USER_ROUTES.SETTINGS, { tabId: UserSettingsTabs.TIER }));
  };

  return (
    <div className={styles.layout}>
      <WalletButton.Custom wallet="metamask">
        {({ connected, connect }) => (
          <>
            {connected && data ? (
              <Button
                size={"small"}
                variant={"ghost"}
                iconRight={<RiAliensFill />}
                caption={shortHex(data.account.address, 5)}
                onClick={handleClickAccount}
              />
            ) : (
              <Button
                variant={"solid"}
                color={"primary"}
                size={"small"}
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

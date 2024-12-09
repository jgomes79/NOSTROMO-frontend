import { WalletButton } from "@rainbow-me/rainbowkit";
import { RiWallet2Line } from "react-icons/ri";
import { useWalletClient } from "wagmi";

import { Button } from "@/shared/components/Button";
import { Typography } from "@/shared/components/Typography";
import { shortHex } from "@/wallet/wallet.helpers";

import styles from "./WalletAccount.module.scss";

export const WalletAccount: React.FC = () => {
  const { data } = useWalletClient();
  return (
    <div className={styles.layout}>
      <WalletButton.Custom wallet="metamask">
        {({ connected, connect }) => (
          <>
            {connected && data ? (
              <Typography>{shortHex(data.account.address, 5)}</Typography>
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

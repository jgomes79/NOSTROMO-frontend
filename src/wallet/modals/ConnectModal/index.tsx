import { useCallback, useState } from "react";

import { SiWalletconnect } from "react-icons/si";

import { useModal } from "@/core/modals/hooks/useModal";
import { Button } from "@/shared/components/Button";
import { Typography } from "@/shared/components/Typography";
import { useQubicConnect } from "@/wallet/qubic/QubicConnectContext";
import { connectSnap, getSnap } from "@/wallet/qubic/utils";

import styles from "./ConnectModal.module.scss";
import { Card } from "../../../shared/components/Card";
import QubicLogo from "../../assets/images/logo.svg";
import MetamaskLogo from "../../assets/images/metamask.svg";

/**
 * ConnectModal component that displays wallet connection options.
 *
 * @returns {JSX.Element} The rendered ConnectModal component.
 */
export const ConnectModal = () => {
  const [isConnecting, setConnecting] = useState<"metamask" | "walletconnect" | null>(null);
  const { config, connect, getMetaMaskPublicId } = useQubicConnect();
  const { closeModal } = useModal();

  /**
   * Handles the click event for connecting to Metamask.
   */
  const handleClickConnect = useCallback(async () => {
    try {
      setConnecting("metamask");
      const snapId = config?.snapOrigin;
      await connectSnap(snapId);
      await getSnap();

      // get publicId from snap
      const publicKey = await getMetaMaskPublicId(0);
      const wallet = {
        connectType: "mmSnap",
        publicKey,
      };
      connect(wallet);
      setConnecting(null);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <Card className={styles.layout}>
      <QubicLogo />

      <div className={styles.body}>
        <Typography variant={"body"} size={"large"}>
          Connect your wallet
        </Typography>
        <Typography variant={"body"} size={"medium"} className={styles.gray}>
          Use your favorite provider to connect to Nostromo Launchpad.
        </Typography>
      </div>

      <div className={styles.actions}>
        <Button
          caption={"Metamask"}
          className={styles.metamask}
          variant={"solid"}
          color={"warning"}
          isLoading={isConnecting === "metamask"}
          iconLeft={<MetamaskLogo />}
          onClick={handleClickConnect}
        />
        <Button
          caption={"WalletConnect"}
          variant={"solid"}
          color={"secondary"}
          isLoading={isConnecting === "walletconnect"}
          iconLeft={<SiWalletconnect />}
        />
      </div>
    </Card>
  );
};

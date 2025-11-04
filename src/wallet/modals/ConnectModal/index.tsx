import { useCallback, useState } from "react";

import { SiWalletconnect } from "react-icons/si";

import { useModal } from "@/core/modals/hooks/useModal";
import { Button } from "@/shared/components/Button";
import { Typography } from "@/shared/components/Typography";
import { useQubicConnect } from "@/wallet/qubic/QubicConnectContext";
import { connectSnap, getSnap } from "@/wallet/qubic/utils";

import { Card } from "../../../shared/components/Card";
import QubicLogo from "../../assets/images/logo.svg";
import MetamaskLogo from "../../assets/images/metamask.svg";
import styles from "./ConnectModal.module.scss";

/**
 * ConnectModal component that displays wallet connection options.
 *
 * @returns {JSX.Element} The rendered ConnectModal component.
 */
export const ConnectModal = () => {
  const [isConnecting, setConnecting] = useState<"metamask" | "walletconnect" | null>(null);
  const [showWCQR, setShowWCQR] = useState(false);
  const { config, connect, getMetaMaskPublicId, startWalletConnect, wcQrCode, wcUri } = useQubicConnect();
  const { closeModal } = useModal();

  /**
   * Handles the click event for connecting to Metamask.
   */
  const handleClickMetaMask = useCallback(async () => {
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
      console.error("MetaMask connection error:", error);
      setConnecting(null);
    }
  }, [config, connectSnap, getSnap, getMetaMaskPublicId, connect, closeModal]);

  /**
   * Handles the click event for connecting to WalletConnect.
   */
  const handleClickWalletConnect = useCallback(async () => {
    try {
      setConnecting("walletconnect");
      setShowWCQR(true);
      // This will generate QR code and URI
      const { approve } = await startWalletConnect();
      // Wait for user to scan QR and approve connection
      await approve();
      // Connection is handled in the approve callback
      setConnecting(null);
      setShowWCQR(false);
      closeModal();
    } catch (error) {
      console.error("WalletConnect connection error:", error);
      setConnecting(null);
      setShowWCQR(false);
    }
  }, [startWalletConnect, closeModal]);

  const handleCancelWC = useCallback(() => {
    setShowWCQR(false);
    setConnecting(null);
  }, []);

  // Show QR code if WalletConnect is connecting
  if (showWCQR) {
    return (
      <Card className={styles.layout}>
        <QubicLogo />

        <div className={styles.body}>
          <Typography variant={"body"} size={"large"}>
            Scan QR Code
          </Typography>
          <Typography variant={"body"} size={"medium"} className={styles.gray}>
            Open your WalletConnect-compatible wallet and scan the QR code.
          </Typography>
        </div>

        {wcQrCode ? (
          <div className={styles.qrContainer}>
            <img src={wcQrCode} alt="WalletConnect QR Code" className={styles.qrCode} />
          </div>
        ) : (
          <div className={styles.loading}>
            <Typography variant={"body"} size={"medium"}>
              Generating QR Code...
            </Typography>
          </div>
        )}

        {wcUri && (
          <div className={styles.uriInfo}>
            <Typography variant={"body"} size={"small"} className={styles.gray}>
              Waiting for wallet connection...
            </Typography>
          </div>
        )}

        <Button caption={"Cancel"} color={"secondary"} className={styles.cancelButton} onClick={handleCancelWC} />
      </Card>
    );
  }

  // Default view with provider options
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
          onClick={handleClickMetaMask}
        />
        <Button
          caption={"WalletConnect"}
          variant={"solid"}
          color={"secondary"}
          isLoading={isConnecting === "walletconnect"}
          iconLeft={<SiWalletconnect />}
          onClick={handleClickWalletConnect}
        />
      </div>
    </Card>
  );
};

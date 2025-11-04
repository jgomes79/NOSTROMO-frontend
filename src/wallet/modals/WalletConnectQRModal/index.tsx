import { useEffect } from "react";

import { useModal } from "@/core/modals/hooks/useModal";
import { Button } from "@/shared/components/Button";
import { Typography } from "@/shared/components/Typography";
import { useQubicConnect } from "@/wallet/qubic/QubicConnectContext";

import { Card } from "../../../shared/components/Card";
import styles from "./WalletConnectQRModal.module.scss";

/**
 * WalletConnectQRModal component that displays the QR code for WalletConnect pairing.
 *
 * @returns {JSX.Element} The rendered WalletConnectQRModal component.
 */
export const WalletConnectQRModal = () => {
  const { wcQrCode, wcUri, wcIsConnecting } = useQubicConnect();
  const { closeModal } = useModal();

  // Close modal when connection is no longer in progress
  useEffect(() => {
    if (!wcIsConnecting && !wcUri) {
      closeModal();
    }
  }, [wcIsConnecting, wcUri, closeModal]);

  return (
    <Card className={styles.layout}>
      <div className={styles.body}>
        <Typography variant={"body"} size={"large"}>
          Scan QR Code with WalletConnect
        </Typography>
        <Typography variant={"body"} size={"medium"} className={styles.gray}>
          Open your WalletConnect-compatible wallet and scan the QR code below to connect.
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
        <div className={styles.uriContainer}>
          <Typography variant={"body"} size={"small"} className={styles.gray}>
            Or copy the connection URI:
          </Typography>
          <div className={styles.uriBox}>
            <Typography variant={"body"} size={"small"} className={styles.uri}>
              {wcUri.substring(0, 50)}...
            </Typography>
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <Button caption={"Cancel"} variant={"outline"} color={"secondary"} onClick={closeModal} />
      </div>
    </Card>
  );
};

import { useCallback, useEffect, useRef, useState } from "react";

import { SiWalletconnect } from "react-icons/si";

import { useModal } from "@/core/modals/hooks/useModal";
import { generateQRCode } from "@/lib/qubic";
import { Button } from "@/shared/components/Button";
import { Typography } from "@/shared/components/Typography";
import { useQubicConnect } from "@/wallet/qubic/QubicConnectContext";
import { connectSnap, getSnap } from "@/wallet/qubic/utils";

import { Selector } from "@/shared/components/Selector";
import { shortHex } from "@/wallet/wallet.helpers";
import { WalletConnectAccount, type Wallet } from "@/wallet/wallet.types";
import { LuWallet } from "react-icons/lu";
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
  const [selectedMode, setSelectedMode] = useState<"none" | "metamask" | "walletconnect">("none");
  const [qrCode, setQrCode] = useState<string>("");
  const walletConnectTimer = useRef<NodeJS.Timeout | null>(null);
  const { config, connect, getMetaMaskPublicId, walletConnectConnect, walletConnectRequestAccounts, disconnect } =
    useQubicConnect();

  const { closeModal } = useModal();
  const [accounts, setAccounts] = useState<WalletConnectAccount[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletConnectAccount | null>(null);

  // Poll for WalletConnect accounts after connection is established
  useEffect(() => {
    if (selectedMode !== "walletconnect") {
      return;
    }

    const checkConnection = async () => {
      try {
        const accounts = await walletConnectRequestAccounts();

        if (accounts?.length > 0) {
          setAccounts(accounts);
          setSelectedWallet(accounts[0]);
          if (walletConnectTimer.current) {
            clearInterval(walletConnectTimer.current);
            walletConnectTimer.current = null;
          }
        }
      } catch (error) {
        // Connection not ready yet, will retry on next interval
      }
    };

    walletConnectTimer.current = setInterval(checkConnection, 1000);

    return () => {
      if (walletConnectTimer.current) {
        clearInterval(walletConnectTimer.current);
        walletConnectTimer.current = null;
      }
    };
  }, [selectedMode, walletConnectRequestAccounts]);

  /**
   * Handles the click event for connecting to Metamask.
   */
  const handleClickConnect = useCallback(async () => {
    try {
      const snapId = config?.snapOrigin;
      await connectSnap(snapId);
      await getSnap();

      // get publicId from snap
      const publicKey = await getMetaMaskPublicId(0);
      const wallet: Wallet = {
        connectType: "mmSnap",
        publicKey,
      };
      connect(wallet);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Generate WalletConnect URI and QR code (following qearn pattern exactly)
  const generateURI = async () => {
    try {
      console.log("🔗 Starting WalletConnect URI generation...");

      const { uri, approve } = await walletConnectConnect();
      console.log("🔗 URI received:", uri);

      if (!uri) {
        throw new Error("No URI generated from WalletConnect");
      }

      console.log("🔗 Generating QR code for URI...");
      const qrCodeDataURL = await generateQRCode(uri);
      console.log("🔗 QR code generated:", qrCodeDataURL ? "success" : "failed");
      setQrCode(qrCodeDataURL);

      // Just wait for approval, don't try to get accounts immediately (like qearn)
      console.log("⏳ Waiting for wallet approval...");
      await approve();
      console.log("✅ WalletConnect approved! Connection established.");

      // Don't get accounts here - let the useEffect handle it
    } catch (error) {
      console.error("❌ WalletConnect connection failed:", error);
      setSelectedMode("none");
    }
  };

  /**
   * Handles the click event for connecting to WalletConnect.
   * @param publicKey - The public key of the wallet to connect to.
   */
  const handleConnectWalletConnect = () => {
    if (!selectedWallet) return;

    const wallet: Wallet = {
      connectType: "walletconnect",
      publicKey: selectedWallet.address,
    };
    connect(wallet);
    closeModal();
  };

  if (accounts.length > 0) {
    return (
      <Card className={styles.layout}>
        <QubicLogo />

        <div className={styles.body}>
          <Typography variant={"body"} size={"large"}>
            Select your account
          </Typography>
          <Typography variant={"body"} size={"medium"} className={styles.gray}>
            Select the account you want to connect to Nostromo Launchpad.
          </Typography>
        </div>

        <div className={styles.accounts}>
          <Selector
            label={"Account"}
            value={selectedWallet?.address || ""}
            options={accounts.map((account, index) => ({
              label: account.name || `Account ${index + 1}`,
              value: account.address,
            }))}
            onChange={(value) => {
              const address = value.target.value;
              const account = accounts.find((account) => account.address === address);

              if (account) {
                setSelectedWallet(account);
              }
            }}
          />
          {selectedWallet && (
            <div className={styles.accountDetails}>
              <LuWallet size={18} />
              <Typography variant={"body"} size={"medium"} className={styles.gray}>
                {shortHex(selectedWallet.address, 12)}
              </Typography>
            </div>
          )}
        </div>
        <div className={styles.actions}>
          <Button
            caption={"Cancel"}
            variant={"outline"}
            color={"secondary"}
            onClick={() => {
              setSelectedMode("none");
              setAccounts([]);
              setSelectedWallet(null);
              disconnect();
            }}
          />
          <Button caption={"Connect"} variant={"solid"} color={"primary"} onClick={handleConnectWalletConnect} />
        </div>
      </Card>
    );
  }

  return (
    <Card className={styles.layout}>
      <QubicLogo />

      {selectedMode === "none" && (
        <>
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
              iconLeft={<MetamaskLogo />}
              onClick={() => setSelectedMode("metamask")}
            />
            <Button
              caption={"WalletConnect"}
              variant={"solid"}
              color={"secondary"}
              iconLeft={<SiWalletconnect />}
              onClick={() => {
                setSelectedMode("walletconnect");
                generateURI();
              }}
            />
          </div>
        </>
      )}

      {selectedMode === "metamask" && (
        <div className={styles.metamaskMode}>
          <div className={styles.body}>
            <Typography variant={"body"} size={"large"}>
              Connect with MetaMask
            </Typography>
            <Typography variant={"body"} size={"medium"} className={styles.gray}>
              Connect your MetaMask wallet. You need to have MetaMask installed and unlocked.
            </Typography>
          </div>
          <div className={styles.actions}>
            <Button
              caption={"Cancel"}
              variant={"outline"}
              color={"secondary"}
              onClick={() => setSelectedMode("none")}
            />
            <Button
              caption={"Connect MetaMask"}
              variant={"solid"}
              color={"warning"}
              iconLeft={<MetamaskLogo />}
              onClick={handleClickConnect}
            />
          </div>
        </div>
      )}

      {selectedMode === "walletconnect" && (
        <div className={styles.walletConnectMode}>
          <div className={styles.body}>
            <Typography variant={"body"} size={"large"}>
              Connect with WalletConnect
            </Typography>
            <Typography variant={"body"} size={"medium"} className={styles.gray}>
              Scan the QR code with your Qubic wallet app.
            </Typography>
          </div>

          <div className={styles.qrSection}>
            {qrCode ? (
              <img src={qrCode} alt="WalletConnect QR Code" className={styles.qrCode} />
            ) : (
              <div className={styles.qrLoading}>
                <Typography variant={"body"}>Generating QR code...</Typography>
              </div>
            )}
          </div>

          <Button
            caption={"Cancel"}
            color={"secondary"}
            className={styles.cancelButton}
            onClick={() => setSelectedMode("none")}
          />
        </div>
      )}
    </Card>
  );
};

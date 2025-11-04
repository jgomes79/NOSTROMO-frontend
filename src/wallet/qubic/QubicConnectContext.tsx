/* eslint-disable */
// @ts-nocheck
import { createContext, useContext, useEffect, useState } from "react";

import { publicKeyStringToBytes } from "@qubic-lib/qubic-ts-library/dist/converter/converter.js";
import Crypto, { SIGNATURE_LENGTH } from "@qubic-lib/qubic-ts-library/dist/crypto";
import { QubicHelper } from "@qubic-lib/qubic-ts-library/dist/qubicHelper";
import SignClient from "@walletconnect/sign-client";
import QRCode from "qrcode";

import { connectTypes, getSnapOrigin, tickOffset } from "./config";
import { base64ToUint8Array, decodeUint8ArrayTx } from "./contract/contractUtils";
import { QHelper } from "./contract/nostromoApi";
import { MetaMaskProvider } from "./MetamaskContext";
import { QubicConnectProviderProps, TickInfoType, Transaction } from "./types";
import { getSnap } from "./utils";

// Constants from QubicHelper
const PUBLIC_KEY_LENGTH = 32;
const TRANSACTION_SIZE = 1024;
const DIGEST_LENGTH = 32;

// WalletConnect Constants
const WC_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID || "b2ace378845f0e4806ef23d2732f77a4";
const WC_RELAY_URL = import.meta.env.VITE_WC_RELAY_URL || "wss://relay.walletconnect.com";
// Using CAIP-2 format: namespace:reference
// For Qubic, we use a custom namespace. The chainId format must match what the wallet expects.
const WC_CHAIN_ID = "qubic:0";

interface Wallet {
  connectType: string;
  publicKey: string;
  privateKey?: string;
  wcSession?: any;
}

interface Balance {
  id: string;
  balance: number;
}
interface QubicConnectContextValue {
  connected: boolean;
  wallet: Wallet | null;
  showConnectModal: boolean;
  config: QubicConnectProviderProps["config"];
  connect: (wallet: Wallet) => void;
  disconnect: () => void;
  toggleConnectModal: () => void;
  getMetaMaskPublicId: (accountIdx?: number, confirm?: boolean) => Promise<string>;
  getSignedTx: (tx: Uint8Array, offset: number) => Promise<{ tx: Uint8Array; offset: number }>;
  broadcastTx: (tx: Uint8Array) => Promise<{ status: number; result: unknown }>;
  getTick: () => Promise<TickInfoType>;
  getBalance: (publicId: string) => Promise<{ balance: Balance }>;
  getTransactionsHistory: (publicId: string, startTick?: number, endTick?: number) => Promise<unknown>;
  tickOffset: number;
  getPaymentTx: (
    sender: string,
    receiver: string,
    amount: number,
    tick: number,
  ) => Promise<{
    tx: Uint8Array;
    offset: number;
  }>;
  qHelper: QHelper;
  httpEndpoint: string;
  signTransaction: (tx: Uint8Array) => Promise<Uint8Array>;
  // WalletConnect specific
  wcClient: any;
  wcSession: any;
  wcUri: string;
  wcQrCode: string;
  wcIsConnecting: boolean;
  startWalletConnect: () => Promise<{ approve: () => Promise<void> }>;
}

// Helper function to sign transactions locally
async function localSignTx(qHelper: QHelper, privateKey: string, tx: Uint8Array) {
  const qCrypto = await Crypto;
  const idPackage = await qHelper.createIdPackage(privateKey);

  const digest = new Uint8Array(DIGEST_LENGTH);
  const toSign = tx.slice(0, tx.length - SIGNATURE_LENGTH);

  qCrypto.K12(toSign, digest, DIGEST_LENGTH);

  const signature = qCrypto.schnorrq.sign(idPackage.privateKey, idPackage.publicKey, digest);

  tx.set(signature, tx.length - SIGNATURE_LENGTH);
  return tx;
}

const QubicConnectContext = createContext<QubicConnectContextValue | undefined>(undefined);

export function QubicConnectProvider({ children, config }: QubicConnectProviderProps) {
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const httpEndpoint = import.meta.env.VITE_HTTP_ENDPOINT; // live system
  const [qHelper] = useState(() => new QubicHelper());

  // WalletConnect states
  const [wcClient, setWcClient] = useState<any>(null);
  const [wcSession, setWcSession] = useState<any>(null);
  const [wcUri, setWcUri] = useState('');
  const [wcQrCode, setWcQrCode] = useState('');
  const [wcIsConnecting, setWcIsConnecting] = useState(false);

  useEffect(() => {
    // Initialize WalletConnect client
    const initializeWcClient = async () => {
      try {
        const client = await SignClient.init({
          projectId: WC_PROJECT_ID,
          relayUrl: WC_RELAY_URL,
          metadata: {
            name: 'Nostromo Launchpad',
            description: 'Interact with Qubic Smart Contracts',
            url: window.location.origin,
            icons: [window.location.origin + '/logo.png'],
          },
        });
        setWcClient(client);

        // Check for existing sessions
        if (client.session.length) {
          const lastKeyIndex = client.session.keys.length - 1;
          const session = client.session.get(client.session.keys[lastKeyIndex]);
          setWcSession(session);

          // Extract public key from the session
          let publicKey = '';
          if (session.namespaces.qubic && session.namespaces.qubic.accounts.length > 0) {
            const account = session.namespaces.qubic.accounts[0];
            const parts = account.split(':');
            publicKey = parts[parts.length - 1];
          }

          if (publicKey) {
            connect(
              {
                connectType: "walletconnect",
                publicKey,
                wcSession: session,
              },
              true,
            );
          }
        }

        // Set up event listeners
        client.on('session_event', (event) => {
          console.log('WC Event:', event);
        });

        client.on('session_update', ({ topic, params }) => {
          const { namespaces } = params;
          const _session = client.session.get(topic);
          const updatedSession = { ..._session, namespaces };
          setWcSession(updatedSession);

          // Extract public key from the updated session
          let publicKey = '';
          if (updatedSession.namespaces.qubic && updatedSession.namespaces.qubic.accounts.length > 0) {
            const account = updatedSession.namespaces.qubic.accounts[0];
            const parts = account.split(':');
            publicKey = parts[parts.length - 1];
          }

          if (publicKey && wallet?.connectType === 'walletconnect' && wallet.publicKey !== publicKey) {
            connect({ connectType: "walletconnect", publicKey, wcSession: updatedSession });
          }
        });

        client.on('session_delete', () => {
          setWcSession(null);
          if (wallet?.connectType === 'walletconnect') {
            disconnect();
          }
        });
      } catch (e) {
        console.error("Failed to initialize WalletConnect client:", e);
      }
    };

    initializeWcClient();

    // Restore wallet from localStorage
    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet) {
      try {
        const parsedWallet = JSON.parse(storedWallet);
        if (parsedWallet.connectType !== 'walletconnect') {
          setWallet(parsedWallet);
          setConnected(true);
        }
      } catch (error) {
        console.error("Error parsing stored wallet:", error);
        localStorage.removeItem("wallet");
      }
    }
  }, []);

  const connect = (walletInfo: Wallet, isRestoring = false) => {
    if (!isRestoring) {
      localStorage.setItem("wallet", JSON.stringify(walletInfo));
      if (walletInfo.connectType === 'walletconnect' && walletInfo.wcSession) {
        localStorage.setItem("sessionTopic", walletInfo.wcSession.topic);
      }
    }
    setWallet(walletInfo);
    setConnected(true);
    setShowConnectModal(false);
    if (walletInfo.connectType === 'walletconnect' && walletInfo.wcSession) {
      setWcSession(walletInfo.wcSession);
    }
    setWcUri('');
    setWcQrCode('');
  };

  const disconnect = () => {
    const connectType = wallet?.connectType;
    localStorage.removeItem("wallet");
    localStorage.removeItem("sessionTopic");
    setWallet(null);
    setConnected(false);
    setWcUri('');
    setWcQrCode('');
    setWcIsConnecting(false);

    if (connectType === 'walletconnect' && wcSession && wcClient) {
      console.log("Disconnecting WC session topic:", wcSession.topic);
      wcClient
        .disconnect({ topic: wcSession.topic, reason: { code: 6000, message: "User disconnected" } })
        .catch((e: any) => console.error("Error during WC disconnect request:", e));
    }
    setWcSession(null);
  };

  const toggleConnectModal = () => {
    setShowConnectModal(!showConnectModal);
  };

  const startWalletConnect = async () => {
    if (!wcClient) throw new Error("WalletConnect client not initialized");
    setWcIsConnecting(true);
    setWcUri('');
    setWcQrCode('');
    console.log("Attempting wcClient.connect...");

    try {
      const { uri, approval } = await wcClient.connect({
        requiredNamespaces: {
          qubic: {
            chains: [WC_CHAIN_ID],
            methods: ['qubic_signTransaction'],
            events: ['accountsChanged'],
          },
        },
      });

      console.log("WC Connect URI generated:", uri);
      if (uri) {
        setWcUri(uri);
        try {
          const qrData = await QRCode.toDataURL(uri);
          setWcQrCode(qrData);
          console.log("WC QR Code generated.");
        } catch (qrErr) {
          console.error("Failed to generate WC QR code:", qrErr);
        }
      } else {
        console.warn("WalletConnect did not provide a URI.");
      }

      return {
        approve: async () => {
          console.log("Waiting for WC session approval...");
          try {
            const session = await approval();
            console.log("WC Session approved:", session);
            console.log("Session namespaces:", JSON.stringify(session.namespaces, null, 2));

            // Extract public key from the session
            let publicKey = '';
            if (session.namespaces.qubic && session.namespaces.qubic.accounts.length > 0) {
              const account = session.namespaces.qubic.accounts[0];
              console.log("Account string:", account);
              // Format: qubic:0:ADDRESS or qubic:ADDRESS
              const parts = account.split(':');
              publicKey = parts[parts.length - 1]; // Get the last part (the address)
              console.log("Extracted publicKey:", publicKey);
            } else {
              throw new Error("No qubic accounts found in WalletConnect session");
            }

            connect({
              connectType: "walletconnect",
              publicKey,
              wcSession: session,
            });
            setWcIsConnecting(false);
          } catch (e) {
            console.error("WC Connection approval rejected or failed:", e);
            setWcUri('');
            setWcQrCode('');
            setWcIsConnecting(false);
            throw e;
          }
        },
      };
    } catch (e) {
      console.error("WalletConnect connection failed:", e);
      setWcIsConnecting(false);
      setWcUri('');
      setWcQrCode('');
      throw e;
    }
  };

  function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    const binaryString = String.fromCharCode.apply(null, Array.from(uint8Array));
    return btoa(binaryString);
  }

  const getMetaMaskPublicId = async (accountIdx = 0, confirm = false): Promise<string> => {
    if (!window.ethereum) {
      throw new Error("MetaMask not available");
    }
    return (await window.ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: getSnapOrigin(config?.snapOrigin),
        request: {
          method: "getPublicId",
          params: {
            accountIdx,
            confirm,
          },
        },
      },
    })) as string;
  };

  const getMetaMaskSignedTx = async (tx: Uint8Array, offset: number) => {
    // Convert the binary buffer to a base64 string
    const base64Tx = btoa(String.fromCharCode(...tx));

    if (!window.ethereum) {
      throw new Error("MetaMask not available");
    }

    return (await window.ethereum.request({
      method: "wallet_invokeSnap",
      params: {
        snapId: getSnapOrigin(config?.snapOrigin),
        request: {
          method: "signTransaction",
          params: {
            base64Tx,
            accountIdx: 0,
            offset,
          },
        },
      },
    })) as { signedTx: string };
  };

  const getTick = async () => {
    // console.log('getTickInfo')
    const tickResult = await fetch(`${httpEndpoint}/v1/tick-info`);
    const tick = await tickResult.json();
    // check if tick is valid
    if (!tick || !tick.tickInfo) {
      // console.warn('getTickInfo: Invalid tick')
      return 0;
    }
    return tick.tickInfo.tick;
  };

  const getBalance = async (publicId: string) => {
    // console.log('getBalance: for publicId ', publicId)
    const accountResult = await fetch(`${httpEndpoint}/v1/balances/${publicId}`);
    const results = await accountResult.json();
    // check if info is valid
    if (!results || !results.balance) {
      // console.warn('getBalance: Invalid balance')
      return { balance: { id: publicId, balance: 0 } };
    }
    return results;
  };

  const getTransactionsHistory = async (publicId: string, startTick: number = 1, endTick?: number) => {
    // check if endTick is set if not set to current tick
    if (endTick === undefined) {
      const tickInfo = await getTick();
      endTick = tickInfo.tick;
    }
    const url = `${httpEndpoint}/v1/identities/${publicId}/transfer-transactions?startTick=${startTick}&endTick=${endTick}`;
    const historyTxsResult = await fetch(url);
    const results = await historyTxsResult.json();
    // check if info is valid
    if (!results || !results.transferTransactionsPerTick) {
      console.warn("getTransactionsHistory: Invalid transaction history");
      return { transactions: [] };
    }
    // extract all transactions from the result
    const transactions: Transaction[] = [];
    for (const txs of results.transferTransactionsPerTick) {
      transactions.push(...txs.transactions);
    }
    return transactions;
  };

  const getPaymentTx = async (sender: string, receiver: string, amount: number, tick: number) => {
    const destPublicKey = publicKeyStringToBytes(receiver).slice(0, PUBLIC_KEY_LENGTH);
    const senderPublicId = publicKeyStringToBytes(sender).slice(0, PUBLIC_KEY_LENGTH);
    const tx = new Uint8Array(TRANSACTION_SIZE).fill(0);
    const txView = new DataView(tx.buffer);
    let offset = 0;
    let i = 0;
    for (i = 0; i < PUBLIC_KEY_LENGTH; i++) {
      tx[i] = senderPublicId[i];
    }
    offset = i;
    for (i = 0; i < PUBLIC_KEY_LENGTH; i++) {
      tx[offset + i] = destPublicKey[i];
    }
    offset += i;
    txView.setBigInt64(offset, BigInt(amount), true);
    offset += 8;
    txView.setUint32(offset, tick, true);
    offset += 4;
    txView.setUint16(offset, 0, true);
    offset += 2;
    txView.setUint16(offset, 0, true);
    offset += 2;

    return {
      tx,
      offset,
    };
  };

  const getSignedTx = async (tx: Uint8Array, offset: number) => {
    if (!wallet) {
      throw new Error("No wallet connected");
    }

    // check connectType
    if (!connectTypes.includes(wallet.connectType)) {
      throw new Error("Unsupported connectType: " + wallet.connectType);
    }

    let signedtx: Uint8Array | null = null;

    if (wallet.connectType === "mmSnap") {
      const mmResult = await getMetaMaskSignedTx(tx, offset);
      // Convert the base64 string to a binary buffer
      const binaryTx = atob(mmResult.signedTx);
      signedtx = new Uint8Array(binaryTx.length);
      for (let i = 0; i < binaryTx.length; i++) {
        signedtx[i] = binaryTx.charCodeAt(i);
      }
    } else {
      if (!wallet.privateKey) {
        throw new Error("Private key required for non-MetaMask signing");
      }
      const qCrypto = await Crypto;
      const idPackage = await qHelper.createIdPackage(wallet.privateKey);
      const digest = new Uint8Array(DIGEST_LENGTH);
      const toSign = tx.slice(0, offset);

      qCrypto.K12(toSign, digest, DIGEST_LENGTH);
      signedtx = qCrypto.schnorrq.sign(idPackage.privateKey, idPackage.publicKey, digest);
    }

    if (!signedtx) {
      throw new Error("Failed to sign transaction");
    }

    // Copy the signed transaction to the transaction buffer
    tx.set(signedtx, offset);
    offset += SIGNATURE_LENGTH;

    return {
      tx,
      offset,
    };
  };

  const broadcastTx = async (tx: Uint8Array) => {
    const url = `${httpEndpoint}/v1/broadcast-transaction`;
    const txEncoded = uint8ArrayToBase64(tx);
    const body = { encodedTransaction: txEncoded };
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
      });
      // Parse the JSON response
      const result = await response.json();
      // Check if the response status is OK (status code 200-299)
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        console.log("broadcastTx:", response);
      }
      return {
        status: response.status,
        result,
      };
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const invokeSnap = async (method, params) => {
    const snap = await getSnap();

    if (!snap || !window.ethereum) {
      throw new Error("Qubic Snap is not installed or connected.");
    }
    try {
      return await window.ethereum.request({
        method: "wallet_invokeSnap",
        params: {
          snapId: snap.id,
          request: { method, params },
        },
      });
    } catch (e) {
      console.error(`Snap invocation failed for method ${method}:`, e);
      throw e;
    }
  };

  const signTransaction = async (tx: Uint8Array) => {
    if (!wallet || !wallet.connectType) {
      throw new Error("Wallet not connected.");
    }

    if (!(tx instanceof Uint8Array)) {
      console.error("signTransaction received invalid tx format:", tx);
      throw new Error("Invalid transaction format provided for signing.");
    }

    const processedTx = tx;

    switch (wallet.connectType) {
      case "privateKey":
      case "vaultFile":
        if (!wallet.privateKey) throw new Error("Private key not available for signing.");
        return await localSignTx(qHelper, wallet.privateKey, processedTx);

      case "mmSnap": {
        const snapId = await getSnap();
        if (!snapId) throw new Error("MetaMask Snap not connected.");

        try {
          const base64Tx = uint8ArrayToBase64(processedTx);
          const offset = processedTx.length - SIGNATURE_LENGTH;

          console.log(
            `Requesting Snap signature for tx (Base64, offset ${offset}):`,
            base64Tx.substring(0, 100) + "...",
          );

          const signedResult = await invokeSnap("signTransaction", {
            base64Tx,
            accountIdx: 0,
            offset,
          });

          console.log("Received result from Snap:", signedResult);

          if (!signedResult || typeof signedResult.signedTx !== "string") {
            throw new Error("Snap did not return a valid signedTx string.");
          }
          const signatureBinary = atob(signedResult.signedTx);
          const signatureBytes = new Uint8Array(signatureBinary.length);
          for (let i = 0; i < signatureBinary.length; i++) {
            signatureBytes[i] = signatureBinary.charCodeAt(i);
          }

          if (signatureBytes.length !== SIGNATURE_LENGTH) {
            throw new Error(`Snap returned signature of incorrect length: ${signatureBytes.length}`);
          }

          processedTx.set(signatureBytes, offset);
          return processedTx;
        } catch (error: unknown) {
          console.error("MetaMask Snap signing failed:", error);

          // Type guard to check if error is an object with expected properties
          const errorObj = error as { data?: { message?: string }; message?: string; code?: number };

          const snapErrorMessage =
            errorObj?.data?.message || errorObj?.message || (error instanceof Error ? error.message : String(error));

          const specificError =
            typeof errorObj?.code === "number"
              ? `{code: ${errorObj.code}, message: ${JSON.stringify(snapErrorMessage)}}`
              : snapErrorMessage;

          throw new Error(`MetaMask Snap signing failed: ${specificError}`);
        }
      }

      case "walletconnect":
        if (!wcSession || !wcClient) throw new Error("WalletConnect session not active.");
        try {
          console.log("Decoding TX for WalletConnect structured signing...");
          const decodedTx = decodeUint8ArrayTx(processedTx);

          const fromAddress = wallet.publicKey;
          const toAddress = qHelper
            ? await qHelper.getIdentity(decodedTx.destinationPublicKey.getIdentity())
            : "ID_CONVERSION_FAILED";
          const amount = decodedTx.amount.getNumber();
          const tick = decodedTx.tick;
          const inputType = decodedTx.inputType;
          const payloadBytes = decodedTx.payload ? decodedTx.payload.getPackageData() : null;
          const payloadBase64 = payloadBytes ? uint8ArrayToBase64(payloadBytes) : null;

          const signingParams = {
            from: fromAddress,
            to: toAddress,
            amount: Number(amount),
            tick: tick,
            inputType: inputType,
            payload: payloadBase64 === "" ? null : payloadBase64,
            nonce: Date.now().toString(),
          };

          console.log("Requesting WC signature with params object:", signingParams);

          const wcResult = await wcClient.request({
            topic: wcSession.topic,
            chainId: WC_CHAIN_ID,
            request: {
              method: 'qubic_signTransaction',
              params: signingParams,
            },
          });

          console.log("Received result from WC signing:", wcResult);

          if (typeof wcResult !== 'string' && typeof wcResult?.signedTransaction !== 'string') {
            console.error("Unexpected response format from WC signing:", wcResult);
            throw new Error("WalletConnect did not return a valid signedTransaction string.");
          }
          const signedTxBase64 = typeof wcResult === 'string' ? wcResult : wcResult.signedTransaction;
          const signedTxBytes = base64ToUint8Array(signedTxBase64);

          console.log(`Signed Tx Bytes Length: ${signedTxBytes.length} (Original: ${processedTx.length})`);
          if (signedTxBytes.length === SIGNATURE_LENGTH) {
            console.warn("WalletConnect returned only signature, inserting...");
            processedTx.set(signedTxBytes, processedTx.length - SIGNATURE_LENGTH);
            return processedTx;
          } else if (signedTxBytes.length !== processedTx.length) {
            console.warn(
              `WC signed transaction length mismatch. Expected: ${processedTx.length}, Received: ${signedTxBytes.length}. Returning received bytes.`,
            );
            return signedTxBytes;
          } else {
            return signedTxBytes;
          }
        } catch (error: unknown) {
          console.error("WalletConnect signing failed:", error);
          const errorObj = error as { message?: string; code?: number };
          const wcErrorMessage = errorObj?.message || String(error);
          const specificError = errorObj?.code
            ? `{code: ${errorObj.code}, message: '${wcErrorMessage}'}`
            : wcErrorMessage;
          throw new Error(`WalletConnect signing failed: ${specificError}`);
        }

      default:
        throw new Error(`Unsupported wallet type for signing: ${wallet.connectType}`);
    }
  };

  const contextValue: QubicConnectContextValue = {
    connected,
    wallet,
    showConnectModal,
    connect,
    config,
    disconnect,
    toggleConnectModal,
    getMetaMaskPublicId,
    getSignedTx,
    broadcastTx,
    getTick,
    getBalance,
    getTransactionsHistory,
    tickOffset,
    getPaymentTx,
    qHelper,
    httpEndpoint,
    signTransaction,
    // WalletConnect
    wcClient,
    wcSession,
    wcUri,
    wcQrCode,
    wcIsConnecting,
    startWalletConnect,
  };

  return (
    <MetaMaskProvider>
      <QubicConnectContext.Provider value={contextValue}>{children}</QubicConnectContext.Provider>
    </MetaMaskProvider>
  );
}

export function useQubicConnect(): QubicConnectContext {
  const context = useContext(QubicConnectContext);
  if (context === undefined) {
    throw new Error("useQubicConnect() hook must be used within a <QubicConnectProvider>");
  }
  return context;
}

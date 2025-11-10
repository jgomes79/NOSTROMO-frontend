/* eslint-disable */
// @ts-nocheck
import { createContext, useContext, useEffect, useState } from "react";

import { publicKeyStringToBytes } from "@qubic-lib/qubic-ts-library/dist/converter/converter.js";
import Crypto from "@qubic-lib/qubic-ts-library/dist/crypto";
import { QubicHelper } from "@qubic-lib/qubic-ts-library/dist/qubicHelper";
import { decodeUint8ArrayTx } from "./contract/contractUtils";
import { uint8ArrayToBase64, base64ToUint8Array } from "../../lib/nostromo/utils/index";

import type {
  Balance,
  BroadcastResult,
  QubicConnectContextValue,
  QubicConnectProviderProps,
  QubicTransaction,
  SignClient,
  Transaction,
  Wallet,
  WalletConnectAccount,
  WalletConnectSession,
  isErrorWithData,
  isErrorWithMessage
} from "../wallet.types";
import { connectTypes, getSnapOrigin, tickOffset } from "./config";
import { MetaMaskProvider } from "./MetamaskContext";
import { useWalletConnect } from "./WalletConnectContext";

// Constants from QubicHelper
const PUBLIC_KEY_LENGTH = 32;
const TRANSACTION_SIZE = 1024;
const DIGEST_LENGTH = 32;
const SIGNATURE_LENGTH = 64;

const QubicConnectContext = createContext<QubicConnectContextValue | undefined>(undefined);

export function QubicConnectProvider({ children, config }: QubicConnectProviderProps) {
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [wcClient, setWcClient] = useState<SignClient | null>(null);
  const [wcSession, setWcSession] = useState<WalletConnectSession | null>(null);

  const httpEndpoint = import.meta.env.VITE_HTTP_ENDPOINT; // live system
  const [qHelper] = useState(() => new QubicHelper());

  // Add WalletConnect integration
  const walletConnect = useWalletConnect();

  useEffect(() => {
    // Use the SignClient from WalletConnectContext instead of creating a new one
    if (walletConnect.signClient) {
      setWcClient(walletConnect.signClient);

      // Check for existing sessions
      if (walletConnect.signClient.session.length) {
        const lastKeyIndex = walletConnect.signClient.session.keys.length - 1;
        const session = walletConnect.signClient.session.get(walletConnect.signClient.session.keys[lastKeyIndex]);
        setWcSession(session);
        connect({
          connectType: "walletconnect",
          publicKey: session.namespaces.qubic.accounts[0].split(':')[2],
          wcSession: session,
        }, true);
      }

      // Setup event listeners
      const handleSessionEvent = (event) => {
        console.log('WC Event:', event);
      };

      const handleSessionUpdate = ({ topic, params }) => {
        const { namespaces } = params;
        const _session = walletConnect.signClient.session.get(topic);
        const updatedSession = { ..._session, namespaces };
        setWcSession(updatedSession);
        const publicKey = updatedSession.namespaces.qubic.accounts[0].split(':')[2];
        if (wallet?.connectType === 'walletconnect' && wallet.publicKey !== publicKey) {
          connect({ connectType: "walletconnect", publicKey, wcSession: updatedSession });
        }
      };

      const handleSessionDelete = () => {
        setWcSession(null);
        if (wallet?.connectType === 'walletconnect') {
          disconnect();
        }
      };

      walletConnect.signClient.on('session_event', handleSessionEvent);
      walletConnect.signClient.on('session_update', handleSessionUpdate);
      walletConnect.signClient.on('session_delete', handleSessionDelete);

      // Cleanup function
      return () => {
        if (walletConnect.signClient) {
          walletConnect.signClient.off('session_event', handleSessionEvent);
          walletConnect.signClient.off('session_update', handleSessionUpdate);
          walletConnect.signClient.off('session_delete', handleSessionDelete);
        }
      };
    }

    const storedWallet = localStorage.getItem("wallet");
    if (storedWallet) {
      try {
        const parsedWallet = JSON.parse(storedWallet);
        setWallet(parsedWallet);
        setConnected(true);
      } catch (error) {
        console.error("Error parsing stored wallet:", error);
        localStorage.removeItem("wallet");
      }
    }
  }, [walletConnect.signClient, wallet?.connectType]);

  const connect = (wallet: Wallet) => {
    localStorage.setItem("wallet", JSON.stringify(wallet));
    setWallet(wallet);
    setConnected(true);
  };

  const disconnect = async () => {
    if (wallet?.connectType === "walletconnect" && walletConnect.signClient) {
      await walletConnect.disconnect();
    }

    localStorage.removeItem("wallet");
    setWallet(null);
    setConnected(false);

  };

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

  const getTick = async (): Promise<number> => {
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

  const getBalance = async (publicId: string): Promise<Balance> => {
    // console.log('getBalance: for publicId ', publicId)
    const accountResult = await fetch(`${httpEndpoint}/v1/balances/${publicId}`);
    const results = await accountResult.json();
    // check if info is valid
    if (!results || !results.balance) {
      // console.warn('getBalance: Invalid balance')
      return { id: publicId, balance: 0 };
    }
    return results.balance;
  };

  const getTransactionsHistory = async (publicId: string, startTick: number = 1, endTick?: number): Promise<Transaction[]> => {
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

  const getSignedTx = async (tx: Uint8Array | QubicTransaction, offset: number = 0): Promise<Uint8Array> => {
    if (!wallet) {
      throw new Error("No wallet connected");
    }

    // check connectType
    if (!connectTypes.includes(wallet.connectType)) {
      throw new Error("Unsupported connectType: " + wallet.connectType);
    }

    let signedtx: Uint8Array | null = null;

    // For WalletConnect, handle QubicTransaction objects like qearn
    if (wallet.connectType === "walletconnect") {
      console.log("🔗 WalletConnect signing - transaction type:", typeof tx);
      console.log("🔗 Is QubicTransaction?", tx?.constructor?.name);

      // If it's a QubicTransaction, build it first
      const processedTx = tx?.build ? await tx.build("0".repeat(55)) : tx;
      console.log("🔗 Processed transaction size:", processedTx.length);

      try {
        // Decode transaction to get parameters (exactly like qearn)
        const decodedTx = decodeUint8ArrayTx(processedTx);
        console.log("🔗 Decoded transaction:", decodedTx);

        const [from, to] = await Promise.all([
          qHelper.getIdentity(decodedTx.sourcePublicKey.getIdentity()),
          qHelper.getIdentity(decodedTx.destinationPublicKey.getIdentity()),
        ]);

        console.log("🔗 Transaction addresses:");
        console.log("🔗 From (source):", from);
        console.log("🔗 To (destination):", to);
        console.log("🔗 Connected wallet publicKey:", wallet.publicKey);
        console.log("🔗 Addresses match?", from === wallet.publicKey);

        // Ensure we're using the connected wallet's address
        const fromAddress = wallet.publicKey; // Use the connected wallet address directly

        const payloadBase64 = decodedTx.payload ? uint8ArrayToBase64(decodedTx.payload.getPackageData()) : "";
        console.log("🔗 WalletConnect signing params:", { from: fromAddress, to, amount: Number(decodedTx.amount.getNumber()), tick: decodedTx.tick, inputType: decodedTx.inputType });

        // Show toast like qearn
        console.log("🔑 Requesting signature from WalletConnect app...");

        const wcResult = await walletConnect.signTransaction({
          from: fromAddress, // Use the connected wallet address
          to,
          amount: Number(decodedTx.amount.getNumber()),
          tick: decodedTx.tick,
          inputType: decodedTx.inputType,
          payload: payloadBase64 === "" ? null : payloadBase64,
        });

        console.log("✅ WalletConnect signature received:", wcResult);
        signedtx = base64ToUint8Array(wcResult.signedTransaction);

        return {
          tx: signedtx,
          offset: signedtx.length,
        };
      } catch (error) {
        console.error("❌ WalletConnect signing failed:", error);
        throw new Error(`WalletConnect signing failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    if (wallet.connectType === "mmSnap") {
      const mmResult = await getMetaMaskSignedTx(tx, offset);
      // Convert the base64 string to a binary buffer
      const binaryTx = atob(mmResult.signedTx);
      signedtx = new Uint8Array(binaryTx.length);
      for (let i = 0; i < binaryTx.length; i++) {
        signedtx[i] = binaryTx.charCodeAt(i);
      }
    } else if (wallet.connectType === "walletconnect") {
      // WalletConnect signing - similar to qearn implementation
      try {
        // For WalletConnect, we need to decode the transaction to get parameters
        const decodedTx = decodeUint8ArrayTx ? decodeUint8ArrayTx(tx) : null;
        if (!decodedTx) {
          throw new Error("Failed to decode transaction for WalletConnect");
        }

        const from = await qHelper.getIdentity(decodedTx.sourcePublicKey.getIdentity());
        const to = await qHelper.getIdentity(decodedTx.destinationPublicKey.getIdentity());
        const payloadBase64 = decodedTx.payload ? uint8ArrayToBase64(decodedTx.payload.getPackageData()) : null;

        const wcResult = await walletConnect.signTransaction({
          from,
          to,
          amount: Number(decodedTx.amount.getNumber()),
          tick: decodedTx.tick,
          inputType: decodedTx.inputType,
          payload: payloadBase64,
        });

        // Convert the signed transaction back to Uint8Array
        signedtx = base64ToUint8Array ? base64ToUint8Array(wcResult.signedTransaction) : new Uint8Array();
      } catch (error) {
        console.error("WalletConnect signing failed:", error);
        throw new Error(`WalletConnect signing failed: ${error instanceof Error ? error.message : String(error)}`);
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

  const broadcastTx = async (tx: Uint8Array): Promise<BroadcastResult> => {
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
        success: response.ok,
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

  const signTransaction = async (tx: Uint8Array): Promise<Uint8Array> => {
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
        } catch (error) {
          console.error("MetaMask Snap signing failed:", error);

          let snapErrorMessage = "Unknown error";

          if (isErrorWithData(error)) {
            snapErrorMessage = error.data.message;
          } else if (isErrorWithMessage(error)) {
            snapErrorMessage = error.message;
          } else if (error instanceof Error) {
            snapErrorMessage = error.message;
          } else {
            snapErrorMessage = String(error);
          }

          const specificError = isErrorWithMessage(error) && 'code' in error && typeof error.code === 'number'
            ? `{code: ${error.code}, message: ${JSON.stringify(snapErrorMessage)}}`
            : snapErrorMessage;

          throw new Error(`MetaMask Snap signing failed: ${specificError}`);
        }
      }
      default:
        throw new Error(`Unsupported wallet type for signing: ${wallet.connectType}`);
    }
  };

  const contextValue: QubicConnectContextValue = {
    connected,
    wallet,
    connect,
    config,
    disconnect,
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
    // WalletConnect methods
    walletConnectConnect: walletConnect.connect,
    walletConnectDisconnect: walletConnect.disconnect,
    walletConnectRequestAccounts: walletConnect.requestAccounts as () => Promise<WalletConnectAccount[]>,
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

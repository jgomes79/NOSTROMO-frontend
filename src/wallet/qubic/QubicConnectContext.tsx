import { createContext, useContext, useEffect, useState } from "react";

import { publicKeyStringToBytes } from "@qubic-lib/qubic-ts-library/dist/converter/converter.js";
import Crypto from "@qubic-lib/qubic-ts-library/dist/crypto";
import { QubicHelper } from "@qubic-lib/qubic-ts-library/dist/qubicHelper";

import { connectTypes, getSnapOrigin, tickOffset } from "./config";
import { MetaMaskProvider } from "./MetamaskContext";
import { QubicConnectProviderProps, TickInfoType, Transaction } from "./types";

// Constants from QubicHelper
const PUBLIC_KEY_LENGTH = 32;
const TRANSACTION_SIZE = 1024;
const DIGEST_LENGTH = 32;
const SIGNATURE_LENGTH = 64;

interface Wallet {
  connectType: string;
  publicKey: string;
  privateKey?: string;
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
  getTickInfo: () => Promise<TickInfoType>;
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
}

const QubicConnectContext = createContext<QubicConnectContextValue | undefined>(undefined);

export function QubicConnectProvider({ children, config }: QubicConnectProviderProps) {
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const httpEndpoint = "https://rpc.qubic.org"; // live system
  const qHelper = new QubicHelper();

  useEffect(() => {
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
  }, []);

  const connect = (wallet: Wallet) => {
    localStorage.setItem("wallet", JSON.stringify(wallet));
    setWallet(wallet);
    setConnected(true);
  };

  const disconnect = () => {
    localStorage.removeItem("wallet");
    setWallet(null);
    setConnected(false);
  };

  const toggleConnectModal = () => {
    setShowConnectModal(!showConnectModal);
  };

  function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    const binaryString = String.fromCharCode.apply(null, Array.from(uint8Array));
    return btoa(binaryString);
  }

  const getMetaMaskPublicId = async (accountIdx = 0, confirm = false): Promise<string> => {
    return await window.ethereum.request({
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
    });
  };

  const getMetaMaskSignedTx = async (tx: Uint8Array, offset: number) => {
    // Convert the binary buffer to a base64 string
    const base64Tx = btoa(String.fromCharCode(...tx));

    return await window.ethereum.request({
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
    });
  };

  const getTickInfo = async () => {
    // console.log('getTickInfo')
    const tickResult = await fetch(`${httpEndpoint}/v1/tick-info`);
    const tick = await tickResult.json();
    // check if tick is valid
    if (!tick || !tick.tickInfo) {
      // console.warn('getTickInfo: Invalid tick')
      return { tickInfo: { tick: 0, epoch: 0 } };
    }
    return tick.tickInfo;
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
      const tickInfo = await getTickInfo();
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
    getTickInfo,
    getBalance,
    getTransactionsHistory,
    tickOffset,
    getPaymentTx,
  };

  return (
    <MetaMaskProvider>
      <QubicConnectContext.Provider value={contextValue}>{children}</QubicConnectContext.Provider>
    </MetaMaskProvider>
  );
}

export function useQubicConnect(): QubicConnectContextValue {
  const context = useContext(QubicConnectContext);
  if (context === undefined) {
    throw new Error("useQubicConnect() hook must be used within a <QubicConnectProvider>");
  }
  return context;
}

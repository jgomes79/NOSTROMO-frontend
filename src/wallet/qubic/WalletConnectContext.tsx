import SignClientLib from "@walletconnect/sign-client";
import { createContext, useContext, useEffect, useState } from "react";

import type {
  SendQubicParams,
  SignClient,
  SignMessageParams,
  SignTransactionParams,
  SignedTransaction,
  TransactionResult,
  WalletConnectAccount,
  WalletConnectContextType,
  WalletConnectProviderProps,
  WalletConnectSession,
} from "../wallet.types";

// Singleton to prevent double initialization
let globalSignClient: SignClient | null = null;
let isInitializing = false;

const WalletConnectContext = createContext<WalletConnectContextType | undefined>(undefined);

export const WalletConnectProvider = ({ children }: WalletConnectProviderProps) => {
  const [signClient, setSignClient] = useState<SignClient | null>(null);
  const [sessionTopic, setSessionTopic] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const connect = async () => {
    if (!signClient) {
      console.error("❌ SignClient not initialized");
      return {
        uri: "",
        approve: async () => {
          return;
        },
      };
    }

    setIsConnecting(true);
    console.log("🔗 Creating WalletConnect session...");

    try {
      const { uri, approval } = await signClient.connect({
        requiredNamespaces: {
          qubic: {
            chains: [import.meta.env.VITE_CHAIN_ID],
            methods: [
              "qubic_requestAccounts",
              "qubic_sendQubic",
              "qubic_sendAsset",
              "qubic_signTransaction",
              "qubic_sign",
            ],
            events: ["amountChanged", "assetAmountChanged", "accountsChanged"],
          },
        },
      });

      console.log("✅ WalletConnect session created, URI:", uri ? "generated" : "missing");

      const approve = async () => {
        try {
          const session = await approval();
          setSessionTopic(session.topic);
          setIsConnected(true);
          localStorage.setItem("sessionTopic", session.topic);
        } catch (e) {
          console.error("Connection rejected:", e);
        }
      };

      return { uri: uri || "", approve };
    } catch (error) {
      console.error("Failed to connect:", error);
      return {
        uri: "",
        approve: async () => {
          return;
        },
      };
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    if (!signClient || !sessionTopic) {
      return;
    }

    try {
      await signClient.disconnect({
        topic: sessionTopic,
        reason: { code: 6000, message: "User disconnected" },
      });

      setSessionTopic("");
      setIsConnected(false);
      localStorage.removeItem("sessionTopic");
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  const requestAccounts = async () => {
    if (!signClient || !sessionTopic) throw new Error("Not connected");

    try {
      const result = await signClient.request({
        topic: sessionTopic,
        chainId: import.meta.env.VITE_CHAIN_ID,
        request: {
          method: "qubic_requestAccounts",
          params: {
            nonce: Date.now().toString(),
          },
        },
      });
      return result as WalletConnectAccount[];
    } catch (error) {
      console.error("Failed to request accounts:", error);
      throw error;
    }
  };

  const sendQubic = async (params: SendQubicParams): Promise<TransactionResult> => {
    if (!signClient || !sessionTopic) throw new Error("Not connected");

    const result = await signClient.request<TransactionResult>({
      topic: sessionTopic,
      chainId: import.meta.env.VITE_CHAIN_ID,
      request: {
        method: "qubic_sendQubic",
        params: {
          ...params,
          nonce: Date.now().toString(),
        },
      },
    });

    return result;
  };

  const signTransaction = async (params: SignTransactionParams): Promise<SignedTransaction> => {
    if (!signClient || !sessionTopic) throw new Error("Not connected");

    try {
      const result = await signClient.request<SignedTransaction>({
        topic: sessionTopic,
        chainId: import.meta.env.VITE_CHAIN_ID,
        request: {
          method: "qubic_signTransaction",
          params: {
            from: params.from,
            to: params.to,
            amount: params.amount,
            inputType: params.inputType,
            payload: params.payload,
            nonce: Date.now().toString(),
          },
        },
      });

      return result;
    } catch (error) {
      console.error("Failed to sign transaction:", error);
      throw error;
    }
  };

  const signMessage = async (params: SignMessageParams): Promise<string> => {
    if (!signClient || !sessionTopic) throw new Error("Not connected");

    const result = await signClient.request<string>({
      topic: sessionTopic,
      chainId: import.meta.env.VITE_CHAIN_ID,
      request: {
        method: "qubic_sign",
        params,
      },
    });

    return result;
  };

  useEffect(() => {
    const initializeClient = async () => {
      // If already initialized, use the existing client
      if (globalSignClient) {
        setSignClient(globalSignClient);

        // Restore session if exists
        const storedTopic = localStorage.getItem("sessionTopic");
        if (storedTopic) {
          try {
            const session = globalSignClient.session.get(storedTopic) as WalletConnectSession | undefined;
            if (session) {
              setSessionTopic(storedTopic);
              setIsConnected(true);
            } else {
              localStorage.removeItem("sessionTopic");
            }
          } catch (error) {
            console.error("Error restoring session:", error);
            localStorage.removeItem("sessionTopic");
          }
        }
        return;
      }

      // Prevent multiple simultaneous initializations
      if (isInitializing) {
        console.log("⏳ WalletConnect initialization already in progress...");
        return;
      }

      try {
        isInitializing = true;
        console.log("🔗 Initializing WalletConnect SignClient...");

        const client = await SignClientLib.init({
          projectId: import.meta.env.VITE_WC_PROJECT_ID,
          metadata: {
            name: "NOSTROMO",
            description: "NOSTROMO Launchpad",
            url: window.location.origin,
            icons: ["https://walletconnect.com/walletconnect-logo.png"],
          },
        });

        console.log("✅ WalletConnect SignClient initialized");
        globalSignClient = client;
        setSignClient(client);

        // Restore session if exists
        const storedTopic = localStorage.getItem("sessionTopic");
        if (storedTopic) {
          try {
            const session = client.session.get(storedTopic) as WalletConnectSession | undefined;
            if (session) {
              setSessionTopic(storedTopic);
              setIsConnected(true);
              console.log("✅ Restored WalletConnect session");
            } else {
              localStorage.removeItem("sessionTopic");
            }
          } catch (error) {
            console.error("Error restoring session:", error);
            localStorage.removeItem("sessionTopic");
          }
        }

        // Set up event listeners
        client.on("session_delete", () => {
          console.log("🔗 Session deleted");
          setSessionTopic("");
          setIsConnected(false);
          localStorage.removeItem("sessionTopic");
        });

        client.on("session_expire", () => {
          console.log("🔗 Session expired");
          setSessionTopic("");
          setIsConnected(false);
          localStorage.removeItem("sessionTopic");
        });
      } catch (error) {
        console.error("Failed to initialize WalletConnect:", error);
      } finally {
        isInitializing = false;
      }
    };

    initializeClient();

    // Cleanup function
    return () => {
      // Remove event listeners if needed when component unmounts
      if (globalSignClient) {
        globalSignClient.removeAllListeners("session_delete");
        globalSignClient.removeAllListeners("session_expire");
      }
    };
  }, []);

  const contextValue: WalletConnectContextType = {
    signClient,
    sessionTopic,
    isConnecting,
    isConnected,
    connect,
    disconnect,
    requestAccounts,
    sendQubic,
    signTransaction,
    signMessage,
  };

  return <WalletConnectContext.Provider value={contextValue}>{children}</WalletConnectContext.Provider>;
};

export const useWalletConnect = () => {
  const context = useContext(WalletConnectContext);
  if (!context) {
    throw new Error("useWalletConnect must be used within a WalletConnectProvider");
  }
  return context;
};

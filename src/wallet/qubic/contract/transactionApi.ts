import { Buffer } from "buffer";

import base64 from "base-64";

import { encodeParams, getContractIndex, byteArrayToHexString } from "./contractUtils";

// Tick offset for future execution
const TICK_OFFSET = 10;

// Type definitions
export interface Wallet {
  publicKey: string;
  privateKey?: string;
  connectType: "privateKey" | "vaultFile" | "mmSnap" | "walletconnect";
  wcSession?: unknown; // WalletConnect session object
}

export interface QubicHelper {
  PUBLIC_KEY_LENGTH: number;
  TRANSACTION_SIZE: number;
  DIGEST_LENGTH: number;
  getIdentityBytes(publicKey: string): Uint8Array;
  createIdPackage(privateKey: string): Promise<unknown>;
  getIdentity(publicKey: Uint8Array): Promise<string>;
}

export interface QubicConnectContext {
  wallet: Wallet | null;
  qHelper: QubicHelper;
  getTick(): Promise<number>;
  signTransaction(tx: Uint8Array): Promise<Uint8Array>;
  broadcastTx(tx: Uint8Array, endpoint?: string): Promise<BroadcastResult>;
  httpEndpoint: string;
}

export interface BroadcastResult {
  status: number;
  result: {
    encodedTransaction: string;
    peersBroadcasted: number;
    transactionId: string;
  };
  [key: string]: unknown; // Allow additional properties
}

export interface TransactionResult {
  success: boolean;
  txHash: string;
  message: string;
  explorerLink: string | null;
  [key: string]: unknown; // Allow additional properties from broadcast result
}

export interface InputField {
  name: string;
  type: string;
  size?: string; // Changed from number to string to match FunctionParameter
}

export interface ExecuteTransactionParams {
  qubicConnect: QubicConnectContext;
  contractIndex: string | number;
  procedureIndex: number;
  params?: Record<string, unknown>;
  inputFields?: InputField[];
  amount?: string | number | bigint;
  contractIndexes?: Record<string, number>;
}

export interface SendQubicTransactionParams {
  qubicConnect: QubicConnectContext;
  destinationPublicKey: string;
  amountQus: string | number | bigint;
}

/**
 * Execute a transaction (procedure) on a contract using wallet integration.
 * This function now takes the full context object provided by App.js
 * and uses the requestConfirmation flow.
 */
export async function executeTransactionWithWallet({
  qubicConnect, // Contains wallet, qHelper, getTick, signTransaction, broadcastTx, httpEndpoint
  contractIndex, // Can be name or number
  procedureIndex,
  params = {}, // User-provided parameters from the form
  inputFields = [], // Input field definitions for encoding
  // Added details passed from App.js for confirmation display
  amount,
  contractIndexes, // Add this parameter
}: ExecuteTransactionParams): Promise<TransactionResult> {
  // Destructure needed functions/state from context
  const { wallet, qHelper, getTick, signTransaction, broadcastTx, httpEndpoint } = qubicConnect;

  if (!wallet || !wallet.publicKey) {
    throw new Error("Wallet not connected or public key unavailable.");
  }
  if (!qHelper) {
    throw new Error("QubicHelper instance (qHelper) is not available in the context.");
  }

  // Note: No `try...catch` here, errors will be caught by the calling function in App.js
  // after the confirmation promise is rejected or resolves with an error.

  // --- 1. Prepare Transaction Data ---

  // Get current tick from network
  const tick = await getTick();
  if (tick === null || tick === undefined) {
    throw new Error("Failed to retrieve current network tick.");
  }
  const finalTick = tick + TICK_OFFSET;

  // Convert contract name to index if needed
  let contractIdxNum: number = typeof contractIndex === "number" ? contractIndex : 0;
  console.log("[transactionApi] Original contractIndex:", contractIndex, "type:", typeof contractIndex);
  console.log("[transactionApi] contractIndexes passed:", contractIndexes);

  if (typeof contractIndex === "string") {
    contractIdxNum = getContractIndex(contractIndex, contractIndexes);
    console.log("[transactionApi] String contractIndex converted:", contractIndex, "->", contractIdxNum);
  } else {
    console.log("[transactionApi] Numeric contractIndex used directly:", contractIdxNum);
  }

  console.log("[transactionApi] Final contractIdxNum:", contractIdxNum, "type:", typeof contractIdxNum);

  console.log(
    `Transaction Prep - Contract: ${contractIndex} -> ${contractIdxNum}, Procedure: ${procedureIndex}, Tick: ${finalTick}`,
  );

  // Get source public key bytes (already validated that wallet exists)
  let sourcePublicKeyBytes: Uint8Array;
  try {
    sourcePublicKeyBytes = qHelper.getIdentityBytes(wallet.publicKey);
  } catch (error) {
    console.error("Error getting source public key bytes:", error);
    throw new Error(`Failed to convert source public key ${wallet.publicKey} to bytes.`);
  }
  if (!sourcePublicKeyBytes || sourcePublicKeyBytes.length !== qHelper.PUBLIC_KEY_LENGTH) {
    throw new Error("Failed to get valid source public key bytes.");
  }

  // Amount (use the value passed for confirmation, default to 0)
  const transactionAmount = BigInt(amount || 0);

  // Encode parameters (make sure transactionAmount isn't included here if it was a form field)
  const paramsToEncode = { ...params };
  if (paramsToEncode.transactionAmount) {
    // console.log("Removing transactionAmount from encoded params");
    delete paramsToEncode.transactionAmount;
  }
  // Convert InputField[] to FunctionParameter[] for compatibility
  const functionParameters = inputFields.map((field) => ({
    type: field.type,
    name: field.name,
    size: field.size,
  }));
  const encodedData = encodeParams(paramsToEncode, functionParameters, qHelper);
  const inputBytes = encodedData
    ? new Uint8Array(Buffer.from(base64.decode(encodedData), "binary"))
    : new Uint8Array(0);
  const inputSize = inputBytes.length;

  // --- 2. Build Unsigned Transaction ---

  const TX_SIZE = qHelper.TRANSACTION_SIZE + inputSize;
  const tx = new Uint8Array(TX_SIZE).fill(0);
  const dv = new DataView(tx.buffer);
  let offset = 0;

  // Source Public Key (32 bytes)
  tx.set(sourcePublicKeyBytes, offset);
  offset += qHelper.PUBLIC_KEY_LENGTH;

  // Destination Public Key (32 bytes) - Set first byte to contract index
  // Important: The remaining 31 bytes should be 0 for contract calls
  tx[offset] = contractIdxNum;
  // No need to zero out rest due to .fill(0) on initialization
  offset += qHelper.PUBLIC_KEY_LENGTH;

  // Amount (8 bytes)
  dv.setBigInt64(offset, transactionAmount, true); // Use LE (true)
  offset += 8;

  // Tick (4 bytes)
  dv.setUint32(offset, finalTick, true); // Use LE (true)
  offset += 4;

  // Input Type / Procedure Index (2 bytes)
  dv.setUint16(offset, procedureIndex, true); // Use LE (true)
  offset += 2;

  // Input Size (2 bytes)
  dv.setUint16(offset, inputSize, true); // Use LE (true)
  offset += 2;

  // Input Data (variable bytes)
  if (inputSize > 0) {
    tx.set(inputBytes, offset);
    offset += inputSize;
  }

  // The remaining bytes (offset to TX_SIZE) are reserved for the signature
  // and are already initialized to 0.

  console.log("Unsigned Tx built (Hex):", byteArrayToHexString(tx.slice(0, offset)));
  console.log(`Expected Signature Offset: ${offset}, Expected TX Size: ${TX_SIZE}`);

  // --- 3. Sign Transaction ---
  // The signTransaction function is provided by the context and handles different wallet types.
  console.log("Requesting signature via context...");
  const signedTx = await signTransaction(tx); // Pass the full tx buffer
  if (!signedTx || signedTx.length !== TX_SIZE) {
    throw new Error("Signing failed or returned invalid transaction data.");
  }
  console.log("Transaction signed (Full Hex):", byteArrayToHexString(signedTx));

  // --- 4. Broadcast Transaction ---
  console.log("Broadcasting signed transaction...");
  const broadcastResult = await broadcastTx(signedTx);
  if (!broadcastResult || broadcastResult.status >= 400) {
    // broadcastTx in context should throw on network error
    throw new Error("Broadcasting failed. No result returned.");
  }

  console.log("Broadcast API Result:", broadcastResult);

  // --- 5. Format and Return Result ---
  const txHash = broadcastResult.result.transactionId; // Check both possible fields

  // Determine Explorer URL based on RPC endpoint
  const isTestnet = httpEndpoint && httpEndpoint.toLowerCase().includes("testnet");
  const baseExplorerUrl = isTestnet ? "https://testnet.explorer.qubic.org" : "https://explorer.qubic.org";

  let explorerLink: string | null = null;
  if (txHash) {
    explorerLink = `${baseExplorerUrl}/network/tx/${txHash}?type=latest`;
  } else {
    explorerLink = `${baseExplorerUrl}/network/address/${wallet.publicKey}`;
    console.warn("Transaction hash not found in broadcast response.");
  }

  return {
    success: true, // Assume success if broadcast didn't throw
    txHash: txHash || "N/A", // Provide hash or indicate absence
    message: "Transaction broadcast successfully." + (!txHash ? " (Hash pending confirmation)" : ""),
    explorerLink,
    ...broadcastResult, // Include any other fields from the broadcast response
  };
}

/**
 * Sends Qubic (QU) from the connected wallet to a destination address.
 */
export async function sendQubicTransaction({
  qubicConnect, // Contains wallet, qHelper, getTick, signTransaction, broadcastTx, httpEndpoint
  destinationPublicKey, // The public key string of the recipient
  amountQus, // The amount to send in QUs (BigInt or string)
}: SendQubicTransactionParams): Promise<TransactionResult> {
  // Destructure needed functions/state from context
  const { wallet, qHelper, getTick, signTransaction, broadcastTx, httpEndpoint } = qubicConnect;

  if (!wallet || !wallet.publicKey) {
    throw new Error("Wallet not connected or public key unavailable.");
  }
  if (!qHelper) {
    throw new Error("QubicHelper instance (qHelper) is not available in the context.");
  }
  if (!destinationPublicKey || typeof destinationPublicKey !== "string" || destinationPublicKey.length !== 60) {
    // Basic validation
    throw new Error("Invalid destination public key provided.");
  }
  let transactionAmount: bigint;
  try {
    transactionAmount = BigInt(amountQus);
    if (transactionAmount <= 0n) throw new Error("Amount must be positive");
  } catch (e) {
    throw new Error(`Invalid amount provided: ${amountQus}. Must be a positive integer.`);
  }

  console.log(`Attempting to send ${transactionAmount} QU from ${wallet.publicKey} to ${destinationPublicKey}`);

  // --- 1. Prepare Transaction Data ---
  const tick = await getTick();
  if (tick === null || tick === undefined) {
    throw new Error("Failed to retrieve current network tick.");
  }
  const finalTick = tick + TICK_OFFSET;

  let sourcePublicKeyBytes: Uint8Array;
  let destPublicKeyBytes: Uint8Array;
  try {
    sourcePublicKeyBytes = qHelper.getIdentityBytes(wallet.publicKey);
    destPublicKeyBytes = qHelper.getIdentityBytes(destinationPublicKey);
  } catch (error) {
    console.error("Error getting public key bytes:", error);
    throw new Error(
      `Failed to convert public key(s) to bytes: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  if (!sourcePublicKeyBytes || sourcePublicKeyBytes.length !== qHelper.PUBLIC_KEY_LENGTH) {
    throw new Error("Failed to get valid source public key bytes.");
  }
  if (!destPublicKeyBytes || destPublicKeyBytes.length !== qHelper.PUBLIC_KEY_LENGTH) {
    throw new Error("Failed to get valid destination public key bytes.");
  }

  // --- 2. Build Unsigned Transaction ---
  const TX_SIZE = qHelper.TRANSACTION_SIZE; // Standard size, no input data
  const tx = new Uint8Array(TX_SIZE).fill(0);
  const dv = new DataView(tx.buffer);
  let offset = 0;

  // Source Public Key (32 bytes)
  tx.set(sourcePublicKeyBytes, offset);
  offset += qHelper.PUBLIC_KEY_LENGTH;

  // Destination Public Key (32 bytes)
  tx.set(destPublicKeyBytes, offset);
  offset += qHelper.PUBLIC_KEY_LENGTH;

  // Amount (8 bytes)
  dv.setBigInt64(offset, transactionAmount, true); // Use LE (true)
  offset += 8;

  // Tick (4 bytes)
  dv.setUint32(offset, finalTick, true); // Use LE (true)
  offset += 4;

  // Input Type (2 bytes) - 0 for standard transfer
  dv.setUint16(offset, 0, true); // Use LE (true)
  offset += 2;

  // Input Size (2 bytes) - 0 for standard transfer
  dv.setUint16(offset, 0, true); // Use LE (true)
  offset += 2;

  // Signature space is already zeroed

  console.log("Unsigned Qubic Transfer Tx built (Hex):", byteArrayToHexString(tx.slice(0, offset)));

  // --- 3. Sign Transaction ---
  console.log("Requesting signature for Qubic transfer...");
  let signedTx: Uint8Array;
  try {
    signedTx = await signTransaction(tx);
    console.log("[sendQubicTransaction] Raw result from signTransaction:", signedTx); // Log the raw result
    if (!signedTx || !(signedTx instanceof Uint8Array) || signedTx.length !== TX_SIZE) {
      console.error("[sendQubicTransaction] Invalid signedTx received:", signedTx);
      throw new Error(
        `Signing failed or returned invalid transaction data. Expected Uint8Array of length ${TX_SIZE}, got: ${signedTx?.constructor?.name} length ${signedTx?.length}`,
      );
    }
    console.log("Qubic Transfer Transaction signed successfully (Full Hex):", byteArrayToHexString(signedTx));
  } catch (signingError) {
    console.error("[sendQubicTransaction] Error during signTransaction call:", signingError);
    throw new Error(
      `Signing process failed: ${signingError instanceof Error ? signingError.message : String(signingError)}`,
    ); // Re-throw to be caught by caller
  }

  // --- 4. Broadcast Transaction ---
  console.log("Broadcasting signed Qubic transfer...");
  let broadcastResult: BroadcastResult;
  try {
    broadcastResult = await broadcastTx(signedTx);
    console.log("[sendQubicTransaction] Raw result from broadcastTx:", broadcastResult);
    if (!broadcastResult) {
      // Consider if broadcastTx might return specific error codes instead of just null/undefined
      console.error("[sendQubicTransaction] broadcastTx returned falsy value.", broadcastResult);
      throw new Error("Broadcasting Qubic transfer failed. No result returned from broadcastTx.");
    }
    console.log("Qubic Transfer Broadcast API Result:", broadcastResult);
  } catch (broadcastError) {
    console.error("[sendQubicTransaction] Error during broadcastTx call:", broadcastError);
    throw new Error(
      `Broadcasting failed: ${broadcastError instanceof Error ? broadcastError.message : String(broadcastError)}`,
    ); // Re-throw
  }

  // --- 5. Format and Return Result ---
  const txHash: string = broadcastResult.result.transactionId as string;

  // Determine Explorer URL based on RPC endpoint
  const isTestnet = httpEndpoint && httpEndpoint.toLowerCase().includes("testnet");
  const baseExplorerUrl = isTestnet ? "https://testnet.explorer.qubic.org" : "https://explorer.qubic.org";

  let explorerLink: string | null = null;
  if (txHash) {
    explorerLink = `${baseExplorerUrl}/network/tx/${txHash}?type=latest`;
  } else {
    explorerLink = `${baseExplorerUrl}/network/address/${wallet.publicKey}`;
    console.warn("Qubic transfer transaction hash not found in broadcast response.");
  }

  return {
    success: true,
    txHash: txHash || "N/A",
    message: "Qubic transfer broadcast successfully." + (!txHash ? " (Hash pending confirmation)" : ""),
    explorerLink,
    ...broadcastResult,
  };
}

/**
 * @fileoverview Centralized type definitions for the wallet module
 * All wallet-related types should be defined here to avoid duplication
 */

import type SignClient from "@walletconnect/sign-client";
import { ReactNode, SVGProps } from "react";

// Re-export SignClient for use in other files
export type { SignClient };

// ============================================================================
// Core Wallet Types
// ============================================================================

/**
 * Wallet connection types supported by the application
 */
export type WalletConnectType = "privateKey" | "vaultFile" | "mmSnap" | "walletconnect";

/**
 * Main wallet interface
 */
export interface Wallet {
  publicKey: string;
  privateKey?: string;
  connectType: WalletConnectType;
  alias?: string;
}

/**
 * Account information structure
 */
export interface Account {
  publicId: string;
  publicKey?: string;
  privateKey?: string;
  alias?: string;
  address?: string;
  name?: string;
}

/**
 * Balance information structure
 */
export interface Balance {
  id: string;
  balance: number;
}

/**
 * Balance info structure (for API responses)
 */
export interface BalanceInfo {
  balance: {
    balance: number;
  };
}

// ============================================================================
// WalletConnect Types
// ============================================================================

/**
 * WalletConnect account information
 */
export interface WalletConnectAccount {
  publicKey: string;
  alias?: string;
}

/**
 * WalletConnect session data
 */
export interface WalletConnectSession {
  topic: string;
  namespaces: Record<
    string,
    {
      chains: string[];
      methods: string[];
      events: string[];
    }
  >;
}

/**
 * WalletConnect context type
 */
export interface WalletConnectContextType {
  signClient: SignClient | null;
  sessionTopic: string;
  isConnecting: boolean;
  isConnected: boolean;
  connect: () => Promise<{ uri: string; approve: () => Promise<void> }>;
  disconnect: () => Promise<void>;
  requestAccounts: () => Promise<WalletConnectAccount[]>;
  sendQubic: (params: SendQubicParams) => Promise<TransactionResult>;
  signTransaction: (params: SignTransactionParams) => Promise<SignedTransaction>;
  signMessage: (params: SignMessageParams) => Promise<string>;
}

// ============================================================================
// MetaMask Snap Types
// ============================================================================

/**
 * MetaMask Snap information
 */
export interface Snap {
  permissionName: string;
  id: string;
  version: string;
  initialPermissions: Record<string, JsonValue>;
}

/**
 * MetaMask Snaps response
 */
export type GetSnapsResponse = Record<string, Snap>;

/**
 * MetaMask state for snap management
 */
export interface MetamaskState {
  snapsDetected: boolean;
  isFlask: boolean;
  installedSnap?: Snap;
  error?: Error;
}

/**
 * MetaMask actions enum
 */
export enum MetamaskActions {
  SetInstalled = "SetInstalled",
  SetSnapsDetected = "SetSnapsDetected",
  SetError = "SetError",
  SetIsFlask = "SetIsFlask",
}

// ============================================================================
// Transaction Types
// ============================================================================

/**
 * Transaction structure
 */
export interface Transaction {
  sourceId: string;
  destId: string;
  amount: string;
  tickNumber: number;
  inputType: number;
  inputSize: number;
  inputHex: string;
  signatureHex: string;
  txId: string;
}

/**
 * Parameters for sending Qubic
 */
export interface SendQubicParams {
  from: string;
  to: string;
  amount: number;
}

/**
 * Parameters for signing a transaction
 */
export interface SignTransactionParams {
  from: string;
  to: string;
  amount: number;
  tick: number;
  inputType: number;
  payload: string | null;
}

/**
 * Parameters for signing a message
 */
export interface SignMessageParams {
  from: string;
  message: string;
}

/**
 * Signed transaction result
 */
export interface SignedTransaction {
  signature: string;
  transactionHex: string;
  txId?: string;
}

/**
 * Transaction result from broadcast
 */
export interface TransactionResult {
  success: boolean;
  txHash?: string;
  txId?: string;
  transactionId?: string;
  error?: string;
  result?: {
    transactionId?: string;
    id?: string;
  };
}

/**
 * Broadcast result
 */
export interface BroadcastResult {
  success: boolean;
  status: number;
  transactionId?: string;
  error?: string;
  result?: JsonValue;
}

// ============================================================================
// Contract Types
// ============================================================================

/**
 * Contract function definition
 */
export interface ContractFunction {
  type: "view" | "transaction";
  name: string;
  index: number;
  inputs?: ContractFunctionParameter[];
  outputs?: ContractFunctionParameter[];
}

/**
 * Contract function parameter
 */
export interface ContractFunctionParameter {
  name: string;
  type: string;
  size?: number;
}

/**
 * Contract indexes mapping
 */
export interface ContractIndexes {
  [contractName: string]: number;
}

/**
 * Query result from contract
 */
export interface QueryResult {
  success: boolean;
  decodedFields?: Record<string, JsonValue>;
  rawResponse?: JsonValue;
  error?: string;
}

// ============================================================================
// Qubic Types
// ============================================================================

/**
 * Qubic helper interface
 */
export interface QubicHelper {
  PUBLIC_KEY_LENGTH: number;
  TRANSACTION_SIZE: number;
  DIGEST_LENGTH: number;
  SIGNATURE_LENGTH: number;
  getIdentityBytes: (publicKey: string) => Uint8Array;
  encodeId?: (id: string) => string;
  [key: string]: number | ((arg: string) => Uint8Array) | ((arg: string) => string) | undefined;
}

/**
 * Qubic connect configuration
 */
export interface QubicConnectConfig {
  snapOrigin?: string;
}

/**
 * Qubic connect provider props
 */
export interface QubicConnectProviderProps {
  children: ReactNode;
  config?: QubicConnectConfig;
}

/**
 * Tick information type
 */
export interface TickInfoType {
  tick: number;
  epoch: number;
}

/**
 * Qubic date structure
 */
export interface QubicDate {
  year: number;
  month: number;
  day: number;
  hour: number;
}

/**
 * Qubic connect context value
 */
export interface QubicConnectContextValue {
  connected: boolean;
  wallet: Wallet | null;
  connect: (wallet: Wallet) => void;
  disconnect: () => void;
  getMetaMaskPublicId: (accountIdx?: number, confirm?: boolean) => Promise<string>;
  getSignedTx: (tx: Uint8Array | QubicTransaction, offset: number) => Promise<Uint8Array>;
  broadcastTx: (tx: Uint8Array) => Promise<BroadcastResult>;
  getTick: () => Promise<number>;
  getBalance: (publicKey: string) => Promise<Balance>;
  getTransactionsHistory: (publicKey: string) => Promise<Transaction[]>;
  tickOffset: number;
  getPaymentTx: (sender: string, receiver: string, amount: number, tick: number) => Promise<Uint8Array>;
  qHelper: QubicHelper;
  httpEndpoint: string;
  signTransaction: (tx: Uint8Array) => Promise<Uint8Array>;
  config?: QubicConnectConfig;
  // WalletConnect integration methods
  walletConnectConnect: () => Promise<{ uri: string; approve: () => Promise<void> }>;
  walletConnectDisconnect: () => Promise<void>;
  walletConnectRequestAccounts: () => Promise<WalletConnectAccount[]>;
}

// ============================================================================
// Nostromo Types
// ============================================================================

/**
 * Nostromo tier definition
 */
export interface NostromoTier {
  name: string;
  stake: number;
  poolWeight: number;
  unstakeFee: number;
}

/**
 * Nostromo fees structure
 */
export interface NostromoFees {
  QX_TOKEN_ISSUANCE: number;
  CREATE_PROJECT: number;
  TRANSFER_RIGHTS: number;
}

/**
 * Nostromo tiers mapping
 */
export interface NostromoTiers {
  [key: number]: NostromoTier;
}

/**
 * Project data structure
 */
export interface ProjectData {
  tokenName: number;
  supply: number;
  startYear: number;
  startMonth: number;
  startDay: number;
  startHour: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  endHour: number;
  [key: string]: number;
}

/**
 * Fundraising data structure
 */
export interface FundraisingData {
  tokenPrice: number;
  soldAmount: number;
  requiredFunds: number;
  indexOfProject: number;
  firstPhaseStartYear: number;
  firstPhaseStartMonth: number;
  firstPhaseStartDay: number;
  firstPhaseStartHour: number;
  firstPhaseEndYear: number;
  firstPhaseEndMonth: number;
  firstPhaseEndDay: number;
  firstPhaseEndHour: number;
  secondPhaseStartYear: number;
  secondPhaseStartMonth: number;
  secondPhaseStartDay: number;
  secondPhaseStartHour: number;
  secondPhaseEndYear: number;
  secondPhaseEndMonth: number;
  secondPhaseEndDay: number;
  secondPhaseEndHour: number;
  thirdPhaseStartYear: number;
  thirdPhaseStartMonth: number;
  thirdPhaseStartDay: number;
  thirdPhaseStartHour: number;
  thirdPhaseEndYear: number;
  thirdPhaseEndMonth: number;
  thirdPhaseEndDay: number;
  thirdPhaseEndHour: number;
  listingStartYear: number;
  listingStartMonth: number;
  listingStartDay: number;
  listingStartHour: number;
  cliffEndYear: number;
  cliffEndMonth: number;
  cliffEndDay: number;
  cliffEndHour: number;
  vestingEndYear: number;
  vestingEndMonth: number;
  vestingEndDay: number;
  vestingEndHour: number;
  threshold: number;
  TGE: number;
  stepOfVesting: number;
  [key: string]: number;
}

/**
 * Project structure
 */
export interface Project {
  creator: string;
  tokenName: number;
  supplyOfToken: number;
  startDate: number;
  endDate: number;
  numberOfYes: number;
  numberOfNo: number;
  isCreatedFundarasing: boolean;
}

/**
 * Fundraising structure
 */
export interface Fundraising {
  tokenPrice: number;
  soldAmount: number;
  requiredFunds: number;
  raisedFunds: number;
  indexOfProject: number;
  firstPhaseStartDate: number;
  firstPhaseEndDate: number;
  secondPhaseStartDate: number;
  secondPhaseEndDate: number;
  thirdPhaseStartDate: number;
  thirdPhaseEndDate: number;
  listingStartDate: number;
  cliffEndDate: number;
  vestingEndDate: number;
  threshold: number;
  TGE: number;
  stepOfVesting: number;
  isCreatedToken: boolean;
}

/**
 * Stats structure
 */
export interface Stats {
  epochRevenue: number;
  totalPoolWeight: number;
  numberOfRegister: number;
  numberOfCreatedProject: number;
  numberOfFundaraising: number;
}

/**
 * Vote status structure
 */
export interface VoteStatus {
  numberOfVotedProjects: number;
  projectIndexList: number[];
}

/**
 * Investment stats structure
 */
export interface InvestmentStats {
  numberOfInvestedProjects: number;
  numberOfClaimedProjects: number;
}

/**
 * Asset structure
 */
export interface Asset {
  issuer: string;
  name: string;
  amount?: number;
}

// ============================================================================
// UI Component Types
// ============================================================================

/**
 * Input max chars props
 */
export interface InputMaxCharsProps {
  id: string;
  label: string;
  max: number;
  placeholder: string;
  onChange: (value: string) => void;
}

/**
 * Input numbers props
 */
export interface InputNumbersProps {
  label: string;
  placeholder: string;
  onChange: (value: number) => void;
}

/**
 * Button props
 */
export interface ButtonProps {
  label: string;
  primary?: boolean;
  onClick: () => void;
}

/**
 * Dropdown option
 */
export interface DropdownOption {
  label: string;
  value: string | number;
}

/**
 * Dropdown props
 */
export interface DropdownProps {
  label: string;
  options: DropdownOption[];
  selected: number;
  setSelected: (index: number) => void;
}

/**
 * Confirm transaction modal props
 */
export interface ConfirmTxModalProps {
  open: boolean;
  onClose: () => void;
  tx: {
    title: string;
    description: string;
  };
  onConfirm: () => Promise<TransactionResult>;
}

/**
 * Card props
 */
export interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Header props
 */
export interface HeaderProps {
  logo: string;
}

/**
 * Product logo props
 */
export interface ProductLogoProps {
  name: string;
  className?: string;
}

/**
 * Icons type
 */
export interface IconsType {
  CopyElement: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  ArrowDown: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

// ============================================================================
// Form Data Types
// ============================================================================

/**
 * Create fundraising form data
 */
export interface CreateFundraisingFormData {
  projectIndex: number;
  tokenPrice: number;
  threshold: number;
  // Add other fields as needed
}

/**
 * Investment data
 */
export interface InvestmentData {
  projectIndex: number;
  amount: number;
  phase: number;
}

/**
 * Claim data
 */
export interface ClaimData {
  projectIndex: number;
  claimedAmount?: number;
}

// ============================================================================
// Hook Types
// ============================================================================

/**
 * Transaction monitor options
 */
export interface TransactionMonitorOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  pollingInterval?: number;
  maxAttempts?: number;
}

/**
 * Store type for hooks
 */
export interface Store<T = JsonValue> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Project index list
 */
export interface ProjectIndexList {
  numberOfVotedProjects: number;
  projectIndexList: number[];
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * JSON value type
 */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/**
 * Input field definition
 */
export interface InputField {
  name: string;
  type: string;
  size?: number;
}

/**
 * Transaction details for contract execution
 */
export interface TransactionDetails {
  qubicConnect: QubicConnectContextValue;
  contractIndex: number;
  procedureIndex: number;
  params?: Record<string, JsonValue>;
  inputFields?: InputField[];
  amount: string;
  sourceId: string;
  destinationId: string;
  contractIndexes: ContractIndexes;
}

/**
 * Execute transaction parameters
 */
export interface ExecuteTransactionParams {
  qubicConnect: QubicConnectContextValue;
  wallet: Wallet;
  contractIndex: number;
  procedureIndex: number;
  params?: Record<string, JsonValue>;
  inputFields: InputField[];
  amount: string;
}

/**
 * Send Qubic transaction parameters
 */
export interface SendQubicTransactionParams {
  qubicConnect: QubicConnectContextValue;
  wallet: Wallet;
  toAddress: string;
  amount: string;
}

/**
 * Contract response
 */
export interface ContractResponse {
  rawResponse?: JsonValue;
  decodedFields?: Record<string, JsonValue>;
  [key: string]: JsonValue | undefined;
}

/**
 * Wallet provider props
 */
export interface WalletProviderProps {
  readonly children: ReactNode;
}

/**
 * WalletConnect provider props
 */
export interface WalletConnectProviderProps {
  readonly children: ReactNode;
}

// ============================================================================
// External Library Types
// ============================================================================

/**
 * SignClient connect parameters
 */
export interface SignClientConnectParams {
  requiredNamespaces: Record<
    string,
    {
      chains: string[];
      methods: string[];
      events: string[];
    }
  >;
}

/**
 * SignClient request parameters
 */
export interface SignClientRequestParams {
  topic: string;
  chainId: string;
  request: {
    method: string;
    params: JsonValue;
  };
}

/**
 * Qubic transaction interface
 * This represents a transaction that can be built
 */
export interface QubicTransaction {
  build: (address: string) => Promise<Uint8Array>;
  constructor?: { name: string };
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Check if a value is a valid Project
 */
export function isValidProject(project: unknown): project is Project {
  return (
    typeof project === "object" &&
    project !== null &&
    "creator" in project &&
    "tokenName" in project &&
    "supplyOfToken" in project
  );
}

/**
 * Check if a value is a valid Fundraising
 */
export function isValidFundraising(fundraising: unknown): fundraising is Fundraising {
  return (
    typeof fundraising === "object" &&
    fundraising !== null &&
    "tokenPrice" in fundraising &&
    "soldAmount" in fundraising &&
    "requiredFunds" in fundraising
  );
}

/**
 * Check if a value is a Wallet
 */
export function isWallet(value: unknown): value is Wallet {
  return typeof value === "object" && value !== null && "publicKey" in value && "connectType" in value;
}

/**
 * Check if error has a message property
 */
export function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  );
}

/**
 * Check if error has data property with message
 */
export function isErrorWithData(error: unknown): error is { data: { message: string } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data: unknown }).data === "object" &&
    (error as { data: unknown }).data !== null &&
    "message" in ((error as { data: unknown }).data as object) &&
    typeof (error as { data: { message: unknown } }).data.message === "string"
  );
}

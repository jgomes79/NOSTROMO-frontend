import { Buffer } from "buffer";

import base64 from "base-64";

import { getContractIndex, encodeParams, decodeContractResponse, QHelper } from "./contractUtils";

// Type definitions
export interface ContractIndexes {
  [key: string]: number;
}

export interface JsonDataPayload {
  contractIndex: number;
  inputType: number;
  inputSize: number;
  requestData: string;
}

export interface QueryResult {
  success: boolean;
  decodedFields?: Record<string, unknown>;
  rawResponse?: unknown;
  error?: string;
}

export interface TransactionResult {
  success: boolean;
  txHash?: string;
  error?: string;
  [key: string]: unknown;
}

export interface BinaryResponseResult {
  formatted: Record<string, unknown>;
  rawHex: string;
  byteLength: number;
}

export interface ContractFunction {
  type: "view" | "transaction";
  name: string;
  index: number;
  inputs?: Array<{
    name: string;
    type: string;
    size?: number;
  }>;
  outputs?: Array<{
    name: string;
    type: string;
    size?: number;
  }>;
}

export interface Contract {
  contractName?: string;
  fileName?: string;
  content?: string;
  functions?: ContractFunction[];
}

export interface FeeResult {
  functionName: string;
  data: Record<string, unknown>;
  source: "parsed_constant" | "api";
  raw?: unknown;
}

export interface DiscoveredFees {
  contractName: string;
  feeInfo: Record<string, FeeResult>;
  timestamp: number;
  procedureConstants: Record<string, unknown>;
}

export interface ProcedureRequirements {
  minimumAmount?: number;
  fee?: number;
}

export interface QubicHelper {
  encodeId?: (id: string) => string;
  [key: string]: unknown;
}

export const HEADERS: Record<string, string> = {
  accept: "application/json",
  "Content-Type": "application/json",
};

/**
 * Creates a formatted request payload for contract interactions
 * @param contractIndex - The index of the contract
 * @param functionIndex - Function or procedure index
 * @param inputSize - Size of the input data
 * @param requestData - Base64 encoded input data
 * @returns Formatted request payload
 */
export const makeJsonData = (
  contractIndex: number,
  functionIndex: number,
  inputSize: number,
  requestData: string,
): JsonDataPayload => ({
  contractIndex,
  inputType: functionIndex,
  inputSize,
  requestData,
});

/**
 * Execute a view function (query) on a contract
 * @param httpEndpoint - API endpoint URL
 * @param contractIndex - Contract index or name
 * @param functionIndex - Function index
 * @param params - Function parameters
 * @param inputFields - Input field definitions
 * @param selectedFunction - Complete function definition
 * @param customIndexes - Custom indexes for contract
 * @param qHelper - QubicHelper instance for encoding IDs
 * @returns Query result
 */
export async function queryContract(
  httpEndpoint: string,
  contractIndex: number | string,
  functionIndex: number,
  params: Record<string, unknown> = {},
  inputFields: Array<{ name: string; type: string; size?: number }> = [],
  selectedFunction: ContractFunction | null = null,
  customIndexes: ContractIndexes | null = null,
  qHelper: QubicHelper | null = null,
): Promise<QueryResult> {
  console.log(`Query contract called with: ${contractIndex}, function: ${functionIndex}`);

  let contractIdxNum: number = contractIndex as number;

  if (typeof contractIndex === "string") {
    contractIdxNum = getContractIndex(contractIndex, customIndexes);
  }

  // Convertimos los tamaños numéricos a string para cumplir con FunctionParameter
  const inputFieldsFixed = inputFields.map((field) => ({
    ...field,
    size: field.size !== undefined ? String(field.size) : undefined,
  }));

  const qHelperFixed =
    qHelper && typeof (qHelper as unknown as QHelper).getIdentityBytes === "function"
      ? (qHelper as unknown as QHelper)
      : undefined;
  const encodedData = encodeParams(params, inputFieldsFixed, qHelperFixed);
  const inputSize = encodedData ? Buffer.from(base64.decode(encodedData), "binary").length : 0;
  const queryData = makeJsonData(contractIdxNum, functionIndex, inputSize, encodedData);

  try {
    let endpoint = httpEndpoint;
    if (!endpoint.startsWith("http://") && !endpoint.startsWith("https://")) {
      endpoint = "https://" + endpoint;
    }

    let url = `${endpoint}/v1/querySmartContract`;
    if (process.env.NODE_ENV === "development" && endpoint.includes("rpc.qubic.org")) {
      // Only use proxy for mainnet endpoint to avoid CORS
      url = `/api/proxy/v1/querySmartContract`;
    }

    console.log("[contractApi] Making request to URL:", url);
    console.log("[contractApi] Request payload:", JSON.stringify(queryData, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(queryData),
    });

    console.log("[contractApi] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const json = await response.json();
    console.log("[contractApi] Raw JSON response:", JSON.stringify(json, null, 2));

    // Check if responseData exists and log its details
    if (json.responseData) {
      console.log("[contractApi] ResponseData exists, length:", json.responseData.length);
      console.log("[contractApi] ResponseData preview:", json.responseData.substring(0, 100));
    } else {
      console.log("[contractApi] ResponseData is missing or empty!");
      console.log("[contractApi] Full response keys:", Object.keys(json));

      // If proxy returns empty data, try direct call as fallback
      if (process.env.NODE_ENV === "development" && endpoint.includes("rpc.qubic.org")) {
        console.log("[contractApi] Proxy returned empty data, trying direct call...");

        const directUrl = `${endpoint}/v1/querySmartContract`;
        console.log("[contractApi] Trying direct URL:", directUrl);

        try {
          const directResponse = await fetch(directUrl, {
            method: "POST",
            headers: HEADERS,
            body: JSON.stringify(queryData),
          });

          if (directResponse.ok) {
            const directJson = await directResponse.json();
            console.log("[contractApi] Direct call response:", JSON.stringify(directJson, null, 2));

            if (directJson.responseData) {
              console.log("[contractApi] ¡La llamada directa tiene responseData! Usándolo.");
              return {
                ...decodeContractResponse(
                  directJson.responseData,
                  (selectedFunction?.outputs || []).map((param) => ({
                    ...param,
                    size: param.size !== undefined ? String(param.size) : undefined,
                  })),
                ),
                rawResponse: directJson,
              };
            }
          }
        } catch (directError) {
          console.log("[contractApi] Direct call also failed:", (directError as Error).message);
        }
      }
    }

    const decodedResponse = decodeContractResponse(
      json.responseData,
      (selectedFunction?.outputs || []).map((param) => ({
        ...param,
        size: param.size !== undefined ? String(param.size) : undefined,
      })),
    );

    console.log("[contractApi] Decoded response:", decodedResponse);

    return {
      ...decodedResponse,
      rawResponse: json,
    };
  } catch (error) {
    console.error("Error querying contract:", error);
    let errorDetails = (error as Error).message;

    if ((error as Error).message.includes("Failed to fetch")) {
      errorDetails = `Network error: Unable to reach ${httpEndpoint}. This could be due to CORS restrictions, network connectivity, or the server being unavailable. Try using a CORS proxy or backend API.`;
    }

    return {
      success: false,
      error: errorDetails,
    };
  }
}

/**
 * Execute a transaction (procedure) on a contract
 * @param httpEndpoint - API endpoint URL
 * @param contractIndex - Contract index
 * @param procedureIndex - Procedure index
 * @param params - Procedure parameters
 * @returns Transaction result
 */
export async function executeTransaction(
  httpEndpoint: string,
  contractIndex: number,
  procedureIndex: number,
  params: Record<string, unknown> = {},
): Promise<TransactionResult> {
  // Convert params to appropriate binary format and encode as base64
  const encodedData = encodeParams(params);
  const inputSize = encodedData ? Buffer.from(base64.decode(encodedData), "binary").length : 0;

  const txData = makeJsonData(contractIndex, procedureIndex, inputSize, encodedData);

  try {
    console.log("Sending transaction data:", txData);

    // If endpoint doesn't have http/https prefix, add it
    let endpoint = httpEndpoint;
    if (!endpoint.startsWith("http://") && !endpoint.startsWith("https://")) {
      endpoint = "https://" + endpoint;
    }

    // Check if we should use a proxy to avoid CORS issues
    let url = `${endpoint}/v1/submitTransaction`;
    const corsOptions: Record<string, unknown> = {};

    // If we're in development, use the local proxy to avoid CORS issues
    if (process.env.NODE_ENV === "development" && endpoint.includes("rpc.qubic.org")) {
      // Only use proxy for mainnet endpoint to avoid CORS
      url = `/api/proxy/v1/submitTransaction`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(txData),
      ...corsOptions,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
    }

    const json = await response.json();
    console.log("Transaction response:", json);

    return {
      success: true,
      txHash: json.txHash,
      ...json,
    };
  } catch (error) {
    console.error("Error executing transaction:", error);

    // Provide more info about the error
    let errorDetails = (error as Error).message;

    // Check for common network errors
    if ((error as Error).message.includes("Failed to fetch")) {
      errorDetails = `Network error: Unable to reach ${httpEndpoint}. This could be due to CORS restrictions, network connectivity, or the server being unavailable. Try using a CORS proxy or backend API.`;
    }

    return {
      success: false,
      error: errorDetails,
    };
  }
}

// Identify potential fee-related functions by name patterns
function findFeeFunctions(contractFunctions: ContractFunction[]): ContractFunction[] {
  const feePatterns = [/fee/i, /minimum/i, /min.*deposit/i, /deposit.*min/i, /limit/i, /threshold/i, /required/i];

  return contractFunctions.filter((fn) => {
    // Only look at view functions (type === 'view')
    if (fn.type !== "view") return false;

    // Check if function name matches any fee-related patterns
    return feePatterns.some((pattern) => pattern.test(fn.name));
  });
}

// Function to parse constants from contract code
export function parseContractConstants(contractContent: string): Record<string, number> {
  const constants: Record<string, number> = {};

  // Match constexpr declarations like:
  // constexpr uint64 QEARN_MINIMUM_LOCKING_AMOUNT = 10000000;
  const constRegex = /constexpr\s+(?:uint|sint|int)\d*\s+([A-Z0-9_]+)\s*=\s*(\d+)(?:ULL)?;/g;
  let match;

  while ((match = constRegex.exec(contractContent)) !== null) {
    const constName = match[1];
    const constValue = parseInt(match[2], 10);
    constants[constName] = constValue;
  }

  // Also look for initialize sections that set important values
  // INITIALIZE
  //   state.setProposalFee = 1000000;
  // _
  const initRegex = /INITIALIZE[^_]*state\.([A-Za-z0-9_]+)\s*=\s*(\d+);/g;

  while ((match = initRegex.exec(contractContent)) !== null) {
    const stateName = match[1];
    const stateValue = parseInt(match[2], 10);
    constants[stateName] = stateValue;
  }

  // Map common constant names to meaningful labels
  const commonConstantMappings: Record<string, string> = {
    QEARN_MINIMUM_LOCKING_AMOUNT: "minimumLockingAmount",
    setProposalFee: "proposalFee",
  };

  // Create a cleaned up, normalized object
  const normalizedConstants: Record<string, number> = {};

  Object.entries(constants).forEach(([key, value]) => {
    // Use common mapping if available, otherwise use the original key
    const normalizedKey = commonConstantMappings[key] || key;
    normalizedConstants[normalizedKey] = value;
  });

  return normalizedConstants;
}

// Extract procedure requirements based on code analysis
export function extractProcedureRequirements(contractContent: string, procedureName: string): ProcedureRequirements {
  const requirements: ProcedureRequirements = {};

  // Find the procedure definition
  const procRegex = new RegExp(`PUBLIC_PROCEDURE(?:_WITH_LOCALS)?\\s*\\(${procedureName}\\)[^_]*`, "s");
  const procMatch = procRegex.exec(contractContent);

  if (procMatch) {
    const procCode = procMatch[0];

    // Look for minimum amount checks
    const minAmountRegex = /qpi\.invocationReward\(\)\s*<\s*([A-Z0-9_]+|\d+)/g;
    const minAmountMatch = minAmountRegex.exec(procCode);

    if (minAmountMatch) {
      const minAmountVar = minAmountMatch[1];
      // If it's a constant reference, look up the value
      if (/^[A-Z0-9_]+$/.test(minAmountVar)) {
        const constRegex = new RegExp(`constexpr\\s+(?:uint|sint|int)\\d*\\s+${minAmountVar}\\s*=\\s*(\\d+)(?:ULL)?;`);
        const constMatch = constRegex.exec(contractContent);
        if (constMatch) {
          requirements.minimumAmount = parseInt(constMatch[1], 10);
        }
      } else {
        // Direct numeric value
        requirements.minimumAmount = parseInt(minAmountVar, 10);
      }
    }

    // Look for fee checks
    const feeRegex = /qpi\.invocationReward\(\)\s*<\s*state\.([A-Za-z0-9_]+)/g;
    const feeMatch = feeRegex.exec(procCode);

    if (feeMatch) {
      const feeVar = feeMatch[1];
      // Find the initialization of this state variable
      const initRegex = new RegExp(`state\\.${feeVar}\\s*=\\s*(\\d+)`, "g");
      const initMatch = initRegex.exec(contractContent);
      if (initMatch) {
        requirements.fee = parseInt(initMatch[1], 10);
      }
    }
  }

  return requirements;
}

// Enhanced discovery function that analyzes contract code
export async function discoverContractFees(httpEndpoint: string, contract: Contract): Promise<DiscoveredFees | null> {
  if (!contract || !contract.functions) return null;

  const contractName = contract.contractName || (contract.fileName ? contract.fileName.split(".")[0] : "unknown");
  const feeResults: Record<string, FeeResult> = {};

  // Parse constants from contract content
  const constants = contract.content ? parseContractConstants(contract.content) : {};

  // Add constants to results
  Object.entries(constants).forEach(([key, value]) => {
    feeResults[key] = {
      functionName: key,
      data: { [key]: value },
      source: "parsed_constant",
    };
  });

  // Extract procedure requirements
  const procedureConstants: Record<string, ProcedureRequirements> = {};
  contract.functions.forEach((fn) => {
    if (fn.type === "transaction" && contract.content) {
      const requirements = extractProcedureRequirements(contract.content, fn.name);
      if (Object.keys(requirements).length > 0) {
        procedureConstants[fn.name] = requirements;
      }
    }
  });

  // Query fee-related functions
  const feeFunctions = findFeeFunctions(contract.functions);

  for (const fn of feeFunctions) {
    try {
      const result = await queryContract(httpEndpoint, contractName, fn.index, {}, fn.inputs || [], fn);

      if (result.success) {
        feeResults[fn.name] = {
          functionName: fn.name,
          data: result.decodedFields || {},
          source: "api",
          raw: result,
        };
      }
    } catch (error) {
      console.error(`Error querying fee function ${fn.name}:`, error);
    }
  }

  return {
    contractName: contractName,
    feeInfo: feeResults,
    timestamp: Date.now(),
    procedureConstants: procedureConstants,
  };
}

// Check if a transaction might need fees based on naming conventions
export function mightRequireFee(functionName: string): boolean {
  const feeRequiringPatterns = [
    /set/i,
    /create/i,
    /add/i,
    /deposit/i,
    /lock/i,
    /stake/i,
    /vote/i,
    /propose/i,
    /proposal/i,
    /submit/i,
  ];

  return feeRequiringPatterns.some((pattern) => pattern.test(functionName));
}

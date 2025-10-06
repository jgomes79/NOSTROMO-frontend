import { API_ENDPOINT, RPC_ENDPOINT } from "../constants";
import {
  Balance,
  EpochTicks,
  IQuerySC,
  IQuerySCResponse,
  LatestStats,
  RichList,
  TickInfo,
  TxHistory,
} from "../types/index";
import { uint8ArrayToBase64 } from "../utils/index";

// Rate limiting queue for querySmartContract calls
const queryQueue: Array<{
  query: IQuerySC;
  resolve: (value: IQuerySCResponse) => void;
  reject: (error: unknown) => void;
}> = [];
let isProcessing = false;
const RATE_LIMIT_DELAY = 500; // 500ms between requests
const BATCH_SIZE = 5; // Process 5 requests at a time

// Monitoring stats
let totalRequests = 0;
let successfulRequests = 0;
let failedRequests = 0;

const processQueryQueue = async () => {
  if (isProcessing || queryQueue.length === 0) return;

  isProcessing = true;
  console.log(`[Rate Limiter] Processing queue with ${queryQueue.length} requests`);

  while (queryQueue.length > 0) {
    const batch = queryQueue.splice(0, BATCH_SIZE);
    console.log(`[Rate Limiter] Processing batch of ${batch.length} requests`);

    // Process batch in parallel
    const promises = batch.map(async ({ query, resolve, reject }) => {
      try {
        totalRequests++;
        const result = await fetchQuerySCDirect(query);
        successfulRequests++;
        resolve(result);
      } catch (error) {
        failedRequests++;
        console.error("[Rate Limiter] Request failed:", error);
        reject(error);
      }
    });

    await Promise.all(promises);

    // Add delay between batches if there are more requests
    if (queryQueue.length > 0) {
      console.log(`[Rate Limiter] Waiting ${RATE_LIMIT_DELAY}ms before next batch`);
      await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY));
    }
  }

  console.log(`[Rate Limiter] Queue processing complete. Stats:`, getQueryStats());
  isProcessing = false;
};

// Export monitoring function for debugging
export const getQueryStats = () => ({
  totalRequests,
  successfulRequests,
  failedRequests,
  queueLength: queryQueue.length,
  isProcessing,
  successRate: totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0,
});

// Direct implementation without rate limiting (for internal use)
const fetchQuerySCDirect = async (query: IQuerySC, retryCount = 0, noCache = false): Promise<IQuerySCResponse> => {
  try {
    const queryResult = await fetch(
      `${RPC_ENDPOINT}/v1/querySmartContract${noCache ? `?no-cache=${Date.now()}` : ""}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      },
    );

    if (!queryResult.ok) {
      if (queryResult.status === 429 && retryCount < 3) {
        // Rate limited, retry after exponential backoff
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchQuerySCDirect(query, retryCount + 1);
      }
      throw new Error(`QuerySmartContract failed: ${queryResult.status} ${queryResult.statusText}`);
    }

    const result = await queryResult.json();
    return result;
  } catch (error) {
    if (retryCount < 3 && error instanceof Error && error.message.includes("429")) {
      // Retry on rate limit errors
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchQuerySCDirect(query, retryCount + 1);
    }
    throw error;
  }
};

// Rate-limited version for external use
export const fetchQuerySC = async (query: IQuerySC): Promise<IQuerySCResponse> => {
  return new Promise((resolve, reject) => {
    queryQueue.push({ query, resolve, reject });
    processQueryQueue();
  });
};

export const fetchTickInfo = async (): Promise<TickInfo> => {
  const tickResult = await fetch(`${RPC_ENDPOINT}/v1/tick-info?no-cache=${Date.now()}`);
  const tick = await tickResult.json();
  if (!tick || !tick.tickInfo) {
    console.warn("getTickInfo: Invalid tick");
    return {} as TickInfo;
  }
  return tick.tickInfo;
};

export const fetchBalance = async (publicId: string): Promise<Balance> => {
  const balanceResult = await fetch(`${RPC_ENDPOINT}/v1/balances/${publicId}?no-cache=${Date.now()}`);
  const balance = await balanceResult.json();
  if (!balance || !balance.balance) {
    console.warn("getBalance: Invalid balance");
    return {} as Balance;
  }
  return balance.balance;
};

export const broadcastTx = async (tx: Uint8Array) => {
  const url = `${RPC_ENDPOINT}/v1/broadcast-transaction`;
  const txEncoded = uint8ArrayToBase64(tx);
  const body = { encodedTransaction: txEncoded };
  const result = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const broadcastResult = await result.json();
  return broadcastResult;
};

export const fetchTxStatus = async (txId: string) => {
  const txStatusResult = await fetch(`${RPC_ENDPOINT}/v1/tx-status/${txId}?no-cache=${Date.now()}`);
  let txStatus = undefined;
  if (txStatusResult.status == 200) {
    txStatus = await txStatusResult.json();
  }
  return txStatus.transactionStatus;
};

export const fetchLatestStats = async (): Promise<LatestStats> => {
  const latestStatsResult = await fetch(`${RPC_ENDPOINT}/v1/latest-stats?no-cache=${Date.now()}`);
  if (!latestStatsResult.ok) {
    console.warn("fetchLatestStats: Failed to fetch latest stats");
    return {} as LatestStats;
  }
  const latestStats = await latestStatsResult.json();
  if (!latestStats || !latestStats.data) {
    console.warn("fetchLatestStats: Invalid response data");
    return {} as LatestStats;
  }
  return latestStats.data;
};

export const fetchRichList = async (page: number, pageSize: number): Promise<RichList> => {
  const richListResult = await fetch(
    `${RPC_ENDPOINT}/v1/rich-list?page=${page}&pageSize=${pageSize}&no-cache=${Date.now()}`,
  );
  const richList = await richListResult.json();
  return richList;
};

export const fetchTxHistory = async (publicId: string, startTick: number, endTick: number): Promise<TxHistory> => {
  const txHistoryResult = await fetch(
    `${RPC_ENDPOINT}/v2/identities/${publicId}/transfers?startTick=${startTick}&endTick=${endTick}&no-cache=${Date.now()}`,
  );
  const txHistory = await txHistoryResult.json();
  return txHistory.data;
};

export const fetchEpochTicks = async (epoch: number, page: number, pageSize: number): Promise<EpochTicks> => {
  const epochTicksResult = await fetch(
    `${RPC_ENDPOINT}/v2/epochs/${epoch}/ticks?page=${page}&pageSize=${pageSize}&no-cache=${Date.now()}`,
  );
  const epochTicks = await epochTicksResult.json();
  return epochTicks.data;
};

export const fetchTickEvents = async (tick: number) => {
  try {
    const tickEventsResult = await fetch(`${API_ENDPOINT}/v1/events/getTickEvents?no-cache=${Date.now()}`, {
      method: "POST",
      body: JSON.stringify({ tick }),
    });
    return tickEventsResult.json();
  } catch (error) {
    return null;
  }
};

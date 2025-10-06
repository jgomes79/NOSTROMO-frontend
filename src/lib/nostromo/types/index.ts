export type TickInfo = {
  tick: number;
  duration: number;
  epoch: number;
  initialTick: number;
};

export type Balance = {
  id: string;
  balance: string;
  validForTick: number;
  latestIncomingTransferTick: number;
  latestOutgoingTransferTick: number;
  incomingAmount: number;
  outgoingAmount: number;
  numberOfIncomingTransfers: number;
  numberOfOutgoingTransfers: number;
};

export interface IQuerySC {
  contractIndex: number;
  inputType: number;
  inputSize: number;
  requestData: string;
}

export interface IQuerySCResponse {
  responseData: string;
}

export interface TxStatus {
  txId: string;
  moneyFlew: boolean;
}

export interface LatestStats {
  timestamp: string;
  circulatingSupply: string;
  activeAddresses: number;
  price: number;
  marketCap: string;
  epoch: number;
  currentTick: number;
  ticksInCurrentEpoch: number;
  emptyTicksInCurrentEpoch: number;
  epochTickQuality: number;
  burnedQus: string;
}

export interface RichList {
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
  };
  epoch: number;
  richList: {
    entities: { identity: string; balance: string }[];
  };
}

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
export interface TxHistory {
  transactions: {
    tickNumber: number;
    identity: string;
    transactions: {
      transaction: Transaction;
      timestamp: string;
      moneyFlew: boolean;
    }[];
  }[];
}

export interface EpochTicks {
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    nextPage: number;
    previousPage: number;
  };
  ticks: { tickNumber: number; isEmpty: boolean }[];
}

export interface IBurnNBoostedStats {
  burnedAmount: number;
  averageBurnedPercent: number;
  boostedAmount: number;
  averageBoostedPercent: number;
  rewardedAmount: number;
  averageRewardedPercent: number;
}

export interface TickEvents {
  tick: number;
  txEvents: {
    txId: string;
    events: IEvent[];
  }[];
}

export interface IEvent {
  header: {
    epoch: number;
    tick: number;
    tmp: number;
    eventId: string;
    eventDigest: string;
  };
  eventType: number;
  eventSize: number;
  eventData: string;
}

// Nostromo specific types
export interface IProjectInfo {
  tokenName: number;
  numberOfYes: number;
  numberOfNo: number;
  supply: number;
  startYear: number;
  startMonth: number;
  startDay: number;
  startHour: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  endHour: number;
  isCreatedFundarasing: boolean;
}

export interface IFundraisingInfo {
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
}

export interface IInvestInfo {
  indexOfFundraising: number;
  investedAmount: number;
  claimedAmount: number;
}

export interface INostromoStats {
  epochRevenue: number;
  totalPoolWeight: number;
  numberOfRegister: number;
  numberOfCreatedProject: number;
  numberOfFundraising: number;
}

export interface IUserVoteStatus {
  numberOfVotedProjects: number;
  projectIndexList: number[];
}

export interface IProjectIndexList {
  indexListForProjects: number[];
}

export interface IUserInvestedInfo {
  listUserInvested: IInvestInfo[];
}

export interface IAsset {
  issuer: Uint8Array;
  assetName: number;
}

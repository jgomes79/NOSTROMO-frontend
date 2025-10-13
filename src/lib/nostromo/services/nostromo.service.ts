import { DynamicPayload } from "@qubic-lib/qubic-ts-library/dist/qubic-types/DynamicPayload";
import { QubicHelper } from "@qubic-lib/qubic-ts-library/dist/qubicHelper";

import {
  NOSTROMO_CREATE_PROJECT_FEE,
  NOSTROMO_QX_TOKEN_ISSUANCE_FEE,
  NOSTROMO_TIER_CHESTBURST_STAKE_AMOUNT,
  NOSTROMO_TIER_DOG_STAKE_AMOUNT,
  NOSTROMO_TIER_FACEHUGGER_STAKE_AMOUNT,
  NOSTROMO_TIER_WARRIOR_STAKE_AMOUNT,
  NOSTROMO_TIER_XENOMORPH_STAKE_AMOUNT,
} from "../constants";
import {
  IAsset,
  IFundraisingInfo,
  IInvestInfo,
  INostromoStats,
  IProjectIndexList,
  IProjectVote,
  IUserInvestedInfo,
  IUserVoteStatus,
} from "../types/index";
import { base64ToUint8Array, createPayload, uint8ArrayToBase64 } from "../utils/index";
import { fetchQuerySC } from "./rpc.service";
import { createSCTx } from "./tx.service";

const qHelper = new QubicHelper();

// Helper function to create Asset from string issuer ID
export const createAsset = (issuerId: string | Uint8Array, assetName: number): IAsset => {
  let issuerBytes: Uint8Array;
  if (typeof issuerId === "string") {
    issuerBytes = qHelper.getIdentityBytes(issuerId);
  } else {
    issuerBytes = issuerId;
  }
  return {
    issuer: issuerBytes,
    assetName: assetName,
  };
};

// Query Functions

export const getStats = async (): Promise<INostromoStats> => {
  const res = await fetchQuerySC({
    contractIndex: 14,
    inputType: 1,
    inputSize: 0,
    requestData: "",
  });

  if (!res.responseData) {
    return {
      epochRevenue: 0,
      totalPoolWeight: 0,
      numberOfRegister: 0,
      numberOfCreatedProject: 0,
      numberOfFundraising: 0,
    };
  }

  const responseView = new DataView(base64ToUint8Array(res.responseData).buffer);
  const getValue = (offset: number) => Number(responseView.getBigUint64(offset, true));
  const getUint32Value = (offset: number) => responseView.getUint32(offset, true);

  return {
    epochRevenue: getValue(0),
    totalPoolWeight: getValue(8),
    numberOfRegister: getUint32Value(16),
    numberOfCreatedProject: getUint32Value(20),
    numberOfFundraising: getUint32Value(24),
  };
};

export const getTierLevelByUser = async (userId: Uint8Array | string): Promise<number> => {
  let userIdBytes: Uint8Array;
  if (typeof userId === "string") {
    userIdBytes = qHelper.getIdentityBytes(userId);
  } else {
    userIdBytes = userId;
  }

  const view = new DataView(new Uint8Array(32).buffer);
  userIdBytes.forEach((byte, index) => view.setUint8(index, byte));

  const res = await fetchQuerySC({
    contractIndex: 14,
    inputType: 2,
    inputSize: 32,
    requestData: uint8ArrayToBase64(new Uint8Array(view.buffer)),
  });

  if (!res.responseData) return 0;

  return new DataView(base64ToUint8Array(res.responseData).buffer).getUint8(0);
};

export const getUserVoteStatus = async (userId: Uint8Array | string): Promise<IUserVoteStatus> => {
  let userIdBytes: Uint8Array;
  if (typeof userId === "string") {
    userIdBytes = qHelper.getIdentityBytes(userId);
  } else {
    userIdBytes = userId;
  }

  const view = new DataView(new Uint8Array(32).buffer);
  userIdBytes.forEach((byte, index) => view.setUint8(index, byte));

  const res = await fetchQuerySC({
    contractIndex: 14,
    inputType: 3,
    inputSize: 32,
    requestData: uint8ArrayToBase64(new Uint8Array(view.buffer)),
  });

  if (!res.responseData) {
    return {
      numberOfVotedProjects: 0,
      projectIndexList: [],
    };
  }

  const responseView = new DataView(base64ToUint8Array(res.responseData).buffer);
  const numberOfVotedProjects = responseView.getUint32(0, true);

  const projectIndexList: number[] = [];
  for (let i = 0; i < 128; i++) {
    projectIndexList.push(responseView.getUint32(4 + i * 4, true));
  }

  return {
    numberOfVotedProjects,
    projectIndexList,
  };
};

export const checkTokenCreatability = async (tokenName: number): Promise<boolean> => {
  const view = new DataView(new Uint8Array(8).buffer);
  view.setBigUint64(0, BigInt(tokenName), true);

  const res = await fetchQuerySC({
    contractIndex: 14,
    inputType: 4,
    inputSize: 8,
    requestData: uint8ArrayToBase64(new Uint8Array(view.buffer)),
  });

  if (!res.responseData) return false;

  return new DataView(base64ToUint8Array(res.responseData).buffer).getUint8(0) === 1;
};

export const getNumberOfInvestedProjects = async (userId: Uint8Array | string): Promise<number> => {
  let userIdBytes: Uint8Array;
  if (typeof userId === "string") {
    userIdBytes = qHelper.getIdentityBytes(userId);
  } else {
    userIdBytes = userId;
  }

  const view = new DataView(new Uint8Array(32).buffer);
  userIdBytes.forEach((byte, index) => view.setUint8(index, byte));

  const res = await fetchQuerySC({
    contractIndex: 14,
    inputType: 5,
    inputSize: 32,
    requestData: uint8ArrayToBase64(new Uint8Array(view.buffer)),
  });

  if (!res.responseData) return 0;

  return new DataView(base64ToUint8Array(res.responseData).buffer).getUint32(0, true);
};

export const getProjectByIndex = async (indexOfProject: number): Promise<IProjectVote> => {
  const view = new DataView(new Uint8Array(4).buffer);
  view.setUint32(0, indexOfProject, true);

  const res = await fetchQuerySC({
    contractIndex: 14,
    inputType: 6,
    inputSize: 4,
    requestData: uint8ArrayToBase64(new Uint8Array(view.buffer)),
  });

  if (!res.responseData) {
    return {
      creator: 0,
      tokenName: 0,
      supply: 0,
      startDate: 0,
      endDate: 0,
      numberOfYes: 0,
      numberOfNo: 0,
      isCreatedFundarasing: false,
    };
  }

  const responseView = new DataView(base64ToUint8Array(res.responseData).buffer);
  const getValue = (offset: number) => Number(responseView.getBigUint64(offset, true));
  const getUint32Value = (offset: number) => responseView.getUint32(offset, true);

  return {
    creator: getValue(0),
    tokenName: getValue(32),
    supply: getValue(48),
    startDate: getUint32Value(52),
    endDate: getUint32Value(56),
    numberOfYes: getUint32Value(60),
    numberOfNo: getUint32Value(64),
    isCreatedFundarasing: false,
  }
};

export const getFundraisingByIndex = async (indexOfFundraising: number): Promise<IFundraisingInfo> => {
  const view = new DataView(new Uint8Array(4).buffer);
  view.setUint32(0, indexOfFundraising, true);

  const res = await fetchQuerySC({
    contractIndex: 14,
    inputType: 7,
    inputSize: 4,
    requestData: uint8ArrayToBase64(new Uint8Array(view.buffer)),
  });

  if (!res.responseData) {
    return {
      tokenPrice: 0,
      soldAmount: 0,
      requiredFunds: 0,
      indexOfProject: 0,
      firstPhaseStartYear: 0,
      firstPhaseStartMonth: 0,
      firstPhaseStartDay: 0,
      firstPhaseStartHour: 0,
      firstPhaseEndYear: 0,
      firstPhaseEndMonth: 0,
      firstPhaseEndDay: 0,
      firstPhaseEndHour: 0,
      secondPhaseStartYear: 0,
      secondPhaseStartMonth: 0,
      secondPhaseStartDay: 0,
      secondPhaseStartHour: 0,
      secondPhaseEndYear: 0,
      secondPhaseEndMonth: 0,
      secondPhaseEndDay: 0,
      secondPhaseEndHour: 0,
      thirdPhaseStartYear: 0,
      thirdPhaseStartMonth: 0,
      thirdPhaseStartDay: 0,
      thirdPhaseStartHour: 0,
      thirdPhaseEndYear: 0,
      thirdPhaseEndMonth: 0,
      thirdPhaseEndDay: 0,
      thirdPhaseEndHour: 0,
      listingStartYear: 0,
      listingStartMonth: 0,
      listingStartDay: 0,
      listingStartHour: 0,
      cliffEndYear: 0,
      cliffEndMonth: 0,
      cliffEndDay: 0,
      cliffEndHour: 0,
      vestingEndYear: 0,
      vestingEndMonth: 0,
      vestingEndDay: 0,
      vestingEndHour: 0,
      threshold: 0,
      TGE: 0,
      stepOfVesting: 0,
    };
  }

  const responseView = new DataView(base64ToUint8Array(res.responseData).buffer);
  const getValue = (offset: number) => Number(responseView.getBigUint64(offset, true));
  const getUint32Value = (offset: number) => responseView.getUint32(offset, true);
  const getUint8Value = (offset: number) => responseView.getUint8(offset);

  return {
    tokenPrice: getValue(0),
    soldAmount: getValue(8),
    requiredFunds: getValue(16),
    indexOfProject: getUint32Value(24),
    firstPhaseStartYear: getUint32Value(28),
    firstPhaseStartMonth: getUint32Value(32),
    firstPhaseStartDay: getUint32Value(36),
    firstPhaseStartHour: getUint32Value(40),
    firstPhaseEndYear: getUint32Value(44),
    firstPhaseEndMonth: getUint32Value(48),
    firstPhaseEndDay: getUint32Value(52),
    firstPhaseEndHour: getUint32Value(56),
    secondPhaseStartYear: getUint32Value(60),
    secondPhaseStartMonth: getUint32Value(64),
    secondPhaseStartDay: getUint32Value(68),
    secondPhaseStartHour: getUint32Value(72),
    secondPhaseEndYear: getUint32Value(76),
    secondPhaseEndMonth: getUint32Value(80),
    secondPhaseEndDay: getUint32Value(84),
    secondPhaseEndHour: getUint32Value(88),
    thirdPhaseStartYear: getUint32Value(92),
    thirdPhaseStartMonth: getUint32Value(96),
    thirdPhaseStartDay: getUint32Value(100),
    thirdPhaseStartHour: getUint32Value(104),
    thirdPhaseEndYear: getUint32Value(108),
    thirdPhaseEndMonth: getUint32Value(112),
    thirdPhaseEndDay: getUint32Value(116),
    thirdPhaseEndHour: getUint32Value(120),
    listingStartYear: getUint32Value(124),
    listingStartMonth: getUint32Value(128),
    listingStartDay: getUint32Value(132),
    listingStartHour: getUint32Value(136),
    cliffEndYear: getUint32Value(140),
    cliffEndMonth: getUint32Value(144),
    cliffEndDay: getUint32Value(148),
    cliffEndHour: getUint32Value(152),
    vestingEndYear: getUint32Value(156),
    vestingEndMonth: getUint32Value(160),
    vestingEndDay: getUint32Value(164),
    vestingEndHour: getUint32Value(168),
    threshold: getUint8Value(172),
    TGE: getUint8Value(173),
    stepOfVesting: getUint8Value(174),
  };
};

export const getProjectIndexListByCreator = async (creator: Uint8Array | string): Promise<IProjectIndexList> => {
  let creatorBytes: Uint8Array;
  if (typeof creator === "string") {
    creatorBytes = qHelper.getIdentityBytes(creator);
  } else {
    creatorBytes = creator;
  }

  const view = new DataView(new Uint8Array(32).buffer);
  creatorBytes.forEach((byte, index) => view.setUint8(index, byte));

  const res = await fetchQuerySC({
    contractIndex: 14,
    inputType: 8,
    inputSize: 32,
    requestData: uint8ArrayToBase64(new Uint8Array(view.buffer)),
  });

  if (!res.responseData) {
    return {
      indexListForProjects: [],
    };
  }

  const responseView = new DataView(base64ToUint8Array(res.responseData).buffer);

  const indexListForProjects: number[] = [];
  for (let i = 0; i < 128; i++) {
    const index = responseView.getUint32(i * 4, true);
    if (index < 10000) {
      indexListForProjects.push(index);
    }
  }

  return {
    indexListForProjects,
  };
};

export const getInfoUserInvested = async (investorId: Uint8Array | string): Promise<IUserInvestedInfo> => {
  let investorIdBytes: Uint8Array;
  if (typeof investorId === "string") {
    investorIdBytes = qHelper.getIdentityBytes(investorId);
  } else {
    investorIdBytes = investorId;
  }

  const view = new DataView(new Uint8Array(32).buffer);
  investorIdBytes.forEach((byte, index) => view.setUint8(index, byte));

  const res = await fetchQuerySC({
    contractIndex: 14,
    inputType: 9,
    inputSize: 32,
    requestData: uint8ArrayToBase64(new Uint8Array(view.buffer)),
  });

  if (!res.responseData) {
    return {
      listUserInvested: [],
    };
  }

  const responseView = new DataView(base64ToUint8Array(res.responseData).buffer);

  const listUserInvested: IInvestInfo[] = [];
  for (let i = 0; i < 128; i++) {
    const offset = i * 20;
    listUserInvested.push({
      indexOfFundraising: responseView.getUint32(offset, true),
      investedAmount: Number(responseView.getBigUint64(offset + 4, true)),
      claimedAmount: Number(responseView.getBigUint64(offset + 12, true)),
    });
  }

  return {
    listUserInvested,
  };
};

export const getMaxClaimAmount = async (
  investorId: Uint8Array | string,
  indexOfFundraising: number,
): Promise<number> => {
  let investorIdBytes: Uint8Array;
  if (typeof investorId === "string") {
    investorIdBytes = qHelper.getIdentityBytes(investorId);
  } else {
    investorIdBytes = investorId;
  }

  const view = new DataView(new Uint8Array(36).buffer);
  investorIdBytes.forEach((byte, index) => view.setUint8(index, byte));
  view.setUint32(32, indexOfFundraising, true);

  const res = await fetchQuerySC({
    contractIndex: 14,
    inputType: 10,
    inputSize: 36,
    requestData: uint8ArrayToBase64(new Uint8Array(view.buffer)),
  });

  if (!res.responseData) return 0;

  return Number(new DataView(base64ToUint8Array(res.responseData).buffer).getBigUint64(0, true));
};

// Procedures
// 1. registerInTier
// 2. logoutFromTier
// 3. createProject
// 4. voteInProject
// 5. createFundraising
// 6. investInProject
// 7. claimToken
// 8. upgradeTier
// 9. TransferShareManagementRights
export const registerInTier = async (sourceID: string, tierLevel: number, tick: number) => {
  const payload = createPayload([{ data: tierLevel, type: "uint32" }]);
  let txAmount = 0;
  if (tierLevel === 1) {
    txAmount = NOSTROMO_TIER_FACEHUGGER_STAKE_AMOUNT;
  } else if (tierLevel === 2) {
    txAmount = NOSTROMO_TIER_CHESTBURST_STAKE_AMOUNT;
  } else if (tierLevel === 3) {
    txAmount = NOSTROMO_TIER_DOG_STAKE_AMOUNT;
  } else if (tierLevel === 4) {
    txAmount = NOSTROMO_TIER_XENOMORPH_STAKE_AMOUNT;
  } else if (tierLevel === 5) {
    txAmount = NOSTROMO_TIER_WARRIOR_STAKE_AMOUNT;
  }
  return await createSCTx(sourceID, 14, 1, payload.getPackageSize(), txAmount, tick, payload);
};

export const logoutFromTier = async (sourceID: string, tick: number) => {
  return await createSCTx(sourceID, 14, 2, 0, 0, tick);
};

export const createProject = async (
  sourceID: string,
  tokenName: number,
  supply: number,
  startYear: number,
  startMonth: number,
  startDay: number,
  startHour: number,
  endYear: number,
  endMonth: number,
  endDay: number,
  endHour: number,
  tick: number,
) => {
  const payload = createPayload([
    { data: tokenName, type: "bigint64" },
    { data: supply, type: "bigint64" },
    { data: startYear, type: "uint32" },
    { data: startMonth, type: "uint32" },
    { data: startDay, type: "uint32" },
    { data: startHour, type: "uint32" },
    { data: endYear, type: "uint32" },
    { data: endMonth, type: "uint32" },
    { data: endDay, type: "uint32" },
    { data: endHour, type: "uint32" },
  ]);
  return await createSCTx(sourceID, 14, 3, payload.getPackageSize(), NOSTROMO_CREATE_PROJECT_FEE, tick, payload);
};

export const voteInProject = async (sourceID: string, indexOfProject: number, decision: boolean, tick: number) => {
  const payload = createPayload([
    { data: indexOfProject, type: "uint32" },
    { data: decision ? 1 : 0, type: "uint8" },
  ]);
  return await createSCTx(sourceID, 14, 4, payload.getPackageSize(), 0, tick, payload);
};

export const createFundraising = async (
  sourceID: string,
  tokenPrice: number,
  soldAmount: number,
  requiredFunds: number,
  indexOfProject: number,
  firstPhaseStartYear: number,
  firstPhaseStartMonth: number,
  firstPhaseStartDay: number,
  firstPhaseStartHour: number,
  firstPhaseEndYear: number,
  firstPhaseEndMonth: number,
  firstPhaseEndDay: number,
  firstPhaseEndHour: number,
  secondPhaseStartYear: number,
  secondPhaseStartMonth: number,
  secondPhaseStartDay: number,
  secondPhaseStartHour: number,
  secondPhaseEndYear: number,
  secondPhaseEndMonth: number,
  secondPhaseEndDay: number,
  secondPhaseEndHour: number,
  thirdPhaseStartYear: number,
  thirdPhaseStartMonth: number,
  thirdPhaseStartDay: number,
  thirdPhaseStartHour: number,
  thirdPhaseEndYear: number,
  thirdPhaseEndMonth: number,
  thirdPhaseEndDay: number,
  thirdPhaseEndHour: number,
  listingStartYear: number,
  listingStartMonth: number,
  listingStartDay: number,
  listingStartHour: number,
  cliffEndYear: number,
  cliffEndMonth: number,
  cliffEndDay: number,
  cliffEndHour: number,
  vestingEndYear: number,
  vestingEndMonth: number,
  vestingEndDay: number,
  vestingEndHour: number,
  threshold: number,
  TGE: number,
  stepOfVesting: number,
  tick: number,
) => {
  const payload = createPayload([
    { data: tokenPrice, type: "bigint64" },
    { data: soldAmount, type: "bigint64" },
    { data: requiredFunds, type: "bigint64" },
    { data: indexOfProject, type: "uint32" },
    { data: firstPhaseStartYear, type: "uint32" },
    { data: firstPhaseStartMonth, type: "uint32" },
    { data: firstPhaseStartDay, type: "uint32" },
    { data: firstPhaseStartHour, type: "uint32" },
    { data: firstPhaseEndYear, type: "uint32" },
    { data: firstPhaseEndMonth, type: "uint32" },
    { data: firstPhaseEndDay, type: "uint32" },
    { data: firstPhaseEndHour, type: "uint32" },
    { data: secondPhaseStartYear, type: "uint32" },
    { data: secondPhaseStartMonth, type: "uint32" },
    { data: secondPhaseStartDay, type: "uint32" },
    { data: secondPhaseStartHour, type: "uint32" },
    { data: secondPhaseEndYear, type: "uint32" },
    { data: secondPhaseEndMonth, type: "uint32" },
    { data: secondPhaseEndDay, type: "uint32" },
    { data: secondPhaseEndHour, type: "uint32" },
    { data: thirdPhaseStartYear, type: "uint32" },
    { data: thirdPhaseStartMonth, type: "uint32" },
    { data: thirdPhaseStartDay, type: "uint32" },
    { data: thirdPhaseStartHour, type: "uint32" },
    { data: thirdPhaseEndYear, type: "uint32" },
    { data: thirdPhaseEndMonth, type: "uint32" },
    { data: thirdPhaseEndDay, type: "uint32" },
    { data: thirdPhaseEndHour, type: "uint32" },
    { data: listingStartYear, type: "uint32" },
    { data: listingStartMonth, type: "uint32" },
    { data: listingStartDay, type: "uint32" },
    { data: listingStartHour, type: "uint32" },
    { data: cliffEndYear, type: "uint32" },
    { data: cliffEndMonth, type: "uint32" },
    { data: cliffEndDay, type: "uint32" },
    { data: cliffEndHour, type: "uint32" },
    { data: vestingEndYear, type: "uint32" },
    { data: vestingEndMonth, type: "uint32" },
    { data: vestingEndDay, type: "uint32" },
    { data: vestingEndHour, type: "uint32" },
    { data: threshold, type: "uint8" },
    { data: TGE, type: "uint8" },
    { data: stepOfVesting, type: "uint8" },
  ]);
  return await createSCTx(sourceID, 14, 5, payload.getPackageSize(), NOSTROMO_QX_TOKEN_ISSUANCE_FEE, tick, payload);
};

export const investInProject = async (sourceID: string, indexOfFundraising: number, amount: number, tick: number) => {
  const payload = createPayload([{ data: indexOfFundraising, type: "uint32" }]);
  return await createSCTx(sourceID, 14, 6, payload.getPackageSize(), amount, tick, payload);
};

export const claimToken = async (sourceID: string, amount: number, indexOfFundraising: number, tick: number) => {
  const payload = createPayload([
    { data: amount, type: "bigint64" },
    { data: indexOfFundraising, type: "uint32" },
  ]);
  return await createSCTx(sourceID, 14, 7, payload.getPackageSize(), 0, tick, payload);
};

export const upgradeTier = async (sourceID: string, newTierLevel: number, deltaTierAmount: number, tick: number) => {
  const payload = createPayload([{ data: newTierLevel, type: "uint32" }]);
  return await createSCTx(sourceID, 14, 8, payload.getPackageSize(), deltaTierAmount, tick, payload);
};

export const transferShareManagementRights = async (
  sourceID: string,
  asset: IAsset,
  numberOfShares: number,
  newManagingContractIndex: number,
  tick: number,
) => {
  // Create the asset data: 32 bytes for issuer + 8 bytes for assetName
  const assetData = new Uint8Array(40);
  asset.issuer.forEach((byte, index) => (assetData[index] = byte));

  const view = new DataView(assetData.buffer);
  view.setBigUint64(32, BigInt(asset.assetName), true);

  // Create payload manually since createPayload doesn't support bytes type
  const payloadSize = 40 + 8 + 4; // assetData + numberOfShares + newManagingContractIndex
  const payload = new Uint8Array(payloadSize);
  let offset = 0;

  // Copy asset data
  payload.set(assetData, offset);
  offset += 40;

  // Add numberOfShares (8 bytes)
  const sharesView = new DataView(payload.buffer, offset);
  sharesView.setBigUint64(0, BigInt(numberOfShares), true);
  offset += 8;

  // Add newManagingContractIndex (4 bytes)
  const contractView = new DataView(payload.buffer, offset);
  contractView.setUint32(0, newManagingContractIndex, true);

  // Wrap in DynamicPayload
  const dynamicPayload = new DynamicPayload(payloadSize);
  dynamicPayload.setPayload(payload);

  return await createSCTx(sourceID, 14, 9, payloadSize, 100, tick, dynamicPayload);
};

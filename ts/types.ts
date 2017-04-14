import {utils} from 'ts/utils/utils';

export enum MenuItemValue {
    generate,
    fill,
    balances,
    tradeHistory,
}

export enum GenerateOrderSteps {
  ChooseAssets,
  GrantAllowance,
  RemainingConfigs,
  SignTransaction,
  CopyAndShare,
};

export const Side = utils.strEnum([
  'receive',
  'deposit',
]);
export type Side = keyof typeof Side;

export const BlockchainErrs = utils.strEnum([
  'A_CONTRACT_NOT_DEPLOYED_ON_NETWORK',
  'DISCONNECTED_FROM_ETHEREUM_NODE',
  'UNHANDLED_ERROR',
]);
export type BlockchainErrs = keyof typeof BlockchainErrs;

export const ProviderTypes = utils.strEnum([
  'injectedWeb3',
  'publicNode',
]);
export type ProviderTypes = keyof typeof ProviderTypes;

export const Direction = utils.strEnum([
  'forward',
  'backward',
]);
export type Direction = keyof typeof Direction;

export interface Token {
    iconUrl?: string;
    name?: string;
    address?: string;
    symbol?: string;
    balance?: number;
    allowance?: number;
};
export interface TokenBySymbol {
    [symbol: string]: Token;
};

export interface AssetToken {
    symbol: string;
    amount?: number;
}

export interface SideToAssetToken {
    [side: string]: AssetToken;
};

export interface SignatureData {
    hash: string;
    r: string;
    s: string;
    v: number;
};

export interface HashData {
    depositAmount: number;
    depositTokenContractAddr: string;
    feeRecipientAddress: string;
    makerFee: string;
    orderExpiryTimestamp: number;
    orderMakerAddress: string;
    orderTakerAddress: string;
    receiveAmount: number;
    receiveTokenContractAddr: string;
    takerFee: string;
}

export interface Order {
    assetTokens: SideToAssetToken;
    expiry: number;
    signature: SignatureData;
    maker: string;
    taker: string;
}

export interface Fill {
    logIndex: number;
    maker: string;
    taker: string;
    tokenM: string;
    tokenT: string;
    valueM: number;
    valueT: number;
    expiration: number;
    filledValueM: number;
    orderHash: string;
    transactionHash: string;
}

export enum BalanceErrs {
    incorrectNetworkForFaucet,
    faucetRequestFailed,
    faucetQueueIsFull,
    mintingFailed,
    allowanceSettingFailed,
};

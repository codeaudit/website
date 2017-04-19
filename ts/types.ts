import * as _ from 'lodash';
import BigNumber = require('bignumber.js');

// Utility function to create a K:V from a list of strings
// Adapted from: https://basarat.gitbooks.io/typescript/content/docs/types/literal-types.html
function strEnum(values: string[]): {[key: string]: string} {
    return _.reduce(values, (result, key) => {
        result[key] = key;
        return result;
    }, Object.create(null));
}

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

export const Side = strEnum([
  'receive',
  'deposit',
]);
export type Side = keyof typeof Side;

export const BlockchainErrs = strEnum([
  'A_CONTRACT_NOT_DEPLOYED_ON_NETWORK',
  'DISCONNECTED_FROM_ETHEREUM_NODE',
  'UNHANDLED_ERROR',
]);
export type BlockchainErrs = keyof typeof BlockchainErrs;

export const ProviderTypes = strEnum([
  'injectedWeb3',
  'publicNode',
]);
export type ProviderTypes = keyof typeof ProviderTypes;

export const Direction = strEnum([
  'forward',
  'backward',
]);
export type Direction = keyof typeof Direction;

export interface Token {
    iconUrl?: string;
    name?: string;
    address?: string;
    symbol?: string;
    balance?: BigNumber;
    allowance?: BigNumber;
    decimals?: number;
};

export interface TokenBySymbol {
    [symbol: string]: Token;
};

export interface AssetToken {
    symbol: string;
    amount?: BigNumber;
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
    depositAmount: BigNumber;
    depositTokenContractAddr: string;
    feeRecipientAddress: string;
    makerFee: string;
    orderExpiryTimestamp: number;
    orderMakerAddress: string;
    orderTakerAddress: string;
    receiveAmount: BigNumber;
    receiveTokenContractAddr: string;
    takerFee: string;
}

export interface OrderParty {
    address: string;
    token: {
        name: string;
        symbol: string;
        decimals: number;
        address: string;
    };
    amount: string;
}

export interface Order {
    maker: OrderParty;
    taker: OrderParty;
    expiration: number;
    signature: SignatureData;
}

export interface Fill {
    logIndex: number;
    maker: string;
    taker: string;
    tokenM: string;
    tokenT: string;
    valueM: BigNumber;
    valueT: BigNumber;
    expiration: number;
    filledValueM: BigNumber;
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

export const ActionTypes = strEnum([
    'ADD_TOKEN_TO_TOKEN_BY_SYMBOL',
    'BLOCKCHAIN_ERR_ENCOUNTERED',
    'UPDATE_BLOCKCHAIN_IS_LOADED',
    'UPDATE_NETWORK_ID',
    'UPDATE_GENERATE_ORDER_STEP',
    'UPDATE_CHOSEN_ASSET_TOKEN',
    'UPDATE_ORDER_TAKER_ADDRESS',
    'UPDATE_ORDER_SIGNATURE_DATA',
    'UPDATE_TOKEN_BY_SYMBOL',
    'UPDATE_ORDER_EXPIRY',
    'SWAP_ASSET_TOKENS',
    'UPDATE_USER_ADDRESS',
    'UPDATE_USER_ETHER_BALANCE',
    'UPDATE_USER_SUPPLIED_ORDER_CACHE',
    'UPDATE_ORDER_FILL_AMOUNT',
    'UPDATE_SHOULD_BLOCKCHAIN_ERR_DIALOG_BE_OPEN',
]);
export type ActionTypes = keyof typeof ActionTypes;

export interface Action {
    type: ActionTypes;
    data?: any;
}

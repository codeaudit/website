import * as _ from 'lodash';
import * as BigNumber from 'bignumber.js';

// Utility function to create a K:V from a list of strings
// Adapted from: https://basarat.gitbooks.io/typescript/content/docs/types/literal-types.html
function strEnum(values: string[]): {[key: string]: string} {
    return _.reduce(values, (result, key) => {
        result[key] = key;
        return result;
    }, Object.create(null));
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

export const Direction = strEnum([
  'forward',
  'backward',
]);
export type Direction = keyof typeof Direction;

export interface Token {
    iconUrl: string;
    name: string;
    address: string;
    symbol: string;
    balance: BigNumber.BigNumber;
    allowance: BigNumber.BigNumber;
    decimals: number;
};

export interface TokenByAddress {
    [address: string]: Token;
};

export interface AssetToken {
    address?: string;
    amount?: BigNumber.BigNumber;
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
    depositAmount: BigNumber.BigNumber;
    depositTokenContractAddr: string;
    feeRecipientAddress: string;
    makerFee: BigNumber.BigNumber;
    orderExpiryTimestamp: BigNumber.BigNumber;
    orderMakerAddress: string;
    orderTakerAddress: string;
    receiveAmount: BigNumber.BigNumber;
    receiveTokenContractAddr: string;
    takerFee: BigNumber.BigNumber;
    orderSalt: BigNumber.BigNumber;
}

export interface OrderToken {
    name: string;
    symbol: string;
    decimals: number;
    address: string;
}

export interface OrderParty {
    address: string;
    token: OrderToken;
    amount: string;
    feeAmount: string;
}

export interface Order {
    maker: OrderParty;
    taker: OrderParty;
    expiration: string;
    feeRecipient: string;
    salt: string;
    signature: SignatureData;
    exchangeContract: string;
    networkId: number;
}

export interface Fill {
    logIndex: number;
    maker: string;
    taker: string;
    tokenM: string;
    tokenT: string;
    filledValueM: BigNumber.BigNumber;
    filledValueT: BigNumber.BigNumber;
    feeMPaid: BigNumber.BigNumber;
    feeTPaid: BigNumber.BigNumber;
    orderHash: string;
    transactionHash: string;
    blockTimestamp: number;
}

export enum BalanceErrs {
    incorrectNetworkForFaucet,
    faucetRequestFailed,
    faucetQueueIsFull,
    mintingFailed,
    wethConversionFailed,
    allowanceSettingFailed,
};

export const ActionTypes = strEnum([
    'UPDATE_SCREEN_WIDTH',
    'UPDATE_NODE_VERSION',
    'RESET_STATE',
    'ADD_TOKEN_TO_TOKEN_BY_ADDRESS',
    'BLOCKCHAIN_ERR_ENCOUNTERED',
    'CLEAR_TOKEN_BY_ADDRESS',
    'UPDATE_BLOCKCHAIN_IS_LOADED',
    'UPDATE_NETWORK_ID',
    'UPDATE_GENERATE_ORDER_STEP',
    'UPDATE_CHOSEN_ASSET_TOKEN',
    'UPDATE_CHOSEN_ASSET_TOKEN_ADDRESS',
    'UPDATE_ORDER_TAKER_ADDRESS',
    'UPDATE_ORDER_SALT',
    'UPDATE_ORDER_SIGNATURE_DATA',
    'UPDATE_TOKEN_BY_ADDRESS',
    'REPLACE_TOKEN_ALLOWANCE_BY_ADDRESS',
    'UPDATE_TOKEN_BALANCE_BY_ADDRESS',
    'UPDATE_ORDER_EXPIRY',
    'SWAP_ASSET_TOKENS',
    'UPDATE_USER_ADDRESS',
    'UPDATE_USER_ETHER_BALANCE',
    'UPDATE_USER_SUPPLIED_ORDER_CACHE',
    'UPDATE_ORDER_FILL_AMOUNT',
    'UPDATE_SHOULD_BLOCKCHAIN_ERR_DIALOG_BE_OPEN',
    'SHOW_FLASH_MESSAGE',
    'HIDE_FLASH_MESSAGE',
]);
export type ActionTypes = keyof typeof ActionTypes;

export interface Action {
    type: ActionTypes;
    data?: any;
}

export interface CustomTokensByNetworkId {
    [networkId: number]: Token;
}

export interface Styles {
    [name: string]: React.CSSProperties;
}

export interface Profile {
    name: string;
    title: string;
    description: string;
    image: string;
    linkedIn?: string;
    github?: string;
    angellist?: string;
    medium?: string;
    twitter?: string;
}

export interface Partner {
    name: string;
    logo: string;
    url: string;
}

export interface Statistic {
    title: string;
    figure: string;
}

export interface StatisticByKey {
    [key: string]: Statistic;
}

export interface ERC20MarketInfo {
    etherMarketCapUsd: number;
    numLiquidERC20Tokens: number;
    marketCapERC20TokensUsd: number;
}

export const SolidityTypes = strEnum([
  'address',
  'uint256',
  'uint8',
  'string',
  'bool',
]);
export type SolidityTypes = keyof typeof SolidityTypes;

export enum ExchangeContractErrs {
  ERROR_FILL_EXPIRED, // Order has already expired
  ERROR_FILL_NO_VALUE, // Order has already been fully filled or cancelled
  ERROR_FILL_TRUNCATION, // Rounding error too large
  ERROR_FILL_BALANCE_ALLOWANCE, // Insufficient balance or allowance for token transfer
  ERROR_CANCEL_EXPIRED, // Order has already expired
  ERROR_CANCEL_NO_VALUE, // Order has already been fully filled or cancelled
};

export interface ContractResponse {
    logs: ContractEvent[];
}

export interface ContractEvent {
    event: string;
    args: any;
}

export type InputErrMsg = React.ReactNode | string | undefined;
export type ValidatedBigNumberCallback = (isValid: boolean, amount?: BigNumber.BigNumber) => void;
export const ScreenWidths = strEnum([
  'SM',
  'MD',
  'LG',
]);
export type ScreenWidths = keyof typeof ScreenWidths;

export enum AlertTypes {
    ERROR,
    SUCCESS,
}

export const EtherscanLinkSuffixes = strEnum([
  'address',
  'tx',
]);
export type EtherscanLinkSuffixes = keyof typeof EtherscanLinkSuffixes;

export const BlockchainCallErrs = strEnum([
  'CONTRACT_DOES_NOT_EXIST',
  'USER_HAS_NO_ASSOCIATED_ADDRESSES',
  'UNHANDLED_ERROR',
  'TOKEN_ADDRESS_IS_INVALID',
  'INVALID_SIGNATURE',
]);
export type BlockchainCallErrs = keyof typeof BlockchainCallErrs;

export const KindString = strEnum([
  'Constructor',
  'Property',
  'Method',
  'Interface',
  'Type alias',
  'Variable',
  'Function',
]);
export type KindString = keyof typeof KindString;

export enum Environments {
    DEVELOPMENT,
    PRODUCTION,
}

export type ContractInstance = any; // TODO: add type definition for Contract

export interface TypeDocType {
    type: string;
    value: string;
    name: string;
    types: TypeDocType[];
    typeArguments?: TypeDocType[];
    declaration: TypeDocNode;
    elementType?: TypeDocType;
}

export interface TypeDocFlags {
    isStatic?: boolean;
    isOptional?: boolean;
}

export interface TypeDocNode {
    id?: string;
    name?: string;
    kind?: string;
    defaultValue?: string;
    kindString?: string;
    type?: TypeDocType;
    fileName?: string;
    line?: number;
    comment?: TypeDocNode;
    text?: string;
    shortText?: string;
    returns?: string;
    declaration: TypeDocNode;
    flags?: TypeDocFlags;
    indexSignature?: TypeDocNode[];
    signatures?: TypeDocNode[];
    parameters?: TypeDocNode[];
    sources?: TypeDocNode[];
    children?: TypeDocNode[];
}

export const TypeDocTypes = strEnum([
  'intrinsic',
  'reference',
  'array',
  'stringLiteral',
  'reflection',
  'union',
]);
export type TypeDocTypes = keyof typeof TypeDocTypes;

export const DocSections = strEnum([
  'introduction',
  'async',
  'errors',
  'versioning',
  'zeroEx',
  'exchange',
  'token',
  'tokenRegistry',
  'types',
]);
export type DocSections = keyof typeof DocSections;

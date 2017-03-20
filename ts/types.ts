import {utils} from 'ts/utils/utils';

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
  'CONTRACT_NOT_DEPLOYED_ON_NETWORK',
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
    iconUrl: string;
    name: string;
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
    hash: string,
    r: string;
    s: string;
    v: number;
};

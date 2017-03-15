import {utils} from 'ts/utils/utils';

export enum GenerateOrderSteps {
  ChooseAssets,
  GrantAllowance,
};

export const Side = utils.strEnum([
  'receive',
  'deposit',
]);
export type Side = keyof typeof Side;

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
    amount: number;
}

export interface SideToAssetToken {
    [side: string]: AssetToken;
};

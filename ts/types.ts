import {utils} from 'ts/utils/utils';

export const generateOrderSteps = utils.strEnum([
  'chooseAssets',
  'grantAllowance',
]);
export type generateOrderSteps = keyof typeof generateOrderSteps;

export const Side = utils.strEnum([
  'receive',
  'deposit',
]);
export type Side = keyof typeof generateOrderSteps;

export interface Token {
    iconUrl: string;
    name: string;
};
export interface TokenBySymbol {
    [symbol: string]: Token;
};

export interface AssetToken {
    side: Side;
    symbol: string;
    amount: number;
}

export interface SideToAssetToken {
    [side: string]: AssetToken;
};

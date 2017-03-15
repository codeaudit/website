import {utils} from 'ts/utils/utils';
import {generateOrderSteps, Side, AssetToken} from 'ts/types';

export interface Action {
    type: actionTypes;
    data?: any;
}

export const actionTypes = utils.strEnum([
  'UPDATE_GENERATE_ORDER_STEP',
  'UPDATE_CHOSEN_ASSET_TOKEN_SYMBOL',
  'SWAP_ASSET_TOKEN_SYMBOLS',
]);
export type actionTypes = keyof typeof actionTypes;

export function updateGenerateOrderStep(step: generateOrderSteps): Action {
    return {
        data: step,
        type: actionTypes.UPDATE_GENERATE_ORDER_STEP,
    };
};

export function updateChosenAssetTokenSymbol(token: AssetToken): Action {
    return {
        data: token,
        type: actionTypes.UPDATE_CHOSEN_ASSET_TOKEN_SYMBOL,
    };
};

export function swapAssetTokenSymbols(): Action {
    return {
        type: actionTypes.SWAP_ASSET_TOKEN_SYMBOLS,
    };
};

import {utils} from 'ts/utils/utils';
import {Direction, Side, AssetToken, BlockchainErrs, SignatureData} from 'ts/types';

export interface Action {
    type: actionTypes;
    data?: any;
}

export const actionTypes = utils.strEnum([
    'BLOCKCHAIN_ERR_ENCOUNTERED',
    'UPDATE_BLOCKCHAIN_LOADING',
    'UPDATE_NETWORK_ID',
    'UPDATE_GENERATE_ORDER_STEP',
    'UPDATE_CHOSEN_ASSET_TOKEN',
    'UPDATE_ORDER_TAKER_ADDRESS',
    'UPDATE_ORDER_SIGNATURE_DATA',
    'UPDATE_ORDER_EXPIRY',
    'SWAP_ASSET_TOKENS',
]);
export type actionTypes = keyof typeof actionTypes;

/*
 * Blockchain action creators
 */

export function updateNetworkId(networkId: number): Action {
    return {
         data: networkId,
        type: actionTypes.UPDATE_NETWORK_ID,
     };
};

export function encounteredBlockchainError(blockchainErr: BlockchainErrs): Action {
    return {
         data: blockchainErr,
        type: actionTypes.BLOCKCHAIN_ERR_ENCOUNTERED,
     };
};

export function updateBlockchainLoading(isLoaded: boolean): Action {
    return {
         data: isLoaded,
        type: actionTypes.UPDATE_BLOCKCHAIN_LOADING,
     };
};

export function updateSignatureData(signatureData: SignatureData): Action {
    return {
         data: signatureData,
        type: actionTypes.UPDATE_ORDER_SIGNATURE_DATA,
     };
};

/*
 * Order generation acton creators
 */
export function updateGenerateOrderStep(direction: Direction): Action {
    return {
        data: direction,
        type: actionTypes.UPDATE_GENERATE_ORDER_STEP,
    };
};

export function updateChosenAssetToken(side: Side, token: AssetToken): Action {
    return {
        data: {
            side,
            token,
        },
        type: actionTypes.UPDATE_CHOSEN_ASSET_TOKEN,
    };
};

export function swapAssetTokenSymbols(): Action {
    return {
        type: actionTypes.SWAP_ASSET_TOKENS,
    };
};

export function updateOrderExpiry(unixTimestampSec: number): Action {
    return {
        data: unixTimestampSec,
        type: actionTypes.UPDATE_ORDER_EXPIRY,
    };
};

export function updateOrderTakerAddress(taker: string): Action {
    return {
        data: taker,
        type: actionTypes.UPDATE_ORDER_TAKER_ADDRESS,
    };
};

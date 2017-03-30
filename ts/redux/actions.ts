import {utils} from 'ts/utils/utils';
import {
    Direction,
    Side,
    AssetToken,
    BlockchainErrs,
    SignatureData,
    Token,
} from 'ts/types';

export interface Action {
    type: actionTypes;
    data?: any;
}

export const actionTypes = utils.strEnum([
    'BLOCKCHAIN_ERR_ENCOUNTERED',
    'UPDATE_BLOCKCHAIN_IS_LOADED',
    'UPDATE_NETWORK_ID',
    'UPDATE_GENERATE_ORDER_STEP',
    'UPDATE_CHOSEN_ASSET_TOKEN',
    'UPDATE_ORDER_ADDRESS',
    'UPDATE_ORDER_SIGNATURE_DATA',
    'UPDATE_TOKEN_BY_SYMBOL',
    'UPDATE_ORDER_EXPIRY',
    'SWAP_ASSET_TOKENS',
    'UPDATE_USER_ETHER_BALANCE',
    'UPDATE_ORDER_FILL_AMOUNT',
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

export function updateUserEtherBalance(balance: number): Action {
    return {
         data: balance,
        type: actionTypes.UPDATE_USER_ETHER_BALANCE,
     };
};

export function encounteredBlockchainError(blockchainErr: BlockchainErrs): Action {
    return {
         data: blockchainErr,
        type: actionTypes.BLOCKCHAIN_ERR_ENCOUNTERED,
     };
};

export function updateBlockchainIsLoaded(isLoaded: boolean): Action {
    return {
         data: isLoaded,
        type: actionTypes.UPDATE_BLOCKCHAIN_IS_LOADED,
     };
};

export function updateSignatureData(signatureData: SignatureData): Action {
    return {
         data: signatureData,
        type: actionTypes.UPDATE_ORDER_SIGNATURE_DATA,
     };
};

export function updateTokenBySymbol(tokens: Token[]): Action {
    return {
         data: tokens,
        type: actionTypes.UPDATE_TOKEN_BY_SYMBOL,
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

export function updateOrderAddress(side: Side, address: string): Action {
    return {
        data: {
            side,
            address,
        },
        type: actionTypes.UPDATE_ORDER_ADDRESS,
    };
};

/*
 * Order Fill action creators
 */

 export function updateOrderFillAmount(amount: number): Action {
     return {
         data: amount,
         type: actionTypes.UPDATE_ORDER_FILL_AMOUNT,
     };
 };

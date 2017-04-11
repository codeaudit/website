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
    'ADD_TOKEN_TO_TOKEN_BY_SYMBOL',
    'ADD_TO_HISTORICAL_FILLS',
    'CLEAR_HISTORICAL_FILLS',
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
    'UPDATE_ORDER_FILL_AMOUNT',
    'UPDATE_SHOULD_BLOCKCHAIN_ERR_DIALOG_BE_OPEN',
]);
export type actionTypes = keyof typeof actionTypes;

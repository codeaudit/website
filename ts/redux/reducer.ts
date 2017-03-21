import * as _ from 'lodash';
import {utils} from 'ts/utils/utils';
import {
    GenerateOrderSteps,
    TokenBySymbol,
    AssetToken,
    Side,
    SideToAssetToken,
    Direction,
    BlockchainErrs,
    SignatureData,
} from 'ts/types';
import {Action, actionTypes} from 'ts/redux/actions';

export interface State {
    blockchainErr: BlockchainErrs;
    blockchainIsLoaded: boolean;
    generateOrderStep: GenerateOrderSteps;
    networkId: number;
    orderExpiryTimestamp: number;
    orderMakerAddress: string;
    orderTakerAddress: string;
    orderSignatureData: SignatureData;
    sideToAssetToken: SideToAssetToken;
};

const INITIAL_STATE: State = {
    blockchainErr: '',
    blockchainIsLoaded: false,
    generateOrderStep: GenerateOrderSteps.ChooseAssets,
    networkId: null,
    orderExpiryTimestamp: utils.initialOrderExpiryUnixTimestampSec(),
    orderMakerAddress: '',
    orderSignatureData: {
        hash: '',
        r: '',
        s: '',
        v: 27,
    },
    orderTakerAddress: '',
    sideToAssetToken: {
        [Side.deposit]: {
            amount: 30,
            symbol: 'WETH',
        },
        [Side.receive]: {
            amount: 60,
            symbol: 'FDGX',
        },
    },
};

export function reducer(state: State = INITIAL_STATE, action: Action) {
    let newSideToAssetToken: SideToAssetToken;
    switch (action.type) {
        case actionTypes.UPDATE_ORDER_SIGNATURE_DATA:
            return _.assign({}, state, {
                orderSignatureData: action.data,
            });

        case actionTypes.UPDATE_BLOCKCHAIN_IS_LOADED:
            return _.assign({}, state, {
                blockchainIsLoaded: action.data,
            });

        case actionTypes.BLOCKCHAIN_ERR_ENCOUNTERED:
            return _.assign({}, state, {
                blockchainErr: action.data,
            });

        case actionTypes.UPDATE_NETWORK_ID:
            return _.assign({}, state, {
                networkId: action.data,
            });

        case actionTypes.UPDATE_GENERATE_ORDER_STEP:
            const direction = action.data;
            let nextGenerateOrderStep = state.generateOrderStep;
            if (direction === Direction.forward) {
                nextGenerateOrderStep += 1;
            } else if (state.generateOrderStep !== 0) {
                nextGenerateOrderStep -= 1;
            }
            return _.assign({}, state, {
                generateOrderStep: nextGenerateOrderStep,
            });

        case actionTypes.UPDATE_CHOSEN_ASSET_TOKEN:
            newSideToAssetToken = _.assign({}, state.sideToAssetToken, {
                [action.data.side]: action.data.token,
            });
            return _.assign({}, state, {
                sideToAssetToken: newSideToAssetToken,
            });

        case actionTypes.SWAP_ASSET_TOKENS:
            newSideToAssetToken = _.assign({}, state.sideToAssetToken, {
                [Side.deposit]: state.sideToAssetToken[Side.receive],
                [Side.receive]: state.sideToAssetToken[Side.deposit],
            });
            return _.assign({}, state, {
                sideToAssetToken: newSideToAssetToken,
            });

        case actionTypes.UPDATE_ORDER_EXPIRY:
            return _.assign({}, state, {
                orderExpiryTimestamp: action.data,
            });

        case actionTypes.UPDATE_ORDER_ADDRESS:
            if (action.data.side === Side.deposit) {
                return _.assign({}, state, {
                    orderMarketAddress: action.data.address,
                });
            } else {
                return _.assign({}, state, {
                    orderTakerAddress: action.data.address,
                });
            }

        default:
            return state;
    }
}

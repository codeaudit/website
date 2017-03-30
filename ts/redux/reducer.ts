import * as _ from 'lodash';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {Action, actionTypes} from 'ts/redux/actions';
import {
    GenerateOrderSteps,
    Side,
    SideToAssetToken,
    Direction,
    BlockchainErrs,
    SignatureData,
    TokenBySymbol,
} from 'ts/types';

export interface State {
    blockchainErr: BlockchainErrs;
    blockchainIsLoaded: boolean;
    generateOrderStep: GenerateOrderSteps;
    networkId: number;
    orderExpiryTimestamp: number;
    orderFillAmount: number;
    orderMakerAddress: string;
    orderTakerAddress: string;
    orderSignatureData: SignatureData;
    sideToAssetToken: SideToAssetToken;
    tokenBySymbol: TokenBySymbol;
    userEtherBalance: number;
};

const tokenSymbols = _.keys(constants.iconUrlBySymbol);
const initialTokenBySymbol = _.reduce(constants.iconUrlBySymbol, (result, iconUrl, symbol) => {
    result[symbol] = {
        iconUrl,
    };
    return result;
}, Object.create(null));
const INITIAL_STATE: State = {
    blockchainErr: '',
    blockchainIsLoaded: false,
    generateOrderStep: GenerateOrderSteps.ChooseAssets,
    networkId: undefined,
    orderExpiryTimestamp: utils.initialOrderExpiryUnixTimestampSec(),
    orderFillAmount: undefined,
    orderMakerAddress: undefined,
    orderSignatureData: {
        hash: '',
        r: '',
        s: '',
        v: 27,
    },
    orderTakerAddress: '',
    sideToAssetToken: {
        [Side.deposit]: {
            symbol: tokenSymbols[0],
        },
        [Side.receive]: {
            symbol: tokenSymbols[1],
        },
    },
    tokenBySymbol: initialTokenBySymbol,
    userEtherBalance: 0,
};

export function reducer(state: State = INITIAL_STATE, action: Action) {
    let newSideToAssetToken: SideToAssetToken;
    switch (action.type) {
        case actionTypes.UPDATE_ORDER_FILL_AMOUNT:
            return _.assign({}, state, {
                orderFillAmount: action.data,
            });

        case actionTypes.UPDATE_USER_ETHER_BALANCE:
            return _.assign({}, state, {
                userEtherBalance: action.data,
            });

        case actionTypes.UPDATE_TOKEN_BY_SYMBOL:
            const tokenBySymbol = state.tokenBySymbol;
            _.each(action.data, (token) => {
                const updatedToken = _.assign({}, tokenBySymbol[token.symbol], token);
                tokenBySymbol[token.symbol] = updatedToken;
            });
            return _.assign({}, state, {
                tokenBySymbol,
            });

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
                    orderMakerAddress: action.data.address,
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

import * as _ from 'lodash';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {
    GenerateOrderSteps,
    Side,
    SideToAssetToken,
    Direction,
    BlockchainErrs,
    SignatureData,
    TokenBySymbol,
    Order,
    Action,
    ActionTypes,
} from 'ts/types';
import {customTokenStorage} from 'ts/local_storage/custom_token_storage';
import BigNumber = require('bignumber.js');

export interface State {
    blockchainErr: BlockchainErrs;
    blockchainIsLoaded: boolean;
    generateOrderStep: GenerateOrderSteps;
    networkId: number;
    orderExpiryTimestamp: number;
    orderFillAmount: BigNumber;
    orderTakerAddress: string;
    orderSignatureData: SignatureData;
    shouldBlockchainErrDialogBeOpen: boolean;
    sideToAssetToken: SideToAssetToken;
    tokenBySymbol: TokenBySymbol;
    userAddress: string;
    userEtherBalance: number;
    // Note: cache of supplied orderJSON in fill order step. Do not use for anything else.
    userSuppliedOrderCache: Order;
};

const tokenSymbols = _.keys(constants.iconUrlBySymbol);
const INITIAL_STATE: State = {
    blockchainErr: '',
    blockchainIsLoaded: false,
    generateOrderStep: GenerateOrderSteps.ChooseAssets,
    networkId: undefined,
    orderExpiryTimestamp: utils.initialOrderExpiryUnixTimestampSec(),
    orderFillAmount: undefined,
    orderSignatureData: {
        hash: '',
        r: '',
        s: '',
        v: 27,
    },
    orderTakerAddress: '',
    shouldBlockchainErrDialogBeOpen: false,
    sideToAssetToken: {
        [Side.deposit]: {
            symbol: tokenSymbols[0],
        },
        [Side.receive]: {
            symbol: tokenSymbols[1],
        },
    },
    tokenBySymbol: getInitialTokenBySymbol(),
    userAddress: '',
    userEtherBalance: 0,
    userSuppliedOrderCache: undefined,
};

function getInitialTokenBySymbol() {
    const initialTokenBySymbol = _.reduce(constants.iconUrlBySymbol, (result, iconUrl, symbol) => {
        result[symbol] = {
            iconUrl,
        };
        return result;
    }, Object.create(null));
    const customTokens = customTokenStorage.getCustomTokens();
    _.each(customTokens, (token) => {
        initialTokenBySymbol[token.symbol] = token;
    });
    return initialTokenBySymbol;
}

export function reducer(state: State = INITIAL_STATE, action: Action) {
    let newSideToAssetToken: SideToAssetToken;
    switch (action.type) {
        case ActionTypes.UPDATE_ORDER_FILL_AMOUNT:
            return _.assign({}, state, {
                orderFillAmount: action.data,
            });

        case ActionTypes.UPDATE_SHOULD_BLOCKCHAIN_ERR_DIALOG_BE_OPEN:
            return _.assign({}, state, {
                shouldBlockchainErrDialogBeOpen: action.data,
            });

        case ActionTypes.UPDATE_USER_ETHER_BALANCE:
            return _.assign({}, state, {
                userEtherBalance: action.data,
            });

        case ActionTypes.UPDATE_USER_SUPPLIED_ORDER_CACHE:
            return _.assign({}, state, {
                userSuppliedOrderCache: action.data,
            });

        case ActionTypes.ADD_TOKEN_TO_TOKEN_BY_SYMBOL:
            const newTokenBySymbol = state.tokenBySymbol;
            newTokenBySymbol[action.data.symbol] = action.data;
            return _.assign({}, state, {
                tokenBySymbol: newTokenBySymbol,
            });

        case ActionTypes.UPDATE_TOKEN_BY_SYMBOL:
            const tokenBySymbol = state.tokenBySymbol;
            const tokens = action.data;
            _.each(tokens, (token) => {
                const updatedToken = _.assign({}, tokenBySymbol[token.symbol], token);
                tokenBySymbol[token.symbol] = updatedToken;
            });
            return _.assign({}, state, {
                tokenBySymbol,
            });

        case ActionTypes.UPDATE_ORDER_SIGNATURE_DATA:
            return _.assign({}, state, {
                orderSignatureData: action.data,
            });

        case ActionTypes.UPDATE_BLOCKCHAIN_IS_LOADED:
            return _.assign({}, state, {
                blockchainIsLoaded: action.data,
            });

        case ActionTypes.BLOCKCHAIN_ERR_ENCOUNTERED:
            return _.assign({}, state, {
                blockchainErr: action.data,
            });

        case ActionTypes.UPDATE_NETWORK_ID:
            return _.assign({}, state, {
                networkId: action.data,
            });

        case ActionTypes.UPDATE_GENERATE_ORDER_STEP:
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

        case ActionTypes.UPDATE_CHOSEN_ASSET_TOKEN:
            newSideToAssetToken = _.assign({}, state.sideToAssetToken, {
                [action.data.side]: action.data.token,
            });
            return _.assign({}, state, {
                sideToAssetToken: newSideToAssetToken,
            });

        case ActionTypes.SWAP_ASSET_TOKENS:
            newSideToAssetToken = _.assign({}, state.sideToAssetToken, {
                [Side.deposit]: state.sideToAssetToken[Side.receive],
                [Side.receive]: state.sideToAssetToken[Side.deposit],
            });
            return _.assign({}, state, {
                sideToAssetToken: newSideToAssetToken,
            });

        case ActionTypes.UPDATE_ORDER_EXPIRY:
            return _.assign({}, state, {
                orderExpiryTimestamp: action.data,
            });

        case ActionTypes.UPDATE_ORDER_TAKER_ADDRESS:
            return _.assign({}, state, {
                orderTakerAddress: action.data,
            });

        case ActionTypes.UPDATE_USER_ADDRESS:
            return _.assign({}, state, {
                userAddress: action.data,
            });

        default:
            return state;
    }
}

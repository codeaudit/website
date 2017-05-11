import * as _ from 'lodash';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {zeroEx} from 'ts/utils/zero_ex';
import {
    GenerateOrderSteps,
    Side,
    SideToAssetToken,
    Direction,
    BlockchainErrs,
    SignatureData,
    TokenByAddress,
    Order,
    Action,
    ActionTypes,
    ScreenWidths,
} from 'ts/types';
import * as DummyTokenAArtifacts from '../contracts/DummyTokenA.json';
import * as DummyTokenBArtifacts from '../contracts/DummyTokenB.json';
import * as DummyEtherTokenArtifacts from '../contracts/DummyEtherToken.json';
import BigNumber = require('bignumber.js');

export interface State {
    blockchainErr: BlockchainErrs;
    blockchainIsLoaded: boolean;
    generateOrderStep: GenerateOrderSteps;
    networkId: number;
    orderExpiryTimestamp: BigNumber;
    orderFillAmount: BigNumber;
    orderTakerAddress: string;
    orderSignatureData: SignatureData;
    orderSalt: BigNumber;
    screenWidth: ScreenWidths;
    shouldBlockchainErrDialogBeOpen: boolean;
    sideToAssetToken: SideToAssetToken;
    tokenByAddress: TokenByAddress;
    userAddress: string;
    userEtherBalance: number;
    // Note: cache of supplied orderJSON in fill order step. Do not use for anything else.
    userSuppliedOrderCache: Order;
};

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
    orderSalt: zeroEx.generateSalt(),
    screenWidth: utils.getScreenWidth(),
    shouldBlockchainErrDialogBeOpen: false,
    sideToAssetToken: {
        [Side.deposit]: {},
        [Side.receive]: {},
    },
    tokenByAddress: {},
    userAddress: '',
    userEtherBalance: 0,
    userSuppliedOrderCache: undefined,
};

export function reducer(state: State = INITIAL_STATE, action: Action) {
    let newSideToAssetToken: SideToAssetToken;
    switch (action.type) {
        case ActionTypes.RESET_STATE:
            return INITIAL_STATE;

        case ActionTypes.UPDATE_ORDER_SALT:
            return _.assign({}, state, {
                orderSalt: action.data,
            });

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

        case ActionTypes.CLEAR_TOKEN_BY_ADDRESS:
            return _.assign({}, state, {
                tokenByAddress: {},
            });

        case ActionTypes.ADD_TOKEN_TO_TOKEN_BY_ADDRESS:
            const newTokenByAddress = state.tokenByAddress;
            newTokenByAddress[action.data.address] = action.data;
            return _.assign({}, state, {
                tokenByAddress: newTokenByAddress,
            });

        case ActionTypes.UPDATE_TOKEN_BY_ADDRESS:
            const tokenByAddress = state.tokenByAddress;
            const tokens = action.data;
            _.each(tokens, (token) => {
                const updatedToken = _.assign({}, tokenByAddress[token.address], token);
                tokenByAddress[token.address] = updatedToken;
            });
            return _.assign({}, state, {
                tokenByAddress,
            });

        case ActionTypes.UPDATE_ORDER_SIGNATURE_DATA:
            return _.assign({}, state, {
                orderSignatureData: action.data,
            });

        case ActionTypes.UPDATE_SCREEN_WIDTH:
            return _.assign({}, state, {
                screenWidth: action.data,
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

        case ActionTypes.UPDATE_CHOSEN_ASSET_TOKEN_ADDRESS:
            const newAssetToken = state.sideToAssetToken[action.data.side];
            newAssetToken.address = action.data.address;
            newSideToAssetToken = _.assign({}, state.sideToAssetToken, {
                [action.data.side]: newAssetToken,
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

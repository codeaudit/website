import * as _ from 'lodash';
import {
    GenerateOrderSteps,
    TokenBySymbol,
    AssetToken,
    Side,
    SideToAssetToken,
    Direction,
} from 'ts/types';
import {Action, actionTypes} from 'ts/redux/actions';

export interface State {
    generateOrderStep: GenerateOrderSteps;
    tokenBySymbol: TokenBySymbol;
    sideToAssetToken: SideToAssetToken;
};

const INITIAL_STATE: State = {
    generateOrderStep: GenerateOrderSteps.ChooseAssets,
    sideToAssetToken: {
        [Side.deposit]: {
            amount: 30.0,
            symbol: 'WETH',
        },
        [Side.receive]: {
            amount: 60.0,
            symbol: 'FDGX',
        },
    },
    tokenBySymbol: {
        FBTC: {
            iconUrl: '/images/token_icons/btc.png',
            name: 'Fake BTC',
        },
        FDGX: {
            iconUrl: '/images/token_icons/digixdao.png',
            name: 'Fake DigixDao',
        },
        TA: {
            iconUrl: '/images/token_icons/clams.png',
            name: 'Token A',
        },
        WETH: {
            iconUrl: '/images/token_icons/ether.png',
            name: 'W-Ether',
        },
    },
};

export function reducer(state: State = INITIAL_STATE, action: Action) {
    let newSideToAssetToken: SideToAssetToken;
    switch (action.type) {
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

    default:
        return state;
    }
}

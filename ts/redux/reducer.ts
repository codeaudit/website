import * as _ from 'lodash';
import {generateOrderSteps} from 'ts/enums';
import {Action, actionTypes} from 'ts/redux/actions';

export interface State {
    generateOrderStep: generateOrderSteps;
};

const INITIAL_STATE: State = {
    generateOrderStep: generateOrderSteps.chooseAssets,
};

export function reducer(state: State = INITIAL_STATE, action: Action) {
    switch (action.type) {
    case actionTypes.UPDATE_GENERATE_ORDER_STEP:
        return _.assign({}, state, {
            generateOrderStep: action.data,
        });

    default:
        return state;
    }
}

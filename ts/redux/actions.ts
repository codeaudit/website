import {utils} from 'ts/utils/utils';
import {generateOrderSteps} from 'ts/enums';

export interface Action {
    type: actionTypes;
    data?: any;
}

export const actionTypes = utils.strEnum([
  'UPDATE_GENERATE_ORDER_STEP',
]);
export type actionTypes = keyof typeof actionTypes;

export function updateGenerateOrderStep(step: generateOrderSteps): Action {
    return {
        data: step,
        type: actionTypes.UPDATE_GENERATE_ORDER_STEP,
    };
};

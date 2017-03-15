import {utils} from 'ts/utils/utils';

export const generateOrderSteps = utils.strEnum([
  'chooseAssets',
  'grantAllowance',
]);
export type generateOrderSteps = keyof typeof generateOrderSteps;

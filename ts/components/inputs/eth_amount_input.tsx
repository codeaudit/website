import * as BigNumber from 'bignumber.js';
import * as _ from 'lodash';
import * as React from 'React';
import {FailableBigNumberCallback, InputErrorMsg} from 'ts/types';
import {BalanceBoundedInput} from 'ts/components/inputs/balance_bounded_amount_input';
import {zeroEx} from 'ts/utils/zero_ex';
import {constants} from 'ts/utils/constants';

interface EthAmountInputProps {
    label: string;
    balance: BigNumber;
    onChange: FailableBigNumberCallback;
}

interface EthAmountInputState {}

export class EthAmountInput extends React.Component<EthAmountInputProps, EthAmountInputState> {
    public render() {
        return (
            <div className="flex overflow-hidden" style={{height: 84}}>
                <BalanceBoundedInput
                    label={this.props.label}
                    balance={this.props.balance}
                    onChange={this.onChange}
                />
                <div style={{paddingTop: 44}}>
                    ETH
                </div>
            </div>
        );
    }
    private onChange(errorMsg: InputErrorMsg, amount: BigNumber) {
        if (!_.isUndefined(errorMsg)) {
            this.props.onChange(errorMsg);
        } else {
            const weiAmount = zeroEx.toBaseUnitAmount(Number(amount), constants.ETH_DECIMAL_PLACES);
            this.props.onChange(null, weiAmount);
        }
    }
}

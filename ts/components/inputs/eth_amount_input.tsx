import * as BigNumber from 'bignumber.js';
import * as _ from 'lodash';
import * as React from 'React';
import {FailableNumericCallback, InputErrorMsg} from '../../types';
import {UpperBoundedNumericInput} from 'ts/components/inputs/upper_bounded_numeric_input';
import {zeroEx} from 'ts/utils/zero_ex';
import {constants} from 'ts/utils/constants';

interface EthAmountInputProps {
    label: string;
    balance: BigNumber;
    checkBalance?: boolean;
    onChange: FailableNumericCallback;
}

export class EthAmountInput extends React.Component<EthAmountInputProps, {}> {
    public static defaultProps: Partial<EthAmountInputProps> = {
        checkBalance: true,
    };
    public render() {
        return (
            <div className="flex overflow-hidden" style={{height: 84}}>
                <UpperBoundedNumericInput
                    label={this.props.label}
                    balance={this.props.balance}
                    onChange={this.onChange}
                    checkBalance={this.props.checkBalance}
                />
                <div style={{paddingTop: 44}}>
                    ETH
                </div>
            </div>
        );
    }
    private onChange(error: InputErrorMsg, amount: BigNumber) {
        if (!_.isNull(error)) {
            this.props.onChange(error);
        } else {
            const weiAmount = zeroEx.toBaseUnitAmount(Number(amount), constants.ETH_DECIMAL_PLACES);
            this.props.onChange(null, weiAmount);
        }
    }
}

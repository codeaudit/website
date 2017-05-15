import * as BigNumber from 'bignumber.js';
import * as _ from 'lodash';
import * as React from 'React';
import {FailableBigNumberCallback, InputErrMsg} from 'ts/types';
import {BalanceBoundedInput} from 'ts/components/inputs/balance_bounded_input';
import {zeroEx} from 'ts/utils/zero_ex';
import {constants} from 'ts/utils/constants';

interface EthAmountInputProps {
    label: string;
    balance: BigNumber;
    amount?: BigNumber;
    onChange: FailableBigNumberCallback;
    shouldShowIncompleteErrs: boolean;
    onBeforeBalanceIncreaseClick?: () => void;
}

interface EthAmountInputState {}

export class EthAmountInput extends React.Component<EthAmountInputProps, EthAmountInputState> {
    public render() {
        const amount = this.props.amount ?
            zeroEx.toUnitAmount(this.props.amount, constants.ETH_DECIMAL_PLACES) :
            undefined;
        return (
            <div className="flex overflow-hidden" style={{height: 84}}>
                <BalanceBoundedInput
                    label={this.props.label}
                    balance={this.props.balance}
                    amount={amount}
                    onChange={this.onChange.bind(this)}
                    shouldCheckBalance={true}
                    shouldShowIncompleteErrs={this.props.shouldShowIncompleteErrs}
                    onBeforeBalanceIncreaseClick={this.props.onBeforeBalanceIncreaseClick}
                />
                <div style={{paddingTop: 44}}>
                    ETH
                </div>
            </div>
        );
    }
    private onChange(amount?: BigNumber) {
        if (!_.isUndefined(amount)) {
            amount = zeroEx.toBaseUnitAmount(amount, constants.ETH_DECIMAL_PLACES);
        }
        this.props.onChange(amount);
    }
}

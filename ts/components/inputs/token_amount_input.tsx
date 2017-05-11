import {Token, InputErrorMsg, FailableBigNumberCallback} from '../../types';
import * as React from 'react';
import * as _ from 'lodash';
import * as BigNumber from 'bignumber.js';
import {BalanceBoundedInput} from 'ts/components/inputs/balance_bounded_amount_input';
import {zeroEx} from 'ts/utils/zero_ex';
import {constants} from 'ts/utils/constants';
import {colors} from 'material-ui/styles';
import {Link} from 'react-router-dom';

interface TokenAmountInputProps {
    label: string;
    token: Token;
    shouldShowIncompleteErrs: boolean;
    onChange: FailableBigNumberCallback;
}

interface  TokenAmountInputState {};

export class TokenAmountInput extends React.Component<TokenAmountInputProps, TokenAmountInputState> {
    public render() {
        return (
            <div className="flex overflow-hidden" style={{height: 84}}>
                <BalanceBoundedInput
                    label={this.props.label}
                    balance={zeroEx.toUnitAmount(this.props.token.balance, this.props.token.decimals)}
                    onChange={this.onChange.bind(this)}
                    validate={this.validate.bind(this)}
                />
                <div style={{paddingTop: 44}}>
                    {this.props.token.symbol}
                </div>
            </div>
        );
    }
    private onChange(errorMsg: InputErrorMsg, amount: BigNumber) {
        if (!_.isNull(errorMsg)) {
            this.props.onChange(errorMsg);
        } else {
            const weiAmount = zeroEx.toBaseUnitAmount(Number(amount), this.props.token.decimals);
            this.props.onChange(null, weiAmount);
        }
    }
    private validate(amount: BigNumber): InputErrorMsg {
        if (amount.gt(this.props.token.allowance)) {
            return (
                <span>
                    Insufficient allowance.{' '}
                    <Link
                        to="/demo/balances"
                        style={{cursor: 'pointer', color: colors.grey900}}>
                            Set allowance
                    </Link>
                </span>
            );
        }
        return null;
    }
}

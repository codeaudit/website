import {Token, InputErrorMsg, FailableBigNumberCallback, AssetToken} from '../../types';
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
    assetToken: AssetToken;
    shouldShowIncompleteErrs: boolean;
    shouldCheckBalanceAndAllowance: boolean;
    onChange: FailableBigNumberCallback;
}

interface  TokenAmountInputState {}

export class TokenAmountInput extends React.Component<TokenAmountInputProps, TokenAmountInputState> {
    public render() {
        const amount = this.props.assetToken.amount ?
            zeroEx.toUnitAmount(this.props.assetToken.amount, this.props.token.decimals) :
            undefined;
        return (
            <div className="flex overflow-hidden" style={{height: 84}}>
                <BalanceBoundedInput
                    label={this.props.label}
                    amount={amount}
                    balance={zeroEx.toUnitAmount(this.props.token.balance, this.props.token.decimals)}
                    onChange={this.onChange.bind(this)}
                    validate={this.validate.bind(this)}
                    shouldCheckBalance={this.props.shouldCheckBalanceAndAllowance}
                />
                <div style={{paddingTop: 44}}>
                    {this.props.token.symbol}
                </div>
            </div>
        );
    }
    private onChange(errorMsg: InputErrorMsg, amount: BigNumber) {
        if (!_.isUndefined(errorMsg)) {
            this.props.onChange(errorMsg);
        } else {
            const baseUnitAmount = zeroEx.toBaseUnitAmount(Number(amount), this.props.token.decimals);
            this.props.onChange(undefined, baseUnitAmount);
        }
    }
    private validate(amount: BigNumber): InputErrorMsg {
        if (this.props.shouldCheckBalanceAndAllowance && amount.gt(this.props.token.allowance)) {
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
        return undefined;
    }
}

import {Token, InputErrMsg, FailableBigNumberCallback, AssetToken} from 'ts/types';
import * as React from 'react';
import * as _ from 'lodash';
import * as BigNumber from 'bignumber.js';
import {BalanceBoundedInput} from 'ts/components/inputs/balance_bounded_input';
import {zeroEx} from 'ts/utils/zero_ex';
import {colors} from 'material-ui/styles';
import {Link} from 'react-router-dom';

interface TokenAmountInputProps {
    label: string;
    token: Token;
    assetToken: AssetToken;
    shouldShowIncompleteErrs: boolean;
    shouldCheckBalance: boolean;
    shouldCheckAllowance: boolean;
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
                    shouldCheckBalance={this.props.shouldCheckBalance}
                    shouldShowIncompleteErrs={this.props.shouldShowIncompleteErrs}
                />
                <div style={{paddingTop: 44}}>
                    {this.props.token.symbol}
                </div>
            </div>
        );
    }
    private onChange(amount?: BigNumber) {
        let baseUnitAmount;
        if (!_.isUndefined(amount)) {
            baseUnitAmount = zeroEx.toBaseUnitAmount(amount, this.props.token.decimals);
        }
        this.props.onChange(baseUnitAmount);
    }
    private validate(amount: BigNumber): InputErrMsg {
        if (this.props.shouldCheckAllowance && amount.gt(this.props.token.allowance)) {
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
    }
}

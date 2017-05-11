import {Token, InputErrorMsg, FailableNumericCallback} from '../../types';
import * as React from 'react';
import * as _ from 'lodash';
import * as BigNumber from 'bignumber.js';
import {UpperBoundedNumericInput} from './upper_bounded_numeric_input';
import {zeroEx} from '../../utils/zero_ex';
import {constants} from 'ts/utils/constants';
import {colors} from 'material-ui/styles';
import {Link} from 'react-router-dom';

interface TokenAmountInputProps {
    label: string;
    token: Token;
    checkBalance?: boolean;
    checkAllowance?: boolean;
    shouldShowIncompleteErrs: boolean;
    onChange: FailableNumericCallback;
}

export class TokenAmountInput extends React.Component<TokenAmountInputProps, {}> {
    public static defaultProps: Partial<TokenAmountInputProps> = {
        checkBalance: true,
        checkAllowance: true,
    };
    public render() {
        return (
            <div className="flex overflow-hidden" style={{height: 84}}>
                <UpperBoundedNumericInput
                    label={this.props.label}
                    balance={zeroEx.toUnitAmount(this.props.token.balance, this.props.token.decimals)}
                    onChange={this.onChange.bind(this)}
                    checkBalance={this.props.checkBalance}
                    validate={this.validate.bind(this)}
                />
                <div style={{paddingTop: 44}}>
                    {this.props.token.symbol}
                </div>
            </div>
        );
    }
    private onChange(error: InputErrorMsg, amount: BigNumber) {
        if (!_.isNull(error)) {
            this.props.onChange(error);
        } else {
            const weiAmount = zeroEx.toBaseUnitAmount(Number(amount), this.props.token.decimals);
            this.props.onChange(null, weiAmount);
        }
    }
    private validate(amount: BigNumber): InputErrorMsg {
        if (this.props.checkAllowance && amount.gt(this.props.token.allowance)) {
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

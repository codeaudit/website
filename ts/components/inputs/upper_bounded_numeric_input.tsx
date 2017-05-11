import * as _ from 'lodash';
import * as React from 'react';
import BigNumber = require('bignumber.js');
import {FailableNumericCallback, InputErrorMsg} from '../../types';
import {TextField} from 'material-ui';
import {RequiredLabel} from '../ui/required_label';
import {colors} from 'material-ui/styles';
import {utils} from 'ts/utils/utils';
import {Link} from 'react-router-dom';

interface UpperBoundedNumericInputProps {
    label: string;
    balance: BigNumber;
    onChange: FailableNumericCallback;
    checkBalance?: boolean;
    shouldShowIncompleteErrs?: boolean;
    validate?: (amount: BigNumber) => InputErrorMsg;
    style?: React.CSSProperties;
    hintStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
}

interface UpperBoundedNumericInputState {
    error: InputErrorMsg;
    amount: string;
}

export class UpperBoundedNumericInput extends
    React.Component<UpperBoundedNumericInputProps, UpperBoundedNumericInputState> {
    public static defaultProps: Partial<UpperBoundedNumericInputProps> = {
        checkBalance: true,
        shouldShowIncompleteErrs: false,
        validate: (amount: BigNumber) => null,
        style: {},
        hintStyle: {},
        inputStyle: {},
    };
    constructor(props: UpperBoundedNumericInputProps) {
        super(props);
        this.state = {
            error: null,
            amount: '',
        };
    }
    public render() {
        let errorText = this.state.error;
        if (this.props.shouldShowIncompleteErrs && this.state.amount === '') {
            errorText = 'This field is required';
        }
        let label: React.ReactNode | string = '';
        if (!_.isUndefined(this.props.label)) {
            label = <RequiredLabel label={this.props.label}/>;
        }
        return (
            <TextField
                fullWidth={true}
                floatingLabelText={label}
                floatingLabelFixed={true}
                floatingLabelStyle={{color: colors.grey500, width: 206}}
                style={this.props.style}
                errorText={errorText}
                value={this.state.amount}
                inputStyle={this.props.inputStyle}
                hintStyle={this.props.hintStyle}
                hintText={<span style={{textTransform: 'capitalize'}}>amount</span>}
                onChange={this.onValueChange.bind(this)}
                underlineStyle={{width: 'calc(100% + 50px)'}}
            />
        );
    }
    private onValueChange(e: any, amount: string) {
        const error = this.validate(amount);
        if (!_.isNull(error)) {
            this.props.onChange(error);
        } else {
            this.props.onChange(null, new BigNumber(amount));
        }
        this.setState({
            amount,
            error,
        });
    }
    private validate(amount: string): InputErrorMsg {
        if (!utils.isNumeric(amount)) {
            return 'Must be a number';
        }
        const numericAmount = new BigNumber(amount);
        if (numericAmount.eq(0)) {
            return 'Cannot be zero';
        }
        if (this.props.checkBalance && numericAmount.gt(this.props.balance)){
            return (
                <span>
                    Insufficient balance.{' '}
                    <Link
                        to="/demo/balances"
                        style={{cursor: 'pointer', color: colors.grey900}}>
                        Increase balance
                    </Link>
                </span>
            );
        }
        return this.props.validate(numericAmount);
    }
}

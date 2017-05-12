import * as _ from 'lodash';
import * as React from 'react';
import BigNumber = require('bignumber.js');
import {FailableBigNumberCallback, InputErrorMsg} from 'ts/types';
import {TextField} from 'material-ui';
import {RequiredLabel} from 'ts/components/ui/required_label';
import {colors} from 'material-ui/styles';
import {utils} from 'ts/utils/utils';
import {Link} from 'react-router-dom';

interface BalanceBoundedInputProps {
    label: string;
    balance: BigNumber;
    amount?: BigNumber;
    onChange: FailableBigNumberCallback;
    shouldShowIncompleteErrs?: boolean;
    shouldCheckBalance: boolean;
    validate: (amount: BigNumber) => InputErrorMsg;
}

interface BalanceBoundedInputState {
    errorMsg: InputErrorMsg;
    amount: string;
}

export class BalanceBoundedInput extends
    React.Component<BalanceBoundedInputProps, BalanceBoundedInputState> {
    public static defaultProps: Partial<BalanceBoundedInputProps> = {
        shouldShowIncompleteErrs: false,
    };
    constructor(props: BalanceBoundedInputProps) {
        super(props);
        this.state = {
            errorMsg: undefined,
            amount: this.props.amount ? this.props.amount.toString() : '',
        };
    }
    public componentWillReceiveProps(nextProps: BalanceBoundedInputProps) {
        if (nextProps === this.props) {return;}
        const amountString = nextProps.amount ? nextProps.amount.toString() : '';
        this.setState({
            errorMsg: this.validate(amountString),
            amount: amountString,
        });
    }
    public render() {
        let errorText = this.state.errorMsg;
        if (this.props.shouldShowIncompleteErrs && this.state.amount === '') {
            errorText = 'This field is required';
        }
        let label: React.ReactNode|string = '';
        if (!_.isUndefined(this.props.label)) {
            label = <RequiredLabel label={this.props.label}/>;
        }
        return (
            <TextField
                fullWidth={true}
                floatingLabelText={label}
                floatingLabelFixed={true}
                floatingLabelStyle={{color: colors.grey500, width: 206}}
                errorText={errorText}
                value={this.state.amount}
                hintText={<span style={{textTransform: 'capitalize'}}>amount</span>}
                onChange={this.onValueChange.bind(this)}
                underlineStyle={{width: 'calc(100% + 50px)'}}
            />
        );
    }
    private onValueChange(e: any, amount: string) {
        const errorMsg = this.validate(amount);
        if (!_.isUndefined(errorMsg)) {
            this.props.onChange(errorMsg);
        } else {
            this.props.onChange(undefined, new BigNumber(amount));
        }
        this.setState({
            amount,
            errorMsg,
        });
    }
    private validate(amountString: string): InputErrorMsg {
        if (!utils.isNumeric(amountString)) {
            return 'Must be a number';
        }
        const amount = new BigNumber(amountString);
        if (amount.eq(0)) {
            return 'Cannot be zero';
        }
        if (this.props.shouldCheckBalance && amount.gt(this.props.balance)) {
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
        return this.props.validate(amount);
    }
}

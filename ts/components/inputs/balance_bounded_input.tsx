import * as _ from 'lodash';
import * as React from 'react';
import BigNumber = require('bignumber.js');
import {FailableBigNumberCallback, InputErrMsg} from 'ts/types';
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
    validate?: (amount: BigNumber) => InputErrMsg;
}

interface BalanceBoundedInputState {
    errMsg: InputErrMsg;
    amountString: string;
}

export class BalanceBoundedInput extends
    React.Component<BalanceBoundedInputProps, BalanceBoundedInputState> {
    public static defaultProps: Partial<BalanceBoundedInputProps> = {
        shouldShowIncompleteErrs: false,
    };
    constructor(props: BalanceBoundedInputProps) {
        super(props);
        const amountString = this.props.amount ? this.props.amount.toString() : '';
        this.state = {
            errMsg: this.validate(amountString),
            amountString,
        };
    }
    public componentWillReceiveProps(nextProps: BalanceBoundedInputProps) {
        if (nextProps === this.props) {
            return;
        }
        const isCurrentAmountNumeric = utils.isNumeric(this.state.amountString);
        if (!_.isUndefined(nextProps.amount)) {
            let shouldResetState = false;
            if (!isCurrentAmountNumeric) {
                shouldResetState = true;
            } else {
                const currentAmount = new BigNumber(this.state.amountString);
                if (!currentAmount.eq(nextProps.amount) || !nextProps.balance.eq(this.props.balance)) {
                    shouldResetState = true;
                }
            }
            if (shouldResetState) {
                const amountString = nextProps.amount.toString();
                this.setState({
                    errMsg: this.validate(amountString),
                    amountString,
                });
            }
        } else if (isCurrentAmountNumeric) {
            const amountString = '';
            this.setState({
                errMsg: this.validate(amountString),
                amountString,
            });
        }
    }
    public render() {
        let errorText = this.state.errMsg;
        if (this.props.shouldShowIncompleteErrs && this.state.amountString === '') {
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
                value={this.state.amountString}
                hintText={<span style={{textTransform: 'capitalize'}}>amount</span>}
                onChange={this.onValueChange.bind(this)}
                underlineStyle={{width: 'calc(100% + 50px)'}}
            />
        );
    }
    private onValueChange(e: any, amountString: string) {
        const errMsg = this.validate(amountString);
        this.setState({
            amountString,
            errMsg,
        }, () => {
            if (utils.isNumeric(amountString)) {
                this.props.onChange(new BigNumber(amountString));
            } else {
                this.props.onChange(undefined);
            }
        });
    }
    private validate(amountString: string): InputErrMsg {
        if (!utils.isNumeric(amountString)) {
            return amountString !== '' ? 'Must be a number' : '';
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
        if (_.isUndefined(this.props.validate)){
            return undefined;
        } else {
            return this.props.validate(amount);
        }
    }
}

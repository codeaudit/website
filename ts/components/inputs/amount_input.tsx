import * as _ from 'lodash';
import * as React from 'react';
import {TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {utils} from 'ts/utils/utils';
import {AssetToken, Side, Token, MenuItemValue} from 'ts/types';
import {RequiredLabel} from 'ts/components/ui/required_label';

interface AmountInputProps {
    label?: string;
    style?: React.CSSProperties;
    hintStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    assetToken: AssetToken;
    side: Side;
    shouldCheckBalanceAndAllowance?: boolean;
    shouldShowIncompleteErrs: boolean;
    token: Token;
    triggerMenuClick: (menuItemValue: MenuItemValue) => void;
    updateChosenAssetToken: (side: Side, token: AssetToken) => void;
}

interface AmountInputState {
    amount: string;
    errMsg: React.ReactNode | string;
}

export class AmountInput extends React.Component<AmountInputProps, AmountInputState> {
    constructor(props: AmountInputProps) {
        super(props);
        const intialAmount = this.props.assetToken.amount;
        this.state = {
            amount: _.isUndefined(intialAmount) ? '' : intialAmount.toString(),
            errMsg: '',
        };
    }
    public render() {
        let errText: (string | React.ReactNode) = '';
        if (this.props.shouldShowIncompleteErrs && this.state.amount === '') {
            errText = 'This field is required';
        }
        if (this.state.errMsg !== '') {
            errText = this.state.errMsg;
        }
        let label: React.ReactNode | string = '';
        if (!_.isUndefined(this.props.label)) {
            label = <RequiredLabel label={this.props.label} />;
        }
        return (
            <div className="flex overflow-hidden" style={{height: 84}}>
                <TextField
                    fullWidth={true}
                    floatingLabelText={label}
                    floatingLabelFixed={true}
                    floatingLabelStyle={{color: colors.grey500}}
                    style={this.props.style ? this.props.style : {}}
                    errorText={errText}
                    value={_.isUndefined(this.state.amount) ? '' : this.state.amount}
                    inputStyle={this.props.inputStyle ? this.props.inputStyle : {}}
                    hintStyle={this.props.hintStyle ? this.props.hintStyle : {}}
                    hintText={<span style={{textTransform: 'capitalize'}}>amount</span>}
                    onChange={this.onUpdatedAssetAmount.bind(this)}
                    underlineStyle={{width: 'calc(100% + 50px)'}}
                />
                <div style={{paddingTop: 44}}>
                    {this.props.assetToken.symbol}
                </div>
            </div>
        );
    }
    private onUpdatedAssetAmount(e: any) {
        const amount: string = e.target.value;
        const isAmountNumeric = utils.isNumeric(amount);
        this.setState({
            amount,
            errMsg: this.getErrMsg(this.props.token.balance, this.props.token.allowance, amount),
        });
        const assetToken = this.props.assetToken;
        if (isAmountNumeric) {
            assetToken.amount = Number(amount);
        } else {
            assetToken.amount = undefined;
        }
        this.props.updateChosenAssetToken(this.props.side, assetToken);
    }
    private getErrMsg(balance: number, allowance: number, amount: string): (string | React.ReactNode) {
        const isAmountNumeric = utils.isNumeric(amount);
        let errMsg: (string | React.ReactNode) = '';
        if (!isAmountNumeric && amount !== '') {
            errMsg = 'Must be a number';
        } else if (amount === '0') {
            errMsg = 'Cannot be zero';
        } else if (this.props.shouldCheckBalanceAndAllowance && balance < Number(amount)) {
            errMsg = (
                <span>
                    Insuffient balance. Mint tokens{' '}
                    <a
                        style={{cursor: 'pointer', color: colors.blueGrey500}}
                        onClick={this.props.triggerMenuClick.bind(this.props.triggerMenuClick, MenuItemValue.balances)}
                    >
                        here
                    </a>
                </span>
            );
        } else if (this.props.shouldCheckBalanceAndAllowance && allowance < Number(amount)) {
            errMsg = (
                <span>
                    Insuffient allowance. Set allowance{' '}
                    <a
                        style={{cursor: 'pointer', color: colors.blueGrey500}}
                        onClick={this.props.triggerMenuClick.bind(this.props.triggerMenuClick, MenuItemValue.balances)}
                    >
                        here
                    </a>
                </span>
            );
        }
        return errMsg;
    }
}

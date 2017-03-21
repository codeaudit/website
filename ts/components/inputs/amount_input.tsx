import * as _ from 'lodash';
import * as React from 'react';
import {TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {utils} from 'ts/utils/utils';
import {TokenBySymbol, AssetToken, Side, SideToAssetToken, Direction} from 'ts/types';

interface AmountInputProps {
    label?: string;
    style?: React.CSSProperties;
    hintStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    assetToken: AssetToken;
    side: Side;
    shouldShowIncompleteErrs: boolean;
    updateChosenAssetToken: (side: Side, token: AssetToken) => void;
}

interface AmountInputState {
    amount: string;
    errMsg: string;
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
    public componentWillReceiveProps(nextProps: AmountInputProps) {
        const newAmount = nextProps.assetToken.amount;
        const isCurrentAmountNumeric = utils.isNumeric(this.state.amount);
        if (isCurrentAmountNumeric && newAmount !== Number(this.state.amount) ||
            !isCurrentAmountNumeric && !_.isUndefined(newAmount)) {
            const amount = _.isUndefined(newAmount) ? '' : newAmount.toString();
            this.setState({
                amount,
                errMsg: this.getErrMsg(amount),
            });
        }
    }
    public render() {
        let errText = '';
        if (this.props.shouldShowIncompleteErrs && this.state.amount === '') {
            errText = 'This field is required';
        }
        if (this.state.errMsg !== '') {
            errText = this.state.errMsg;
        }
        return (
            <TextField
                floatingLabelText={_.isUndefined(this.props.label) ? '' : this.props.label}
                floatingLabelFixed={true}
                floatingLabelStyle={{color: colors.grey500}}
                style={this.props.style ? this.props.style : {}}
                errorText={errText}
                value={_.isUndefined(this.state.amount) ? '' : this.state.amount}
                inputStyle={this.props.inputStyle ? this.props.inputStyle : {}}
                hintStyle={this.props.hintStyle ? this.props.hintStyle : {}}
                hintText={<span style={{textTransform: 'capitalize'}}>amount</span>}
                onChange={this.onUpdatedAssetAmount.bind(this)}
            />
        );
    }
    private onUpdatedAssetAmount(e: any) {
        const amount: string = e.target.value;
        const isAmountNumeric = utils.isNumeric(amount);
        this.setState({
            amount,
            errMsg: this.getErrMsg(amount),
        });
        const assetToken = this.props.assetToken;
        if (isAmountNumeric) {
            assetToken.amount = Number(amount);
        } else {
            assetToken.amount = undefined;
        }
        this.props.updateChosenAssetToken(this.props.side, assetToken);
    }
    private getErrMsg(amount: string): string {
        const isAmountNumeric = utils.isNumeric(amount);
        let errMsg = isAmountNumeric || amount === '' ? '' : 'Must be a number';
        if (amount === '0') {
            errMsg = 'Cannot be zero';
        }
        return errMsg;
    }
}

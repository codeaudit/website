import * as React from 'react';
import {Dialog, FlatButton, RadioButtonGroup, RadioButton, TextField} from 'material-ui';
import {AssetToken, Side, Token, MenuItemValue} from 'ts/types';
import {AmountInput} from 'ts/components/inputs/amount_input';
import * as BigNumber from 'bignumber.js';
import {zeroEx} from "ts/utils/zero_ex";

interface EthWethConversionDialogProps {
    onComplete: (direction: Side, value: BigNumber) => any;
    onCancelled: () => any;
    isOpen: boolean;
    token: Token;
}

interface EthWethConversionDialogState {
    value: BigNumber;
    direction: Side;
}

export class EthWethConversionDialog extends
    React.Component<EthWethConversionDialogProps, EthWethConversionDialogState> {
    constructor() {
        super();
        this.state = {
            value: new BigNumber(0),
            direction: Side.deposit,
        };
    }
    public render() {
        const convertDialogActions = [
            <FlatButton
                label="Cancel"
                onTouchTap={this.props.onCancelled}
            />,
            <FlatButton
                label="Convert"
                primary={true}
                onTouchTap={this.convert.bind(this)}
            />,
        ];
        return <Dialog
            title="I want to convert"
            titleStyle={{fontWeight: 100}}
            actions={convertDialogActions}
            open={this.props.isOpen}>
            {this.renderConversionDialogBody()}
        </Dialog>;
    }
    private updateValue(side: Side, token: AssetToken) {
        this.setState({value: token.amount});
    }
    // TODO to be removed when is not required in amount_input
    private onMenuClick(menuItemValue: MenuItemValue) {
        return;
    }
    private renderConversionDialogBody() {
        return <div>
            <RadioButtonGroup
                defaultSelected={this.state.direction}
                name="conversionDirection"
                onChange={this.onConversionDirectionChange.bind(this)}>
                <RadioButton
                    value={Side.deposit}
                    label="Ether to ether tokens"
                />
                <RadioButton
                    value={Side.receive}
                    label="Ether tokens to ether"
                />
            </RadioButtonGroup>

            {(this.state.direction === Side.receive)
                ? <AmountInput
                    token={this.props.token}
                    side={this.state.direction}
                    shouldShowIncompleteErrs={false}
                    shouldCheckBalanceAndAllowance={true}
                    triggerMenuClick={this.onMenuClick.bind(this)}
                    updateChosenAssetToken={this.updateValue.bind(this)}
                    assetToken={{address: this.props.token.address, amount: this.state.value}}
                />
                : <TextField hintText="Value in ETH" onChange={this.onValueChange.bind(this)}/>
            }
        </div>;
    }
    private onConversionDirectionChange(_: any, direction: Side) {
        this.setState({direction});
    }
    private onValueChange(_: any, valueInEth: string) {
        const valueInWei = zeroEx.toBaseUnitAmount(Number(valueInEth), 18);
        this.setState({value: valueInWei});
    }
    private convert() {
        this.props.onComplete(this.state.direction, this.state.value);
    }
}

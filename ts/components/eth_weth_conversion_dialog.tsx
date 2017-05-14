import * as React from 'react';
import * as _ from 'lodash';
import {Dialog, FlatButton, RadioButtonGroup, RadioButton, TextField} from 'material-ui';
import {Side, Token} from 'ts/types';
import {TokenAmountInput} from 'ts/components/inputs/token_amount_input';
import {EthAmountInput} from 'ts/components/inputs/eth_amount_input';
import * as BigNumber from 'bignumber.js';

interface EthWethConversionDialogProps {
    onComplete: (direction: Side, value: BigNumber) => any;
    onCancelled: () => any;
    isOpen: boolean;
    token: Token;
    etherBalance: BigNumber;
}

interface EthWethConversionDialogState {
    value?: BigNumber;
    direction: Side;
    shouldShowIncompleteErrs: boolean;
}

export class EthWethConversionDialog extends
    React.Component<EthWethConversionDialogProps, EthWethConversionDialogState> {
    constructor() {
        super();
        this.state = {
            direction: Side.deposit,
            shouldShowIncompleteErrs: false,
        };
    }
    public render() {
        const convertDialogActions = [
            (
                <FlatButton
                    label="Cancel"
                    onTouchTap={this.props.onCancelled}
                />
            ),
            (
                <FlatButton
                    label="Convert"
                    primary={true}
                    onTouchTap={this.onConvertClick.bind(this)}
                />
            ),
        ];
        return (
            <Dialog
                title="I want to convert"
                titleStyle={{fontWeight: 100}}
                actions={convertDialogActions}
                open={this.props.isOpen}>
                {this.renderConversionDialogBody()}
            </Dialog>
        );
    }
    private renderConversionDialogBody() {
        return (
            <div>
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
                {this.state.direction === Side.receive ?
                    <TokenAmountInput
                        label="Conversion amount"
                        token={this.props.token}
                        shouldShowIncompleteErrs={this.state.shouldShowIncompleteErrs}
                        shouldCheckBalanceAndAllowance={true}
                        onChange={this.onValueChange.bind(this)}
                        assetToken={{address: this.props.token.address, amount: this.state.value}}
                    /> :
                    <EthAmountInput
                        label="Value in ETH"
                        balance={this.props.etherBalance}
                        amount={this.state.value}
                        onChange={this.onValueChange.bind(this)}
                        shouldShowIncompleteErrs={this.state.shouldShowIncompleteErrs}/>
                }
            </div>
        );
    }
    private onConversionDirectionChange(e: any, direction: Side) {
        this.setState({
            value: undefined,
            shouldShowIncompleteErrs: false,
            direction,
        });
    }
    private onValueChange(amount?: BigNumber) {
        this.setState({value: amount});
    }
    private onConvertClick() {
        if (_.isUndefined(this.state.value)) {
            this.setState({shouldShowIncompleteErrs: true});
        } else {
            this.props.onComplete(this.state.direction, this.state.value);
        }
    }
}

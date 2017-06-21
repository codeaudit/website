import * as _ from 'lodash';
import {ZeroEx} from '@0xproject/0x.js';
import * as React from 'react';
import * as BigNumber from 'bignumber.js';
import {RaisedButton} from 'material-ui/RaisedButton';
import {BlockchainCallErrs} from 'ts/types';
import {EthWethConversionDialog} from 'ts/components/eth_weth_conversion_dialog';
import {Side, Token} from 'ts/types';
import {constants} from 'ts/utils/constants';
import {utils} from 'ts/utils/utils';
import {Dispatcher} from 'ts/redux/dispatcher';
import {errorReporter} from 'ts/utils/error_reporter';
import {Blockchain} from 'ts/blockchain';

interface EthWethConversionButtonProps {
    ethToken: Token;
    dispatcher: Dispatcher;
    blockchain: Blockchain;
    userEtherBalance: BigNumber.BigNumber;
    onError: () => void;
}

interface EthWethConversionButtonState {
    isEthConversionDialogVisible: boolean;
    isEthConversionHappening: boolean;
}

export class EthWethConversionButton extends
    React.Component<EthWethConversionButtonProps, EthWethConversionButtonState> {
    public constructor(props: EthWethConversionButtonProps) {
        super(props);
        this.state = {
            isEthConversionDialogVisible: false,
            isEthConversionHappening: false,
        };
    }
    public render() {
        const labelStyle = this.state.isEthConversionHappening ? {fontSize: 10} : {};
        return (
            <div>
                <RaisedButton
                    style={{width: '100%'}}
                    labelStyle={labelStyle}
                    disabled={this.state.isEthConversionHappening}
                    label={this.state.isEthConversionHappening ? 'Converting...' : 'Convert'}
                    onClick={this.toggleConversionDialog.bind(this)}
                />
                <EthWethConversionDialog
                    isOpen={this.state.isEthConversionDialogVisible}
                    onComplete={this.onConversionAmountSelectedAsync.bind(this)}
                    onCancelled={this.toggleConversionDialog.bind(this)}
                    etherBalance={this.props.userEtherBalance}
                    token={this.props.ethToken}
                />
            </div>
        );
    }
    private toggleConversionDialog() {
        this.setState({
            isEthConversionDialogVisible: !this.state.isEthConversionDialogVisible,
        });
    }
    private async onConversionAmountSelectedAsync(direction: Side, value: BigNumber.BigNumber) {
        this.setState({
            isEthConversionHappening: true,
        });
        this.toggleConversionDialog();
        const token = this.props.ethToken;
        let balance = token.balance;
        try {
            if (direction === Side.deposit) {
                await this.props.blockchain.convertEthToWrappedEthTokensAsync(value);
                const ethAmount = ZeroEx.toUnitAmount(value, constants.ETH_DECIMAL_PLACES);
                this.props.dispatcher.showFlashMessage(`Successfully converted ${ethAmount.toString()} ETH to WETH`);
                balance = balance.plus(value);
            } else {
                await this.props.blockchain.convertWrappedEthTokensToEthAsync(value);
                const tokenAmount = ZeroEx.toUnitAmount(value, token.decimals);
                this.props.dispatcher.showFlashMessage(`Successfully converted ${tokenAmount.toString()} WETH to ETH`);
                balance = balance.minus(value);
            }
            const updatedToken = _.assign({}, token, {
                balance,
            });
            this.props.dispatcher.updateTokenByAddress([updatedToken]);
        } catch (err) {
            const errMsg = '' + err;
            if (_.includes(errMsg, BlockchainCallErrs.USER_HAS_NO_ASSOCIATED_ADDRESSES)) {
                this.props.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
            } else if (!_.includes(errMsg, 'User denied transaction')) {
                utils.consoleLog(`Unexpected error encountered: ${err}`);
                utils.consoleLog(err.stack);
                await errorReporter.reportAsync(err);
                this.props.onError();
            }
        }
        this.setState({
            isEthConversionHappening: false,
        });
    }
}

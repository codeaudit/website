import * as _ from 'lodash';
import * as React from 'react';
import {Dialog, FlatButton} from 'material-ui';
import {colors} from 'material-ui/styles';
import {constants} from 'ts/utils/constants';
import {Blockchain} from 'ts/blockchain';
import {BlockchainErrs} from 'ts/types';

interface BlockchainErrDialogProps {
    blockchain: Blockchain;
    blockchainErr: BlockchainErrs;
    isOpen: boolean;
    orderMakerAddress: string;
    toggleDialogFn: (isOpen: boolean) => void;
}

export class BlockchainErrDialog extends React.Component<BlockchainErrDialogProps, undefined> {
    public render() {
        const dialogActions = [
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.props.toggleDialogFn.bind(this.props.toggleDialogFn, false)}
            />,
        ];

        const hasWalletAddress = !_.isUndefined(this.props.orderMakerAddress);
        return (
            <Dialog
                title={this.getTitle(hasWalletAddress)}
                actions={dialogActions}
                open={this.props.isOpen}
                contentStyle={{width: 400}}
                onRequestClose={this.props.toggleDialogFn.bind(this.props.toggleDialogFn, false)}
                autoScrollBodyContent={true}
            >
                <div className="pt2" style={{color: colors.grey700}}>
                    {this.renderExplanation(hasWalletAddress)}
                </div>
            </Dialog>
        );
    }
    private getTitle(hasWalletAddress: boolean) {
        if (this.props.blockchainErr === BlockchainErrs.A_CONTRACT_NOT_DEPLOYED_ON_NETWORK) {
            return '0x smart contracts not found';
        } else if (!hasWalletAddress) {
            return 'Enable wallet communication';
        } else {
            return 'Unexpected error';
        }
    }
    private renderExplanation(hasWalletAddress: boolean) {
        if (this.props.blockchainErr === BlockchainErrs.A_CONTRACT_NOT_DEPLOYED_ON_NETWORK) {
            return this.renderContractsNotDeployedExplanation();
        } else if (!hasWalletAddress) {
            return this.renderNoWalletFoundExplanation();
        } else {
            return this.renderUnexpectedErrorExplanation();
        }
    }
    private renderUnexpectedErrorExplanation() {
        return (
            <div>
                We encountered an unexpected error. Please try refreshing the page.
            </div>
        );
    }
    private renderNoWalletFoundExplanation() {
        return (
            <div>
                <div>
                    We were unable to access an Ethereum wallet you control. In order to interact
                    {' '}with the demo dApp, we need a way to interact with one of your ethereum wallets.
                    {' '}There are two easy ways you can enable us to do that:
                </div>
                <h4>1. Chrome extension ethereum wallet</h4>
                <div>
                    You can install a chrome extension ethereum wallet such as{' '}
                    <a href={constants.METAMASK_CHROME_STORE_URL} target="_blank">
                        Metamask
                    </a>. Once installed and set up, refresh this page.
                </div>
                <h4>2. Use the Mist browser</h4>
                <div>
                    Install the <a href={constants.MIST_DOWNLOAD_URL} target="_blank">Mist</a>
                    {' '}app, and browse to this site from within the in-app Mist browser.
                </div>
                <div className="pt2">
                    <span className="bold">Note:</span>
                    {' '}If you have done one of the above steps and are still seeing this message, we are
                    {' '}still unable to retrieve an ethereum address by calling `web3.eth.accounts`.
                </div>
            </div>
        );
    }
    private renderContractsNotDeployedExplanation() {
        return (
            <div>
                <div>
                    The 0x smart contracts are not deployed on the Ethereum network you are
                    {' '}currently connected to (network Id: {this.props.blockchain.networkId}).
                    {' '}In order to use this demo app, please connect to the {constants.TESTNET_NAME}
                    {' '}testnet (network Id: {constants.TESTNET_NETWORK_ID}).
                </div>
                <h4>Metamask</h4>
                <div>
                    If you are using{' '}
                    <a href={constants.METAMASK_CHROME_STORE_URL} target="_blank">
                        Metamask
                    </a>, you can switch networks in the top left corner of the extension popover.
                </div>
                <h4>Mist</h4>
                <div>
                    In the <a href={constants.MIST_DOWNLOAD_URL} target="_blank">Mist</a>
                    {' '}app, navigate to develop -> network, and choose the 'testnet' option.
                </div>
            </div>
        );
    }
}

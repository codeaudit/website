import * as _ from 'lodash';
import * as React from 'react';
import {TokenBySymbol, Token} from 'ts/types';
import {Blockchain} from 'ts/blockchain';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {EnableWalletDialog} from 'ts/components/enable_wallet_dialog';
import {LifeCycleRaisedButton} from 'ts/components/ui/lifecycle_raised_button';
import {
    RaisedButton,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeaderColumn,
    TableRowColumn,
} from 'material-ui';

const PRECISION = 5;
const ICON_DIMENSION = 40;
const ARTIFICIAL_ETHER_REQUEST_DELAY = 1000;

interface TokenBalancesProps {
    blockchain: Blockchain;
    blockchainErr: string;
    blockchainIsLoaded: boolean;
    tokenBySymbol: TokenBySymbol;
    userEtherBalance: number;
}

interface TokenBalancesState {
    isEnableWalletDialogOpen: boolean;
}

export class TokenBalances extends React.Component<TokenBalancesProps, TokenBalancesState> {
    constructor(props: TokenBalancesProps) {
        super(props);
        this.state = {
            isEnableWalletDialogOpen: false,
        };
    }
    public render() {
        const etherIconUrl = this.props.tokenBySymbol.WETH.iconUrl;
        return (
            <div>
                <h3 className="px4 pt2 center">Test ether</h3>
                <div className="px2 pb2">
                    In order to try out the 0x protocol demo app, request some test ether to pay for
                    gas costs. It might take a bit of time for the test ether to show up.
                </div>
                <Table selectable={false}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Currency</TableHeaderColumn>
                            <TableHeaderColumn>Balance</TableHeaderColumn>
                            <TableHeaderColumn />
                            <TableHeaderColumn>Request from faucet</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        <TableRow key="ETH">
                            <TableRowColumn>
                                <img
                                    style={{width: ICON_DIMENSION, height: ICON_DIMENSION}}
                                    src={etherIconUrl}
                                />
                            </TableRowColumn>
                            <TableRowColumn>{this.props.userEtherBalance.toFixed(PRECISION)} ETH</TableRowColumn>
                            <TableRowColumn />
                            <TableRowColumn>
                                <LifeCycleRaisedButton
                                    labelReady="Request"
                                    labelLoading="Requesting..."
                                    labelComplete="Request sent!"
                                    onClickAsyncFn={this.requestEtherAsync.bind(this)}
                                />
                            </TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
                <h3 className="px4 center pt2">Test tokens</h3>
                <div className="px2 pb2">
                    Mint some test tokens you'd like to use to generate or fill an order using 0x.
                </div>
                <Table selectable={false} bodyStyle={{height: 289}}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Token</TableHeaderColumn>
                            <TableHeaderColumn>Balance</TableHeaderColumn>
                            <TableHeaderColumn>0x allowance</TableHeaderColumn>
                            <TableHeaderColumn>Mint test tokens</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.renderTableRows()}
                    </TableBody>
                </Table>
                <EnableWalletDialog
                    isOpen={this.state.isEnableWalletDialogOpen}
                    toggleDialogFn={this.toggleEnableWalletDialog.bind(this)}
                />
            </div>
        );
    }
    private renderTableRows() {
        if (!this.props.blockchainIsLoaded || this.props.blockchainErr !== '') {
            return '';
        }
        return _.map(this.props.tokenBySymbol, (token: Token) => {
            return (
                <TableRow key={token.symbol}>
                    <TableRowColumn>
                        <img
                            style={{width: ICON_DIMENSION, height: ICON_DIMENSION}}
                            src={token.iconUrl}
                        />
                    </TableRowColumn>
                    <TableRowColumn>{token.balance.toFixed(PRECISION)} {token.symbol}</TableRowColumn>
                    <TableRowColumn>{token.allowance.toFixed(PRECISION)} {token.symbol}</TableRowColumn>
                    <TableRowColumn>
                        <LifeCycleRaisedButton
                            labelReady="Mint"
                            labelLoading="Minting..."
                            labelComplete="Tokens minted!"
                            onClickAsyncFn={this.onMintTestTokensAsync.bind(this, token)}
                        />
                    </TableRowColumn>
                </TableRow>
            );
        });
    }
    private async onMintTestTokensAsync(token: Token) {
        try {
            await this.props.blockchain.mintTestTokensAsync(token);
        } catch (err) {
            const errMsg = '' + err;
            if (_.includes(errMsg, 'User has no associated addresses')) {
                const isOpen = true;
                this.toggleEnableWalletDialog(isOpen);
            }
            utils.consoleLog(`Unexpected error encountered: ${err}`);
        }
    }
    private async requestEtherAsync() {
        await utils.sleepAsync(ARTIFICIAL_ETHER_REQUEST_DELAY);

        const userAddressIfExists = await this.props.blockchain.getFirstAccountIfExistsAsync();
        if (_.isUndefined(userAddressIfExists)) {
            const isOpen = true;
            this.toggleEnableWalletDialog(isOpen);
            return;
        }

        const response = await fetch(`${constants.ETHER_FAUCET_ENDPOINT}/${userAddressIfExists}`);
        const responseBody = await response.text();
        if (response.status !== 200) {
            // TODO: Show error message in UI
            utils.consoleLog(`Unexpected status code: ${response.status} -> ${responseBody}`);
            return;
        }
    }
    private toggleEnableWalletDialog(isOpen: boolean) {
        this.setState({
            isEnableWalletDialogOpen: isOpen,
        });
    }
}

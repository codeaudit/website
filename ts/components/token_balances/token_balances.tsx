import * as _ from 'lodash';
import * as React from 'react';
import {TokenBySymbol, Token} from 'ts/types';
import {Blockchain} from 'ts/blockchain';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {EnableWalletDialog} from 'ts/components/enable_wallet_dialog';
import {MintButton} from 'ts/components/token_balances/mint_button';
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

interface TokenBalancesProps {
    blockchain: Blockchain;
    blockchainErr: string;
    blockchainIsLoaded: boolean;
    tokenBySymbol: TokenBySymbol;
    userEtherBalance: number;
}

interface TokenBalancesState {
    isEnableWalletDialogOpen: boolean;
    isRequestingEther: boolean;
}

export class TokenBalances extends React.Component<TokenBalancesProps, TokenBalancesState> {
    constructor(props: TokenBalancesProps) {
        super(props);
        this.state = {
            isEnableWalletDialogOpen: false,
            isRequestingEther: false,
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
                                {!this.state.isRequestingEther ?
                                    <RaisedButton
                                        label="Request"
                                        style={{margin: 12, width: '100%'}}
                                        onClick={this.requestEtherAsync.bind(this)}
                                    /> :
                                    <div>Requesting...</div>
                                }
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
                        <MintButton
                            blockchain={this.props.blockchain}
                            token={token}
                            toggleEnableWalletDialog={this.toggleEnableWalletDialog.bind(this)}
                        />
                    </TableRowColumn>
                </TableRow>
            );
        });
    }
    private async requestEtherAsync() {
        this.setState({
            isRequestingEther: true,
        });
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
        this.setState({
            isRequestingEther: false,
        });
    }
    private toggleEnableWalletDialog(isOpen: boolean) {
        this.setState({
            isEnableWalletDialogOpen: isOpen,
        });
    }
}

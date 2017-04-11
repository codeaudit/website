import * as _ from 'lodash';
import * as React from 'react';
import {Dispatcher} from 'ts/redux/dispatcher';
import {TokenBySymbol, Token, BlockchainErrs} from 'ts/types';
import {Blockchain} from 'ts/blockchain';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {configs} from 'ts/utils/configs';
import {LifeCycleRaisedButton} from 'ts/components/ui/lifecycle_raised_button';
import {errorReporter} from 'ts/utils/error_reporter';
import ReactTooltip = require('react-tooltip');
import {
    Dialog,
    FlatButton,
    RaisedButton,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeaderColumn,
    TableRowColumn,
    Toggle,
} from 'material-ui';

const PRECISION = 5;
const ICON_DIMENSION = 40;
const ARTIFICIAL_ETHER_REQUEST_DELAY = 1000;
const DEFAULT_ALLOWANCE_AMOUNT = 1000000;
enum errorTypes {
  incorrectNetworkForFaucet,
  faucetRequestFailed,
  faucetQueueIsFull,
  mintingFailed,
  allowanceSettingFailed,
};

interface TokenBalancesProps {
    blockchain: Blockchain;
    blockchainErr: BlockchainErrs;
    blockchainIsLoaded: boolean;
    dispatcher: Dispatcher;
    tokenBySymbol: TokenBySymbol;
    userAddress: string;
    userEtherBalance: number;
}

interface TokenBalancesState {
    errorType: errorTypes;
    isBalanceSpinnerVisible: boolean;
}

export class TokenBalances extends React.Component<TokenBalancesProps, TokenBalancesState> {
    public constructor(props: TokenBalancesProps) {
        super(props);
        this.state = {
            errorType: undefined,
            isBalanceSpinnerVisible: false,
        };
    }
    public componentWillReceiveProps(nextProps: TokenBalancesProps) {
        if (nextProps.userEtherBalance !== this.props.userEtherBalance) {
            this.setState({
                isBalanceSpinnerVisible: false,
            });
        }
    }
    public render() {
        const etherIconUrl = this.props.tokenBySymbol.WETH.iconUrl;
        const errorDialogActions = [
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.onErrorDialogToggle.bind(this, false)}
            />,
        ];
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
                            <TableRowColumn>
                                {this.props.userEtherBalance.toFixed(PRECISION)} ETH
                                {this.state.isBalanceSpinnerVisible &&
                                    <span className="pl1">
                                        <i className="zmdi zmdi-spinner zmdi-hc-spin" />
                                    </span>
                                }
                            </TableRowColumn>
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
                            <TableHeaderColumn>0x exchange allowance</TableHeaderColumn>
                            <TableHeaderColumn>Mint test tokens</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.renderTableRows()}
                    </TableBody>
                </Table>
                <Dialog
                    title="Oh oh"
                    actions={errorDialogActions}
                    open={!_.isUndefined(this.state.errorType)}
                    onRequestClose={this.onErrorDialogToggle.bind(this, false)}
                >
                    {this.renderErrorDialogBody()}
                </Dialog>
            </div>
        );
    }
    private renderTableRows() {
        if (!this.props.blockchainIsLoaded || this.props.blockchainErr !== '') {
            return '';
        }
        return _.map(this.props.tokenBySymbol, (token: Token) => {
            const isMintable = _.includes(configs.symbolsOfMintableTokens, token.symbol);
            return (
                <TableRow key={token.iconUrl}>
                    <TableRowColumn>
                        {this.renderTokenName(token)}
                    </TableRowColumn>
                    <TableRowColumn>{token.balance.toFixed(PRECISION)} {token.symbol}</TableRowColumn>
                    <TableRowColumn>
                        <div className="pl3">
                            <Toggle
                                toggled={this.isAllowanceSet(token)}
                                onToggle={this.onToggleAllowanceAsync.bind(this, token)}
                            />
                        </div>
                    </TableRowColumn>
                    <TableRowColumn>
                        {isMintable &&
                            <LifeCycleRaisedButton
                                labelReady="Mint"
                                labelLoading="Minting..."
                                labelComplete="Tokens minted!"
                                onClickAsyncFn={this.onMintTestTokensAsync.bind(this, token)}
                            />
                        }
                    </TableRowColumn>
                </TableRow>
            );
        });
    }
    private renderTokenName(token: Token) {
        const tooltipId = `tooltip-${token.address}`;
        return (
            <div className="flex">
                <div>
                    <img
                        style={{width: ICON_DIMENSION, height: ICON_DIMENSION}}
                        src={token.iconUrl}
                    />
                </div>
                <div
                    data-tip={true}
                    data-for={tooltipId}
                    className="mt2 ml2"
                >
                    {token.name}
                </div>
                <ReactTooltip id={tooltipId}>{token.address}</ReactTooltip>
            </div>
        );
    }
    private renderErrorDialogBody() {
        switch (this.state.errorType) {
            case errorTypes.incorrectNetworkForFaucet:
                return (
                    <div>
                        Our faucet can only send test Ether to addresses on the {constants.TESTNET_NAME}
                        {' '}testnet (networkId {constants.TESTNET_NETWORK_ID}). Please make sure you are
                        {' '}connected to the {constants.TESTNET_NAME} testnet and try requesting ether again.
                    </div>
                );

            case errorTypes.faucetRequestFailed:
                return (
                    <div>
                        An unexpected error occurred while trying to request test Ether from our faucet.
                        {' '}Please refresh the page and try again.
                    </div>
                );

            case errorTypes.faucetQueueIsFull:
                return (
                    <div>
                        Our test Ether faucet queue is full. Please try requesting test Ether again later.
                    </div>
                );

            case errorTypes.mintingFailed:
                return (
                    <div>
                        Minting your test tokens failed unexpectedly. Please refresh the page and try again.
                    </div>
                );

            case errorTypes.allowanceSettingFailed:
                return (
                    <div>
                        An unexpected error occurred while trying to set your test token allowance.
                        {' '}Please refresh the page and try again.
                    </div>
                );

            case undefined:
                return; // No error to show

            default:
                throw utils.spawnSwitchErr('errorType', this.state.errorType);
        }
    }
    private async onToggleAllowanceAsync(assetToken: Token) {
        // Hack: for some reason setting allowance to 0 causes a `base fee exceeds gas limit` exception
        // Any edits to this hack should include changes to the `isAllowanceSet` method below
        // TODO: Investigate root cause for why allowance cannot be set to 0
        let newAllowanceAmount = 1;
        if (!this.isAllowanceSet(assetToken)) {
            newAllowanceAmount = DEFAULT_ALLOWANCE_AMOUNT;
        }
        const token = this.props.tokenBySymbol[assetToken.symbol];
        try {
            await this.props.blockchain.setExchangeAllowanceAsync(token, newAllowanceAmount);
        } catch (err) {
            const errMsg = '' + err;
            if (_.includes(errMsg, 'User denied transaction')) {
                return false;
            }
            utils.consoleLog(`Unexpected error encountered: ${err}`);
            utils.consoleLog(err.stack);
            await errorReporter.reportAsync(err);
            this.setState({
                errorType: errorTypes.allowanceSettingFailed,
            });
        }
    }
    private isAllowanceSet(token: Token) {
        return token.allowance !== 0 && token.allowance !== 1;
    }
    private async onMintTestTokensAsync(token: Token): Promise<boolean> {
        try {
            await this.props.blockchain.mintTestTokensAsync(token);
            return true;
        } catch (err) {
            const errMsg = '' + err;
            if (_.includes(errMsg, 'User has no associated addresses')) {
                this.props.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
                return false;
            }
            if (_.includes(errMsg, 'User denied transaction')) {
                return false;
            }
            utils.consoleLog(`Unexpected error encountered: ${err}`);
            utils.consoleLog(err.stack);
            await errorReporter.reportAsync(err);
            this.setState({
                errorType: errorTypes.mintingFailed,
            });
            return false;
        }
    }
    private async requestEtherAsync(): Promise<boolean> {
        if (this.props.userAddress === '' ||
            this.props.blockchainErr !== '') {
            this.props.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
            return false;
        }

        // If on another network other then the testnet our faucet serves test ether
        // from, we must show user an error message
        if (this.props.blockchain.networkId !== constants.TESTNET_NETWORK_ID) {
            this.setState({
                errorType: errorTypes.incorrectNetworkForFaucet,
            });
            return false;
        }

        await utils.sleepAsync(ARTIFICIAL_ETHER_REQUEST_DELAY);

        const response = await fetch(`${constants.ETHER_FAUCET_ENDPOINT}/${this.props.userAddress}`);
        const responseBody = await response.text();
        if (response.status !== 200) {
            utils.consoleLog(`Unexpected status code: ${response.status} -> ${responseBody}`);
            await errorReporter.reportAsync(new Error(`Faucet returned non-200: ${JSON.stringify(response)}`));
            const errorType = response.status === 503 ? errorTypes.faucetQueueIsFull : errorTypes.faucetRequestFailed;
            this.setState({
                errorType,
            });
            return false;
        }

        this.setState({
            isBalanceSpinnerVisible: true,
        });
        return true;
    }
    private onErrorDialogToggle(isOpen: boolean) {
        this.setState({
            errorType: undefined,
        });
    }
}

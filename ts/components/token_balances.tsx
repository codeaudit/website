import * as _ from 'lodash';
import * as React from 'react';
import {Dispatcher} from 'ts/redux/dispatcher';
import {TokenByAddress, Token, BlockchainErrs, BalanceErrs, Styles, ScreenWidths} from 'ts/types';
import {colors} from 'material-ui/styles';
import {Blockchain} from 'ts/blockchain';
import {zeroEx} from 'ts/utils/zero_ex';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {configs} from 'ts/utils/configs';
import {Side} from 'ts/types';
import {LifeCycleRaisedButton} from 'ts/components/ui/lifecycle_raised_button';
import {errorReporter} from 'ts/utils/error_reporter';
import {AllowanceToggle} from 'ts/components/inputs/allowance_toggle';
import {EthWethConversionDialog} from 'ts/components/eth_weth_conversion_dialog';
import {
    Dialog,
    Divider,
    FlatButton,
    RaisedButton,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeaderColumn,
    TableRowColumn,
} from 'material-ui';
import ReactTooltip = require('react-tooltip');
import BigNumber = require('bignumber.js');

const PRECISION = 5;
const ICON_DIMENSION = 40;
const ARTIFICIAL_ETHER_REQUEST_DELAY = 1000;
const TOKEN_TABLE_ROW_HEIGHT = 60;
const MAX_TOKEN_TABLE_HEIGHT = 420;
const ETHER_TOKEN_SYMBOL = 'WETH';
const TOKEN_COL_SPAN_LG = 2;
const TOKEN_COL_SPAN_SM = 1;

const styles: Styles = {
    bgColor: {
        backgroundColor: colors.grey50,
    },
};

interface TokenBalancesProps {
    blockchain: Blockchain;
    blockchainErr: BlockchainErrs;
    blockchainIsLoaded: boolean;
    dispatcher: Dispatcher;
    screenWidth: ScreenWidths;
    tokenByAddress: TokenByAddress;
    userAddress: string;
    userEtherBalance: number;
}

interface TokenBalancesState {
    errorType: BalanceErrs;
    isBalanceSpinnerVisible: boolean;
    isETHConversionDialogVisible: boolean;
}

export class TokenBalances extends React.Component<TokenBalancesProps, TokenBalancesState> {
    public constructor(props: TokenBalancesProps) {
        super(props);
        this.state = {
            errorType: undefined,
            isBalanceSpinnerVisible: false,
            isETHConversionDialogVisible: false,
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
        const etherIconUrl = this.getEtherIconUrl();
        const errorDialogActions = [
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.onErrorDialogToggle.bind(this, false)}
            />,
        ];
        const allTokenRowHeight = _.size(this.props.tokenByAddress) * TOKEN_TABLE_ROW_HEIGHT;
        const tokenTableHeight = allTokenRowHeight < MAX_TOKEN_TABLE_HEIGHT ?
                                 allTokenRowHeight :
                                 MAX_TOKEN_TABLE_HEIGHT;
        const isSmallScreen = this.props.screenWidth === ScreenWidths.SM;
        const tokenColSpan = isSmallScreen ? TOKEN_COL_SPAN_SM : TOKEN_COL_SPAN_LG;
        return (
            <div className="lg-px4 md-px4 sm-px1 pb2">
                <h3>Test ether</h3>
                <Divider />
                <div className="pt2 pb2">
                    In order to try out the 0x protocol demo app, request some test ether to pay for
                    gas costs. It might take a bit of time for the test ether to show up.
                </div>
                <Table
                    selectable={false}
                    style={styles.bgColor}
                >
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Currency</TableHeaderColumn>
                            <TableHeaderColumn>Balance</TableHeaderColumn>
                            <TableHeaderColumn className="sm-hide xs-hide" />
                            <TableHeaderColumn>Request{!isSmallScreen && ' from faucet'}</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        <TableRow key="ETH">
                            <TableRowColumn className="py1">
                                <img
                                    style={{width: ICON_DIMENSION, height: ICON_DIMENSION}}
                                    src={etherIconUrl}
                                />
                            </TableRowColumn>
                            <TableRowColumn>
                                {this.props.userEtherBalance.toFixed(PRECISION)} ETH
                                {this.state.isBalanceSpinnerVisible &&
                                (
                                    <span className="pl1">
                                        <i className="zmdi zmdi-spinner zmdi-hc-spin" />
                                    </span>
                                )
                                }
                            </TableRowColumn>
                            <TableRowColumn className="sm-hide xs-hide" />
                            <TableRowColumn>
                                <LifeCycleRaisedButton
                                    labelReady="Request"
                                    labelLoading="Sending..."
                                    labelComplete="Sent!"
                                    onClickAsyncFn={this.requestEtherAsync.bind(this)}
                                />
                            </TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
                <h3 className="pt2">Test tokens</h3>
                <Divider />
                <div className="pt2 pb2">
                    Mint some test tokens you'd like to use to generate or fill an order using 0x.
                </div>
                <Table
                    selectable={false}
                    bodyStyle={{height: tokenTableHeight}}
                    style={styles.bgColor}
                >
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn
                                colSpan={tokenColSpan}
                            >
                                Token
                            </TableHeaderColumn>
                            <TableHeaderColumn style={{paddingLeft: 3}}>Balance</TableHeaderColumn>
                            <TableHeaderColumn>0x allowance</TableHeaderColumn>
                            <TableHeaderColumn>Mint{!isSmallScreen && ' test tokens'}</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.renderTableRows()}
                    </TableBody>
                </Table>
                <Dialog
                    title="Oh oh"
                    titleStyle={{fontWeight: 100}}
                    actions={errorDialogActions}
                    open={!_.isUndefined(this.state.errorType)}
                    onRequestClose={this.onErrorDialogToggle.bind(this, false)}
                >
                    {this.renderErrorDialogBody()}
                </Dialog>
                <EthWethConversionDialog
                    isOpen={this.state.isETHConversionDialogVisible}
                    onComplete={this.onConversionAmountSelectedAsync.bind(this)}
                    onCancelled={this.toggleConversionDialog.bind(this)}
                    token={this.getWrappedEthToken()}/>
            </div>
        );
    }
    private renderTableRows() {
        if (!this.props.blockchainIsLoaded || this.props.blockchainErr !== '') {
            return '';
        }
        const isSmallScreen = this.props.screenWidth === ScreenWidths.SM;
        const tokenColSpan = isSmallScreen ? TOKEN_COL_SPAN_SM : TOKEN_COL_SPAN_LG;
        const actionPaddingX = isSmallScreen ? 2 : 24;
        return _.map(this.props.tokenByAddress, (token: Token, address: string) => {
            const isMintable = _.includes(configs.symbolsOfMintableTokens, token.symbol);
            return (
                <TableRow key={token.iconUrl} style={{height: TOKEN_TABLE_ROW_HEIGHT}}>
                    <TableRowColumn
                        colSpan={tokenColSpan}
                    >
                        {this.renderTokenName(token)}
                    </TableRowColumn>
                    <TableRowColumn style={{paddingRight: 3, paddingLeft: 3}}>
                        {this.renderAmount(token.balance, token.decimals)} {token.symbol}
                    </TableRowColumn>
                    <TableRowColumn>
                        <AllowanceToggle
                            blockchain={this.props.blockchain}
                            dispatcher={this.props.dispatcher}
                            token={token}
                            onErrorOccurred={this.onErrorOccurred.bind(this)}
                            userAddress={this.props.userAddress}
                        />
                    </TableRowColumn>
                    <TableRowColumn
                        style={{paddingLeft: actionPaddingX, paddingRight: actionPaddingX}}>
                        {isMintable ? (
                            <LifeCycleRaisedButton
                                labelReady="Mint"
                                labelLoading="Minting..."
                                labelComplete="Minted!"
                                onClickAsyncFn={this.onMintTestTokensAsync.bind(this, token)}
                            />
                        ) : null}
                        {token.symbol === ETHER_TOKEN_SYMBOL ? (
                            <RaisedButton
                                label="Convert"
                                onClick={this.toggleConversionDialog.bind(this)}
                            />
                        ) : null}
                    </TableRowColumn>
                </TableRow>
            );
        });
    }
    private renderAmount(amount: BigNumber, decimals: number) {
      const unitAmount = zeroEx.toUnitAmount(amount, decimals);
      return unitAmount.toNumber().toFixed(PRECISION);
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
                    className="mt2 ml2 sm-hide xs-hide"
                >
                    {token.name}
                </div>
                <ReactTooltip id={tooltipId}>{token.address}</ReactTooltip>
            </div>
        );
    }
    private renderErrorDialogBody() {
        switch (this.state.errorType) {
            case BalanceErrs.incorrectNetworkForFaucet:
                return (
                    <div>
                        Our faucet can only send test Ether to addresses on the {constants.TESTNET_NAME}
                        {' '}testnet (networkId {constants.TESTNET_NETWORK_ID}). Please make sure you are
                        {' '}connected to the {constants.TESTNET_NAME} testnet and try requesting ether again.
                    </div>
                );

            case BalanceErrs.faucetRequestFailed:
                return (
                    <div>
                        An unexpected error occurred while trying to request test Ether from our faucet.
                        {' '}Please refresh the page and try again.
                    </div>
                );

            case BalanceErrs.faucetQueueIsFull:
                return (
                    <div>
                        Our test Ether faucet queue is full. Please try requesting test Ether again later.
                    </div>
                );

            case BalanceErrs.mintingFailed:
                return (
                    <div>
                        Minting your test tokens failed unexpectedly. Please refresh the page and try again.
                    </div>
                );

            case BalanceErrs.wethConversionFailed:
                return (
                    <div>
                        Conversion between ether and ether tokens failed unexpectedly.
                        Please refresh the page and try again.
                    </div>
                );

            case BalanceErrs.allowanceSettingFailed:
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
    private onErrorOccurred(errorType: BalanceErrs) {
        this.setState({
            errorType,
        });
    }
    private toggleConversionDialog() {
        this.setState({
            isETHConversionDialogVisible: !this.state.isETHConversionDialogVisible,
        });
    }
    private async onConversionAmountSelectedAsync(direction: Side, value: BigNumber): Promise<boolean> {
        this.toggleConversionDialog();
        try {
            const token = this.getWrappedEthToken();
            let balance = token.balance;
            if (direction === Side.deposit) {
                await this.props.blockchain.convertEthToWrappedEthTokensAsync(token, value);
                balance = balance.plus(value);
            } else {
                await this.props.blockchain.convertWrappedEthTokensToEthAsync(token, value);
                balance = balance.minus(value);
            }
            const updatedToken = _.assign({}, token, {
                balance,
            });
            this.props.dispatcher.updateTokenByAddress([updatedToken]);
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
                errorType: BalanceErrs.wethConversionFailed,
            });
            return false;
        }
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
                errorType: BalanceErrs.mintingFailed,
            });
            return false;
        }
    }
    private async requestEtherAsync(): Promise<boolean> {
        if (this.props.userAddress === '') {
            this.props.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
            return false;
        }

        // If on another network other then the testnet our faucet serves test ether
        // from, we must show user an error message
        if (this.props.blockchain.networkId !== constants.TESTNET_NETWORK_ID) {
            this.setState({
                errorType: BalanceErrs.incorrectNetworkForFaucet,
            });
            return false;
        }

        await utils.sleepAsync(ARTIFICIAL_ETHER_REQUEST_DELAY);

        const response = await fetch(`${constants.ETHER_FAUCET_ENDPOINT}/${this.props.userAddress}`);
        const responseBody = await response.text();
        if (response.status !== constants.SUCCESS_STATUS) {
            utils.consoleLog(`Unexpected status code: ${response.status} -> ${responseBody}`);
            await errorReporter.reportAsync(new Error(`Faucet returned non-200: ${JSON.stringify(response)}`));
            const errorType = response.status === constants.UNAVAILABLE_STATUS ?
                              BalanceErrs.faucetQueueIsFull :
                              BalanceErrs.faucetRequestFailed;
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
    private getEtherIconUrl() {
        const tokens = _.values(this.props.tokenByAddress);
        const etherToken = _.find(tokens, {symbol: ETHER_TOKEN_SYMBOL});
        const etherIconUrl = this.props.tokenByAddress[etherToken.address].iconUrl;
        return etherIconUrl;
    }
    private getWrappedEthToken() {
        const tokens = _.values(this.props.tokenByAddress);
        return _.find(tokens, {symbol: ETHER_TOKEN_SYMBOL});
    }
}

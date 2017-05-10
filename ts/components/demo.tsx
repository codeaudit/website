import * as _ from 'lodash';
import * as React from 'react';
import {Switch, Route} from 'react-router-dom';
import {Dispatcher} from 'ts/redux/dispatcher';
import {State} from 'ts/redux/reducer';
import {utils} from 'ts/utils/utils';
import {RaisedButton, Paper} from 'material-ui';
import {colors} from 'material-ui/styles';
import {GenerateOrderForm} from 'ts/containers/generate_order_form';
import {TokenBalances} from 'ts/components/token_balances';
import {FillOrder} from 'ts/components/fill_order';
import {Blockchain} from 'ts/blockchain';
import {Validator} from 'ts/schemas/validator';
import {orderSchema} from 'ts/schemas/order_schema';
import {TradeHistory} from 'ts/components/trade_history/trade_history';
import {HashData, TokenByAddress, BlockchainErrs, Order, Fill, Side, Styles} from 'ts/types';
import {TopBar} from 'ts/components/top_bar';
import {Footer} from 'ts/components/footer';
import {Loading} from 'ts/components/ui/loading';
import {DemoMenu} from 'ts/components/demo_menu';
import {BlockchainErrDialog} from 'ts/components/blockchain_err_dialog';
import BigNumber = require('bignumber.js');

export interface DemoPassedProps {}

export interface DemoAllProps {
    blockchainErr: BlockchainErrs;
    blockchainIsLoaded: boolean;
    dispatcher: Dispatcher;
    hashData: HashData;
    networkId: number;
    orderFillAmount: BigNumber;
    tokenByAddress: TokenByAddress;
    userEtherBalance: number;
    userAddress: string;
    shouldBlockchainErrDialogBeOpen: boolean;
    userSuppliedOrderCache: Order;
    location: Location;
}

interface DemoAllState {
    prevNetworkId: number;
    prevUserAddress: string;
}

const styles: Styles = {
    button: {
        color: 'white',
    },
    headline: {
        fontSize: 20,
        fontWeight: 400,
        marginBottom: 12,
        paddingTop: 16,
    },
    inkBar: {
        background: colors.amber600,
    },
    menuItem: {
        padding: '0px 16px 0px 48px',
    },
    tabItemContainer: {
        background: colors.blueGrey500,
        borderRadius: '4px 4px 0 0',
    },
};

export class Demo extends React.Component<DemoAllProps, DemoAllState> {
    private blockchain: Blockchain;
    private sharedOrderIfExists: Order;
    constructor(props: DemoAllProps) {
        super(props);
        this.sharedOrderIfExists = this.getSharedOrderIfExists();
        this.state = {
            prevNetworkId: this.props.networkId,
            prevUserAddress: this.props.userAddress,
        };
    }
    public componentDidMount() {
        window.scrollTo(0, 0);
    }
    public componentWillMount() {
        this.blockchain = new Blockchain(this.props.dispatcher);
    }
    public componentWillUnmount() {
        // We re-set the entire redux state when the demo is unmounted so that when it is re-rendered
        // the initialization process always occurs from the same base state. This helps avoid
        // initialization inconsistencies (i.e While the demo was unrendered, the user might have
        // become disconnected from their backing Ethereum node, changes user accounts, etc...)
        this.props.dispatcher.resetState();
    }
    public componentWillReceiveProps(nextProps: DemoAllProps) {
        if (nextProps.networkId !== this.state.prevNetworkId) {
            this.blockchain.networkIdUpdatedFireAndForgetAsync(nextProps.networkId);
            this.setState({
                prevNetworkId: nextProps.networkId,
            });
        }
        if (nextProps.userAddress !== this.state.prevUserAddress) {
            this.blockchain.userAddressUpdatedFireAndForgetAsync(nextProps.userAddress);
            const tokens = _.values(nextProps.tokenByAddress);
            if (nextProps.userAddress !== '' && nextProps.blockchainIsLoaded) {
                this.blockchain.updateTokenBalancesAndAllowancesAsync(tokens);
            }
            this.setState({
                prevUserAddress: nextProps.userAddress,
            });
        }
    }
    public render() {
        const updateShouldBlockchainErrDialogBeOpen = this.props.dispatcher
                .updateShouldBlockchainErrDialogBeOpen.bind(this.props.dispatcher);

        return (
            <div>
                <TopBar
                    userAddress={this.props.userAddress}
                    blockchainIsLoaded={this.props.blockchainIsLoaded}
                    location={this.props.location}
                />
                <div id="demo" className="mx-auto max-width-4 pt4">
                    <Paper className="mb3 mt2">
                        <div className="mx-auto flex">
                            <div
                                className="col col-2 pr2 pt1 sm-hide xs-hide"
                                style={{overflow: 'hidden', backgroundColor: 'rgb(39, 39, 39)', color: 'white'}}
                            >
                                <DemoMenu menuItemStyle={{color: 'white'}} />
                            </div>
                            <div className="col col-10">
                                <div className="py2" style={{backgroundColor: colors.grey50}}>
                                    {this.props.blockchainIsLoaded ?
                                        <Switch>
                                            <Route path="/demo/fill" render={this.renderFillOrder.bind(this)} />
                                            <Route path="/demo/balances" render={this.renderTokenBalances.bind(this)} />
                                            <Route path="/demo/trades" component={this.renderTradeHistory.bind(this)} />
                                            <Route path="/" render={this.renderGenerateOrderForm.bind(this)} />
                                        </Switch> :
                                        <Loading />
                                    }
                                </div>
                            </div>
                        </div>
                    </Paper>
                    <BlockchainErrDialog
                        blockchain={this.blockchain}
                        blockchainErr={this.props.blockchainErr}
                        isOpen={this.props.shouldBlockchainErrDialogBeOpen}
                        userAddress={this.props.userAddress}
                        toggleDialogFn={updateShouldBlockchainErrDialogBeOpen}
                    />
                </div>
                <Footer />
            </div>
        );
    }
    private renderTradeHistory() {
        return (
            <TradeHistory
                tokenByAddress={this.props.tokenByAddress}
                userAddress={this.props.userAddress}
            />
        );
    }
    private renderTokenBalances() {
        return (
            <TokenBalances
                blockchain={this.blockchain}
                blockchainErr={this.props.blockchainErr}
                blockchainIsLoaded={this.props.blockchainIsLoaded}
                dispatcher={this.props.dispatcher}
                tokenByAddress={this.props.tokenByAddress}
                userAddress={this.props.userAddress}
                userEtherBalance={this.props.userEtherBalance}
            />
        );
    }
    private renderFillOrder(match: any, location: Location, history: History) {
        const initialFillOrder = !_.isUndefined(this.props.userSuppliedOrderCache) ?
                                 this.props.userSuppliedOrderCache :
                                 this.sharedOrderIfExists;
        return (
            <FillOrder
                blockchain={this.blockchain}
                blockchainErr={this.props.blockchainErr}
                initialOrder={initialFillOrder}
                orderFillAmount={this.props.orderFillAmount}
                userAddress={this.props.userAddress}
                tokenByAddress={this.props.tokenByAddress}
                dispatcher={this.props.dispatcher}
            />
        );
    }
    private renderGenerateOrderForm(match: any, location: Location, history: History) {
        return (
            <GenerateOrderForm
                blockchain={this.blockchain}
                hashData={this.props.hashData}
                dispatcher={this.props.dispatcher}
            />
        );
    }
    private getSharedOrderIfExists(): Order {
        const queryString = window.location.search;
        if (queryString.length === 0) {
            return;
        }
        const queryParams = queryString.substring(1).split('&');
        const orderQueryParam = _.find(queryParams, (queryParam) => {
            const queryPair = queryParam.split('=');
            return queryPair[0] === 'order';
        });
        if (_.isUndefined(orderQueryParam)) {
            return;
        }
        const orderPair = orderQueryParam.split('=');
        if (orderPair.length !== 2) {
            return;
        }

        const validator = new Validator();
        const order = JSON.parse(decodeURIComponent(orderPair[1]));
        const validationResult = validator.validate(order, orderSchema);
        if (validationResult.errors.length > 0) {
            return;
        }
        return order;
    }
}

import * as _ from 'lodash';
import * as React from 'react';
import {Dispatcher} from 'ts/redux/dispatcher';
import {State} from 'ts/redux/reducer';
import {utils} from 'ts/utils/utils';
import {RaisedButton, Menu, MenuItem, Paper} from 'material-ui';
import {colors} from 'material-ui/styles';
import {GenerateOrderForm} from 'ts/containers/generate_order_form';
import {TokenBalances} from 'ts/components/token_balances';
import {FillOrder} from 'ts/components/fill_order';
import {Blockchain} from 'ts/blockchain';
import {Validator} from 'ts/schemas/validator';
import {orderSchema} from 'ts/schemas/order_schema';
import {HashData, TokenByAddress, MenuItemValue, BlockchainErrs, Order, Fill, Side} from 'ts/types';
import {BlockchainErrDialog} from 'ts/components/blockchain_err_dialog';
import {TradeHistory} from 'ts/components/trade_history/trade_history';
import {TopBar} from 'ts/components/top_bar';
import BigNumber = require('bignumber.js');

export interface DemoPassedProps {}

export interface DemoAllProps {
    blockchainErr: BlockchainErrs;
    blockchainIsLoaded: boolean;
    dispatcher: Dispatcher;
    hashData: HashData;
    kind: string;
    networkId: number;
    orderFillAmount: BigNumber;
    tokenByAddress: TokenByAddress;
    userEtherBalance: number;
    userAddress: string;
    shouldBlockchainErrDialogBeOpen: boolean;
    userSuppliedOrderCache: Order;
}

interface DemoAllState {
    kind: string;
    prevNetworkId: number;
    prevUserAddress: string;
    selectedMenuItem: MenuItemValue;
}

const styles: React.CSSProperties = {
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
        let selectedMenuItem = MenuItemValue.generate;
        this.sharedOrderIfExists = this.getSharedOrderIfExists();
        if (!_.isUndefined(this.sharedOrderIfExists)) {
            selectedMenuItem = MenuItemValue.fill;
        }
        this.state = {
            kind: 'form',
            prevNetworkId: this.props.networkId,
            prevUserAddress: this.props.userAddress,
            selectedMenuItem,
        };
    }
    public componentWillMount() {
        this.blockchain = new Blockchain(this.props.dispatcher);
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

        let visibleComponent;
        switch (this.state.selectedMenuItem) {
            case MenuItemValue.generate:
                visibleComponent = (
                    <GenerateOrderForm
                        blockchain={this.blockchain}
                        hashData={this.props.hashData}
                        triggerMenuClick={this.triggerMenuClick.bind(this)}
                        dispatcher={this.props.dispatcher}
                    />
                );
                break;
            case MenuItemValue.fill:
                const initialFillOrder = !_.isUndefined(this.props.userSuppliedOrderCache) ?
                                         this.props.userSuppliedOrderCache :
                                         this.sharedOrderIfExists;
                visibleComponent = (
                    <FillOrder
                        blockchain={this.blockchain}
                        blockchainErr={this.props.blockchainErr}
                        initialOrder={initialFillOrder}
                        orderFillAmount={this.props.orderFillAmount}
                        userAddress={this.props.userAddress}
                        tokenByAddress={this.props.tokenByAddress}
                        triggerMenuClick={this.triggerMenuClick.bind(this)}
                        dispatcher={this.props.dispatcher}
                    />
                );
                break;

            case MenuItemValue.balances:
                visibleComponent = (
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
                break;

            case MenuItemValue.tradeHistory:
                visibleComponent = (
                    <TradeHistory
                        tokenByAddress={this.props.tokenByAddress}
                        userAddress={this.props.userAddress}
                    />
                );
                break;

            default:
                throw utils.spawnSwitchErr('MenuItemValue', this.state.selectedMenuItem);
        }

        const menuIconStyles = {
            fontSize: 20,
        };
        return (
            <div>
                <TopBar
                    userAddress={this.props.userAddress}
                    blockchainIsLoaded={this.props.blockchainIsLoaded}
                />
                <div className="mx-auto max-width-4">
                    <div className="mx-auto flex">
                        <div className="col col-2 mt2 pr2" style={{overflow: 'hidden'}}>
                            {/*
                              * HACK: We must add the disableAutoFocus set to true on the Menu component
                              * otherwise it steals the focus from other text input components.
                              * Source: https://github.com/callemall/material-ui/issues/4387
                              */}
                            <Menu disableAutoFocus={true}>
                                <MenuItem
                                    innerDivStyle={styles.menuItem}
                                    primaryText="Generate order"
                                    leftIcon={<i style={menuIconStyles} className="zmdi zmdi-code" />}
                                    onTouchTap={this.triggerMenuClick.bind(this, MenuItemValue.generate)}
                                />
                                <MenuItem
                                    innerDivStyle={styles.menuItem}
                                    primaryText="Fill order"
                                    leftIcon={<i style={menuIconStyles} className="zmdi zmdi-mail-send" />}
                                    onTouchTap={this.triggerMenuClick.bind(this, MenuItemValue.fill)}
                                />
                                <MenuItem
                                    innerDivStyle={styles.menuItem}
                                    primaryText="Balances"
                                    leftIcon={<i style={menuIconStyles} className="zmdi zmdi-balance-wallet" />}
                                    onTouchTap={this.triggerMenuClick.bind(this, MenuItemValue.balances)}
                                />
                                <MenuItem
                                    innerDivStyle={styles.menuItem}
                                    primaryText="Trade history"
                                    leftIcon={<i style={menuIconStyles} className="zmdi zmdi-book" />}
                                    onTouchTap={this.triggerMenuClick.bind(this, MenuItemValue.tradeHistory)}
                                />
                            </Menu>
                        </div>
                        <div className="col col-10">
                            <Paper className="mb3">
                                <div className="py2">
                                    {this.props.blockchainIsLoaded ?
                                        visibleComponent :
                                        this.renderLoading()
                                    }
                                </div>
                            </Paper>
                        </div>
                    </div>
                    <BlockchainErrDialog
                        blockchain={this.blockchain}
                        blockchainErr={this.props.blockchainErr}
                        isOpen={this.props.shouldBlockchainErrDialogBeOpen}
                        userAddress={this.props.userAddress}
                        toggleDialogFn={updateShouldBlockchainErrDialogBeOpen}
                    />
                </div>
            </div>
        );
    }
    private renderLoading() {
        return (
            <div className="pt4" style={{height: 500}}>
                <Paper className="mx-auto" style={{width: 417}}>
                    <img className="p1" src="/images/loading.gif" width={400}  />
                    <div className="center" style={{paddingBottom: 11}}>Connecting to the blockchain...</div>
                </Paper>
            </div>
        );
    }
    private triggerMenuClick(selectedMenuItem: MenuItemValue) {
        if (!this.props.blockchainIsLoaded) {
            if (this.props.blockchainErr !== '') {
              this.props.dispatcher.updateShouldBlockchainErrDialogBeOpen(true);
            }
            return; // Ignore menu click
        }
        this.setState({
            selectedMenuItem,
        });
    }
    private onChangeUIClick(kind: string) {
        this.setState({
            kind,
        });
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

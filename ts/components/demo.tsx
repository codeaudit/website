import * as _ from 'lodash';
import * as React from 'react';
import {Dispatcher} from 'ts/redux/dispatcher';
import {State} from 'ts/redux/reducer';
import {utils} from 'ts/utils/utils';
import {RaisedButton, Menu, MenuItem, Paper} from 'material-ui';
import {colors} from 'material-ui/styles';
import {GenerateOrderForm} from 'ts/containers/generate_order_form';
import {GenerateOrderFlow} from 'ts/containers/generate_order_flow';
import {TokenBalances} from 'ts/components/token_balances';
import {FillOrder} from 'ts/components/fill_order';
import {Blockchain} from 'ts/blockchain';
import {Validator} from 'ts/schemas/validator';
import {orderSchema} from 'ts/schemas/order_schema';
import {HashData, TokenBySymbol, MenuItemValue, BlockchainErrs, Order, Fill} from 'ts/types';
import {BlockchainErrDialog} from 'ts/components/blockchain_err_dialog';
import {TradeHistory} from 'ts/components/trade_history/trade_history';
import {TopBar} from 'ts/components/top_bar';

export interface DemoPassedProps {}

export interface DemoAllProps {
    blockchainErr: BlockchainErrs;
    blockchainIsLoaded: boolean;
    dispatcher: Dispatcher;
    hashData: HashData;
    kind: string;
    networkId: number;
    orderFillAmount: number;
    tokenBySymbol: TokenBySymbol;
    userEtherBalance: number;
    userAddress: string;
    shouldBlockchainErrDialogBeOpen: boolean;
    historicalFills: Fill[];
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
            const tokens = _.values(nextProps.tokenBySymbol);
            if (nextProps.userAddress !== '' && nextProps.blockchainIsLoaded) {
                this.blockchain.updateTokenBalancesAndAllowancesAsync(tokens);
            }
            this.setState({
                prevUserAddress: nextProps.userAddress,
            });
        }
    }
    public render() {
        let GenerateOrder = GenerateOrderFlow;
        if (this.state.kind === 'form') {
            GenerateOrder = GenerateOrderForm;
        }
        const updateShouldBlockchainErrDialogBeOpen = this.props.dispatcher
                .updateShouldBlockchainErrDialogBeOpen.bind(this.props.dispatcher);

        let visibleComponent;
        switch (this.state.selectedMenuItem) {
            case MenuItemValue.generate:
                visibleComponent = (
                    <GenerateOrder
                        blockchain={this.blockchain}
                        hashData={this.props.hashData}
                        triggerMenuClick={this.triggerMenuClick.bind(this)}
                        dispatcher={this.props.dispatcher}
                    />
                );
                break;
            case MenuItemValue.fill:
                visibleComponent = (
                    <FillOrder
                        blockchain={this.blockchain}
                        blockchainErr={this.props.blockchainErr}
                        initialOrder={this.sharedOrderIfExists}
                        orderFillAmount={this.props.orderFillAmount}
                        userAddress={this.props.userAddress}
                        tokenBySymbol={this.props.tokenBySymbol}
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
                        tokenBySymbol={this.props.tokenBySymbol}
                        userAddress={this.props.userAddress}
                        userEtherBalance={this.props.userEtherBalance}
                    />
                );
                break;

            case MenuItemValue.tradeHistory:
                visibleComponent = (
                    <TradeHistory
                        blockchain={this.blockchain}
                        blockchainErr={this.props.blockchainErr}
                        blockchainIsLoaded={this.props.blockchainIsLoaded}
                        tokenBySymbol={this.props.tokenBySymbol}
                        historicalFills={this.props.historicalFills}
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
                        <div className="col col-2 mt2" style={{overflow: 'hidden'}}>
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
                            <Paper className="ml2">
                                <div className="py2">
                                    {visibleComponent}
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
                    <div className="flex pb2">
                        <RaisedButton
                            className="mr2"
                            label="Form"
                            onTouchTap={this.onChangeUIClick.bind(this, 'form')}
                        />
                        <RaisedButton
                            label="Flow"
                            onTouchTap={this.onChangeUIClick.bind(this, 'flow')}
                        />
                    </div>
                </div>
            </div>
        );
    }
    private triggerMenuClick(selectedMenuItem: MenuItemValue) {
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

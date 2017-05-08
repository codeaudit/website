import * as _ from 'lodash';
import * as React from 'react';
import {Dispatcher} from 'ts/redux/dispatcher';
import {State} from 'ts/redux/reducer';
import {utils} from 'ts/utils/utils';
import {RaisedButton, Paper} from 'material-ui';
import {colors} from 'material-ui/styles';
import {GenerateOrderForm} from 'ts/containers/generate_order_form';
import {TokenBalances} from 'ts/components/token_balances';
import {FillOrder} from 'ts/components/fill_order';
import {MenuItem} from 'ts/components/ui/menu_item';
import {Blockchain} from 'ts/blockchain';
import {Validator} from 'ts/schemas/validator';
import {orderSchema} from 'ts/schemas/order_schema';
import {HashData, TokenByAddress, MenuItemValue, BlockchainErrs, Order, Fill, Side} from 'ts/types';
import {BlockchainErrDialog} from 'ts/components/blockchain_err_dialog';
import {TradeHistory} from 'ts/components/trade_history/trade_history';
import {TopBar} from 'ts/components/top_bar';
import {Footer} from 'ts/components/footer';
import {Loading} from 'ts/components/ui/loading';
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
    menuIcon: {
        fontSize: 20,
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
            prevNetworkId: this.props.networkId,
            prevUserAddress: this.props.userAddress,
            selectedMenuItem,
        };
    }
    public componentDidMount() {
        window.scrollTo(0, 0);
    }
    public componentWillMount() {
        this.blockchain = new Blockchain(this.props.dispatcher);
    }
    public componentWillUnmount() {
        this.props.dispatcher.updateBlockchainIsLoaded(false);
        this.props.dispatcher.updateNetworkId(undefined);
        this.props.dispatcher.updateUserAddress('');
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
                                className="col col-2 pr2 pt1"
                                style={{overflow: 'hidden', backgroundColor: 'rgb(39, 39, 39)', color: 'white'}}
                            >
                                <MenuItem
                                    onClickFn={this.triggerMenuClick.bind(this, MenuItemValue.generate)}
                                >
                                    {this.renderMenuItemWithIcon('Generate order', 'zmdi-code')}
                                </MenuItem>
                                <MenuItem
                                    onClickFn={this.triggerMenuClick.bind(this, MenuItemValue.fill)}
                                >
                                    {this.renderMenuItemWithIcon('Fill order', 'zmdi-mail-send')}
                                </MenuItem>
                                <MenuItem
                                    onClickFn={this.triggerMenuClick.bind(this, MenuItemValue.balances)}
                                >
                                    {this.renderMenuItemWithIcon('Balances', 'zmdi-balance-wallet')}
                                </MenuItem>
                                <MenuItem
                                    onClickFn={this.triggerMenuClick.bind(this, MenuItemValue.tradeHistory)}
                                >
                                    {this.renderMenuItemWithIcon('Trade history', 'zmdi-book')}
                                </MenuItem>
                            </div>
                            <div className="col col-10">
                                <div className="py2" style={{backgroundColor: colors.grey50}}>
                                    {this.props.blockchainIsLoaded ?
                                        visibleComponent :
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
    private renderMenuItemWithIcon(title: string, iconName: string) {
        return (
            <div className="flex" style={{fontWeight: 100}}>
                <div className="pr1 pl2">
                    <i style={styles.menuIcon} className={`zmdi ${iconName}`} />
                </div>
                <div className="pl1">
                    {title}
                </div>
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

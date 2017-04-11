import * as _ from 'lodash';
import * as React from 'react';
import {Dispatcher} from 'ts/redux/dispatcher';
import {State} from 'ts/redux/reducer';
import {Tabs, Tab, Paper, RaisedButton} from 'material-ui';
import {colors} from 'material-ui/styles';
import {GenerateOrderForm} from 'ts/containers/generate_order_form';
import {GenerateOrderFlow} from 'ts/containers/generate_order_flow';
import {TokenBalances} from 'ts/components/token_balances';
import {FillOrder} from 'ts/components/fill_order';
import {Blockchain} from 'ts/blockchain';
import {Validator} from 'ts/schemas/validator';
import {orderSchema} from 'ts/schemas/order_schema';
import {HashData, TokenBySymbol, TabValue, BlockchainErrs, Order, Fill} from 'ts/types';
import {BlockchainErrDialog} from 'ts/components/blockchain_err_dialog';
import {TradeHistory} from 'ts/components/trade_history/trade_history';

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
    selectedTab: TabValue;
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
    paper: {
        display: 'inline-block',
        position: 'relative',
        textAlign: 'center',
        width: '100%',
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
        let selectedTab = TabValue.generate;
        this.sharedOrderIfExists = this.getSharedOrderIfExists();
        if (!_.isUndefined(this.sharedOrderIfExists)) {
            selectedTab = TabValue.fill;
        }
        selectedTab = TabValue.tradeHistory;
        this.state = {
            kind: 'form',
            prevNetworkId: this.props.networkId,
            prevUserAddress: this.props.userAddress,
            selectedTab,
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
            this.setState({
                prevUserAddress: nextProps.userAddress,
            });
        }
    }
    public render() {
        let finalPaperStyle = styles.paper;
        let GenerateOrder = GenerateOrderFlow;
        if (this.state.kind === 'form') {
            GenerateOrder = GenerateOrderForm;
        } else {
            finalPaperStyle = {
                ...styles.paper,
                height: 486,
                maxWidth: 600,
            };
        }
        const updateShouldBlockchainErrDialogBeOpen = this.props.dispatcher
                .updateShouldBlockchainErrDialogBeOpen.bind(this.props.dispatcher);
        return (
            <div>
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
                <Paper style={finalPaperStyle} zDepth={3}>
                    <Tabs
                        tabItemContainerStyle={styles.tabItemContainer}
                        inkBarStyle={styles.inkBar}
                        value={this.state.selectedTab}
                        onChange={this.triggerTabChange.bind(this)}
                    >
                        <Tab
                            value={TabValue.generate}
                            label="Generate Order"
                            buttonStyle={styles.button}
                        >
                        <GenerateOrder
                            blockchain={this.blockchain}
                            hashData={this.props.hashData}
                            triggerTabChange={this.triggerTabChange.bind(this)}
                            dispatcher={this.props.dispatcher}
                        />
                        </Tab>
                        <Tab
                            value={TabValue.fill}
                            label="Fill order"
                            buttonStyle={styles.button}
                        >
                          <div>
                            <FillOrder
                                blockchain={this.blockchain}
                                blockchainErr={this.props.blockchainErr}
                                initialOrder={this.sharedOrderIfExists}
                                orderFillAmount={this.props.orderFillAmount}
                                userAddress={this.props.userAddress}
                                tokenBySymbol={this.props.tokenBySymbol}
                                triggerTabChange={this.triggerTabChange.bind(this)}
                                dispatcher={this.props.dispatcher}
                            />
                          </div>
                        </Tab>
                        <Tab
                          value={TabValue.setup}
                          label="My test tokens"
                          buttonStyle={styles.button}
                        >
                            <TokenBalances
                                blockchain={this.blockchain}
                                blockchainErr={this.props.blockchainErr}
                                blockchainIsLoaded={this.props.blockchainIsLoaded}
                                dispatcher={this.props.dispatcher}
                                tokenBySymbol={this.props.tokenBySymbol}
                                userAddress={this.props.userAddress}
                                userEtherBalance={this.props.userEtherBalance}
                            />
                        </Tab>
                        <Tab
                          value={TabValue.tradeHistory}
                          label="History"
                          buttonStyle={styles.button}
                        >
                            <div className="mx-auto" style={{width: 410}}>
                                <TradeHistory
                                    blockchain={this.blockchain}
                                    blockchainErr={this.props.blockchainErr}
                                    blockchainIsLoaded={this.props.blockchainIsLoaded}
                                    tokenBySymbol={this.props.tokenBySymbol}
                                    historicalFills={this.props.historicalFills}
                                />
                            </div>
                        </Tab>
                    </Tabs>
                </Paper>
                <BlockchainErrDialog
                    blockchain={this.blockchain}
                    blockchainErr={this.props.blockchainErr}
                    isOpen={this.props.shouldBlockchainErrDialogBeOpen}
                    userAddress={this.props.userAddress}
                    toggleDialogFn={updateShouldBlockchainErrDialogBeOpen}
                />
            </div>
        );
    }
    private triggerTabChange(selectedTab: TabValue) {
        this.setState({
            selectedTab,
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

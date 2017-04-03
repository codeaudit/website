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
import {HashData, TokenBySymbol, TabValue, BlockchainErrs} from 'ts/types';
import {ContractsNotDeployedDialog} from 'ts/components/contracts_not_deployed_dialog';

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
    orderMakerAddress: string;
    shouldNotDeployedDialogBeOpen: boolean;
}

interface DemoAllState {
    kind: string;
    prevNetworkId: number;
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
    constructor(props: DemoAllProps) {
        super(props);
        this.state = {
            kind: 'form',
            prevNetworkId: this.props.networkId,
            selectedTab: TabValue.generate,
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
        const updateShouldNotDeployedDialogBeOpen = this.props.dispatcher
                .updateShouldNotDeployedDialogBeOpen.bind(this.props.dispatcher);
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
                                orderFillAmount={this.props.orderFillAmount}
                                orderMakerAddress={this.props.orderMakerAddress}
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
                                userEtherBalance={this.props.userEtherBalance}
                            />
                        </Tab>
                    </Tabs>
                </Paper>
                <ContractsNotDeployedDialog
                    blockchain={this.blockchain}
                    isOpen={this.props.shouldNotDeployedDialogBeOpen}
                    toggleDialogFn={updateShouldNotDeployedDialogBeOpen}
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
}

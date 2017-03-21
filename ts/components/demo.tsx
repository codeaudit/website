import * as _ from 'lodash';
import * as React from 'react';
import {Dispatch} from 'redux';
import {State} from 'ts/redux/reducer';
import {Tabs, Tab, Paper} from 'material-ui';
import {colors} from 'material-ui/styles';
import {GenerateOrderForm} from 'ts/containers/generate_order_form';
import {GenerateOrderFlow} from 'ts/containers/generate_order_flow';
import {TokenBalances} from 'ts/components/token_balances';
import {FillOrder} from 'ts/components/fill_order';
import {Blockchain} from 'ts/blockchain';
import {HashData} from 'ts/types';

export interface DemoPassedProps {
    kind: string;
}

export interface DemoAllProps {
    dispatch: Dispatch<State>;
    networkId: number;
    hashData: HashData;
    kind: string;
}

interface DemoAllState {
    prevNetworkId: number;
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
            prevNetworkId: this.props.networkId,
        };
    }
    public componentWillMount() {
        this.blockchain = new Blockchain(this.props.dispatch);
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
        if (this.props.kind === 'form') {
            GenerateOrder = GenerateOrderForm;
        } else {
            finalPaperStyle = {
                ...styles.paper,
                height: 486,
                maxWidth: 600,
            };
        }
        return (
            <Paper style={finalPaperStyle} zDepth={3}>
                <Tabs
                    tabItemContainerStyle={styles.tabItemContainer}
                    inkBarStyle={styles.inkBar}
                    initialSelectedIndex={0}
                >
                    <Tab
                        label="Generate Order"
                        buttonStyle={styles.button}
                    >
                    <GenerateOrder
                        blockchain={this.blockchain}
                        hashData={this.props.hashData}
                    />
                    </Tab>
                    <Tab
                        label="Fill order"
                        buttonStyle={styles.button}
                    >
                      <div>
                        <FillOrder />
                      </div>
                    </Tab>
                    <Tab
                      label="My test tokens"
                      buttonStyle={styles.button}
                    >
                        <TokenBalances />
                    </Tab>
                </Tabs>
            </Paper>
        );
    }
}

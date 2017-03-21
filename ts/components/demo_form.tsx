import * as _ from 'lodash';
import * as React from 'react';
import {Dispatch} from 'redux';
import {State} from 'ts/redux/reducer';
import {Tabs, Tab, Paper} from 'material-ui';
import {colors} from 'material-ui/styles';
import {GenerateOrderForm} from 'ts/containers/generate_order_form';
import {TokenBalances} from 'ts/components/token_balances';
import {FillOrder} from 'ts/components/fill_order';
import {Blockchain} from 'ts/blockchain';

export interface DemoFormPassedProps {}

export interface DemoFormAllProps {
    dispatch: Dispatch<State>;
    networkId: number;
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

export class DemoForm extends React.Component<DemoFormAllProps, undefined> {
    private blockchain: Blockchain;
    public componentWillMount() {
        this.blockchain = new Blockchain(this.props.dispatch);
    }
    public render() {
        this.blockchain.networkIdUpdatedFireAndForgetAsync(this.props.networkId);
        return (
            <Paper style={styles.paper} zDepth={3}>
                <Tabs
                    tabItemContainerStyle={styles.tabItemContainer}
                    inkBarStyle={styles.inkBar}
                    initialSelectedIndex={0}
                >
                    <Tab
                        label="Generate Order"
                        buttonStyle={styles.button}
                    >
                    <GenerateOrderForm blockchain={this.blockchain} />
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

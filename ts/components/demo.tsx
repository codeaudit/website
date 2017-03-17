import * as _ from 'lodash';
import * as React from 'react';
import {Tabs, Tab, Paper} from 'material-ui';
import {colors} from 'material-ui/styles';
import {GenerateOrder} from 'ts/containers/generate_order';
import {TokenBalances} from 'ts/components/token_balances';
import {FillOrder} from 'ts/components/fill_order';

interface DemoProps {}

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
        height: 486,
        position: 'relative',
        textAlign: 'center',
        width: '100%',
    },
    tabItemContainer: {
        background: colors.blueGrey500,
        borderRadius: '4px 4px 0 0',
    },
};

export class Demo extends React.Component<DemoProps, undefined> {
    public render() {
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
                    <GenerateOrder />
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

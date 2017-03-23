import * as _ from 'lodash';
import * as React from 'react';
import {TokenBySymbol} from 'ts/types';
import {
    RaisedButton,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeaderColumn,
    TableRowColumn,
} from 'material-ui';

interface Balance {
    allowance: number;
    balance: number;
    iconUrl: string;
    symbol: string;
}

const PRECISION = 5;

interface TokenBalancesProps {
    tokenBySymbol: TokenBySymbol;
}

interface TokenBalancesState {}

export class TokenBalances extends React.Component<TokenBalancesProps, TokenBalancesState> {
    private dummyBalances: Balance[];
    constructor(props: TokenBalancesProps) {
        super(props);
        this.dummyBalances = this.generateDummyBalances();
    }
    public render() {
        return (
            <div>
                <h3 className="px4 center">Test tokens</h3>
                <div className="px2 pb2">
                    In order to try out the 0x protocol demo app, you can request test tokens below
                </div>
                <Table selectable={false} bodyStyle={{height: 289}}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>Token</TableHeaderColumn>
                            <TableHeaderColumn>Balance</TableHeaderColumn>
                            <TableHeaderColumn>0x allowance</TableHeaderColumn>
                            <TableHeaderColumn>Get free test tokens</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.renderTableRows()}
                    </TableBody>
                </Table>
            </div>
        );
    }
    private renderTableRows() {
        const iconDimension = 40;
        return _.map(this.dummyBalances, (balance: Balance) => {
            return (
                <TableRow key={balance.symbol}>
                    <TableRowColumn>
                        <img
                            style={{width: iconDimension, height: iconDimension}}
                            src={balance.iconUrl}
                        />
                    </TableRowColumn>
                    <TableRowColumn>{balance.balance.toFixed(PRECISION)} {balance.symbol}</TableRowColumn>
                    <TableRowColumn>{balance.allowance.toFixed(PRECISION)} {balance.symbol}</TableRowColumn>
                    <TableRowColumn>
                        <RaisedButton
                            label="Get"
                            style={{margin: 12, width: '100%'}}
                            onClick={this.onSendTestToken.bind(this, balance.symbol)}
                        />
                    </TableRowColumn>
                </TableRow>
            );
        });
    }
    private generateDummyBalances(): Balance[] {
        const dummyBalances: Balance[] = [];
        _.each(this.props.tokenBySymbol, (token, symbol) => {
            const balance = Math.random() * 100;
            dummyBalances.push({
                allowance: Math.random() * balance,
                balance,
                iconUrl: token.iconUrl,
                symbol,
            });
        });
        return dummyBalances;
    }
    private onSendTestToken(symbol: string) {
        // TODO: send some test tokens to account
    }
}

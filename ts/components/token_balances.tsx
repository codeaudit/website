import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {
    RaisedButton,
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeaderColumn,
    TableRowColumn,
} from 'material-ui';
import {tokenBySymbol} from 'ts/tokenBySymbol';
import {Side, SideToAssetToken, AssetToken} from 'ts/types';

interface Balance {
    allowance: number;
    balance: number;
    iconUrl: string;
    symbol: string;
}
const DUMMY_BALANCES: Balance[] = [];
_.each(tokenBySymbol, (token, symbol) => {
    const balance = Math.random() * 100;
    DUMMY_BALANCES.push({
        allowance: Math.random() * balance,
        balance,
        iconUrl: token.iconUrl,
        symbol,
    });
});
const PRECISION = 5;

interface TokenBalancesProps {}

interface TokenBalancesState {}

export class TokenBalances extends React.Component<TokenBalancesProps, TokenBalancesState> {
    public render() {
        return (
            <div>
                <Table selectable={false}>
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
        return _.map(DUMMY_BALANCES, (balance: Balance) => {
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
    private onSendTestToken(symbol: string) {
        // TODO: send some test tokens to account
    }
}

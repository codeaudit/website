import * as _ from 'lodash';
import * as React from 'react';
import {TokenBySymbol, Token} from 'ts/types';
import {Blockchain} from 'ts/blockchain';
import {EnableWalletDialog} from 'ts/components/enable_wallet_dialog';
import {MintButton} from 'ts/components/token_balances/mint_button';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHeaderColumn,
    TableRowColumn,
} from 'material-ui';

const PRECISION = 5;

interface TokenBalancesProps {
    blockchain: Blockchain;
    blockchainErr: string;
    blockchainIsLoaded: boolean;
    tokenBySymbol: TokenBySymbol;
}

interface TokenBalancesState {
    isEnableWalletDialogOpen: boolean;
}

export class TokenBalances extends React.Component<TokenBalancesProps, TokenBalancesState> {
    constructor(props: TokenBalancesProps) {
        super(props);
        this.state = {
            isEnableWalletDialogOpen: false,
        };
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
                            <TableHeaderColumn>Mint test tokens</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {this.renderTableRows()}
                    </TableBody>
                </Table>
                <EnableWalletDialog
                    isOpen={this.state.isEnableWalletDialogOpen}
                    toggleDialogFn={this.toggleEnableWalletDialog.bind(this)}
                />
            </div>
        );
    }
    private renderTableRows() {
        if (!this.props.blockchainIsLoaded || this.props.blockchainErr !== '') {
            return '';
        }
        const iconDimension = 40;
        return _.map(this.props.tokenBySymbol, (token: Token) => {
            return (
                <TableRow key={token.symbol}>
                    <TableRowColumn>
                        <img
                            style={{width: iconDimension, height: iconDimension}}
                            src={token.iconUrl}
                        />
                    </TableRowColumn>
                    <TableRowColumn>{token.balance.toFixed(PRECISION)} {token.symbol}</TableRowColumn>
                    <TableRowColumn>{token.allowance.toFixed(PRECISION)} {token.symbol}</TableRowColumn>
                    <TableRowColumn>
                        <MintButton
                            blockchain={this.props.blockchain}
                            token={token}
                            toggleEnableWalletDialog={this.toggleEnableWalletDialog.bind(this)}
                        />
                    </TableRowColumn>
                </TableRow>
            );
        });
    }
    private toggleEnableWalletDialog(isOpen: boolean) {
        this.setState({
            isEnableWalletDialogOpen: isOpen,
        });
    }
}

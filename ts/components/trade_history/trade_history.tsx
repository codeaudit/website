import * as _ from 'lodash';
import * as React from 'react';
import {Paper, Divider} from 'material-ui';
import {BlockchainErrs} from 'ts/types';
import {Blockchain} from 'ts/blockchain';
import {utils} from 'ts/utils/utils';
import {Fill, TokenBySymbol} from 'ts/types';
import {TradeHistoryItem} from 'ts/components/trade_history/trade_history_item';

interface TradeHistoryProps {
    blockchain: Blockchain;
    blockchainErr: BlockchainErrs;
    blockchainIsLoaded: boolean;
    tokenBySymbol: TokenBySymbol;
    historicalFills: Fill[];
}

interface TradeHistoryState {}

export class TradeHistory extends React.Component<TradeHistoryProps, TradeHistoryState> {
    public render() {
        return (
            <div className="px4">
                <h3>Trade history</h3>
                <Divider />
                <div className="pt2" style={{height: 608, overflow: 'scroll'}}>
                    {this.renderTrades()}
                </div>
            </div>
        );
    }
    private renderTrades() {
        if (!this.props.blockchainIsLoaded || this.props.blockchainErr !== '') {
            return <div />;
        }

        if (this.props.historicalFills.length === 0) {
            return this.renderEmptyNotice();
        }

        return _.map(this.props.historicalFills, (fill, index) => {
            const tokens = _.values(this.props.tokenBySymbol);
            const depositToken = _.find(tokens, (token) => {
                return token.address === fill.tokenM;
            });
            const receiveToken = _.find(tokens, (token) => {
                return token.address === fill.tokenT;
            });
            // For now we don't show history items for orders using custom ERC20
            // tokens the client does not know how to display.
            // TODO: Try to retrieve the name/symbol of an unknown token in order to display it
            if (_.isUndefined(depositToken) || _.isUndefined(receiveToken)) {
                return;
            }
            const exchangeRate = fill.valueT / fill.valueM;
            const fillValueT = exchangeRate * fill.filledValueM;
            const sideToAssetToken = {
                deposit: {
                    amount: fill.filledValueM,
                    symbol: depositToken.symbol,
                },
                receive: {
                    amount: fillValueT,
                    symbol: receiveToken.symbol,
                },
            };
            return (
                <Paper
                    key={`${fill.orderHash}-${fill.filledValueM}-${index}`}
                    className="py1"
                    style={{margin: '3px 3px 15px 3px'}}
                >
                    <TradeHistoryItem
                        orderTakerAddress={fill.taker}
                        orderMakerAddress={fill.maker}
                        sideToAssetToken={sideToAssetToken}
                    />
                </Paper>
            );
        });
    }
    private renderEmptyNotice() {
        return (
            <Paper className="mt1 p2 mx-auto center" style={{width: '80%'}}>
                No filled orders yet.
            </Paper>
        );
    }
}

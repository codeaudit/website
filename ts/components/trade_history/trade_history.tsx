import * as _ from 'lodash';
import * as React from 'react';
import {Paper, Divider} from 'material-ui';
import {utils} from 'ts/utils/utils';
import {Fill, TokenBySymbol} from 'ts/types';
import {TradeHistoryItem} from 'ts/components/trade_history/trade_history_item';
import {tradeHistoryStorage} from 'ts/local_storage/trade_history_storage';

const FILL_POLLING_INTERVAL = 1000;

interface TradeHistoryProps {
    tokenBySymbol: TokenBySymbol;
    userAddress: string;
}

interface TradeHistoryState {
    sortedFills: Fill[];
}

export class TradeHistory extends React.Component<TradeHistoryProps, TradeHistoryState> {
    private fillPollingIntervalId: number;
    public constructor(props: TradeHistoryProps) {
        super(props);
        const sortedFills = this.getSortedFills();
        this.state = {
            sortedFills,
        };
    }
    public componentWillMount() {
        this.startPollingForFills();
    }
    public componentWillUnmount() {
        this.stopPollingForFills();
    }
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
        if (this.state.sortedFills.length === 0) {
            return this.renderEmptyNotice();
        }

        return _.map(this.state.sortedFills, (fill, index) => {
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
            const exchangeRate = fill.valueT.div(fill.valueM);
            const fillValueT = exchangeRate.times(fill.filledValueM);
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
                        tokenBySymbol={this.props.tokenBySymbol}
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
    private startPollingForFills() {
        this.fillPollingIntervalId = window.setInterval(() => {
            const sortedFills = this.getSortedFills();
            this.setState({
                sortedFills,
            });
        }, FILL_POLLING_INTERVAL);
    }
    private stopPollingForFills() {
        clearInterval(this.fillPollingIntervalId);
    }
    private getSortedFills() {
        const fillsByHash = tradeHistoryStorage.getUserFillsByHash(this.props.userAddress);
        const fills = _.values(fillsByHash);
        const sortedFills = _.sortBy(fills, [(fill: Fill) => fill.expiration]);
        return sortedFills;
    }
}

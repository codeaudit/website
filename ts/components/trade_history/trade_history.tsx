import * as _ from 'lodash';
import * as React from 'react';
import {Paper} from 'material-ui';
import {BlockchainErrs} from 'ts/types';
import {Blockchain} from 'ts/blockchain';
import {utils} from 'ts/utils/utils';
import {TradeHistoryItem} from 'ts/components/trade_history/trade_history_item';

interface TradeHistoryProps {
    blockchain: Blockchain;
    blockchainErr: BlockchainErrs;
    blockchainIsLoaded: boolean;
}

interface TradeHistoryState {}

export class TradeHistory extends React.Component<TradeHistoryProps, TradeHistoryState> {
    public render() {
        return (
            <Paper className="p2 my2">
                <h3 style={{marginTop: 0}}>Trade history</h3>
                {this.renderTrades()}
            </Paper>
        );
    }
    private renderTrades() {
        if (!this.props.blockchainIsLoaded || this.props.blockchainErr !== '') {
            return <div />;
        }

        return [
            <Paper key="orderOne" className="py1">
                <TradeHistoryItem
                    orderTakerAddress="0xA82BF9252dF8830410B3766D11fD34a7019fE5FA"
                    orderMakerAddress="0xe834ec434daba538cd1b9fe1582052b880bd7e63"
                    sideToAssetToken={{deposit: {symbol: 'TA', amount: 30}, receive: {symbol: 'TB', amount: 40}}}
                />
            </Paper>,
        ];
    }
}

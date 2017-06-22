import * as _ from 'lodash';
import * as React from 'react';
import Paper from 'material-ui/Paper';
import {utils} from 'ts/utils/utils';
import {colors} from 'material-ui/styles';
import {constants} from 'ts/utils/constants';
import {StatisticByKey, Statistic, ERC20MarketInfo} from 'ts/types';

const ONE_BILLION = 1000000000;

const defaultStats: StatisticByKey = {
    ETHER_MARKET_CAP: {
        title: 'Ether',
        figure: '$7.7B',
    },
    ERC20_TOKEN_MARKET_CAP: {
        title: 'Tokens',
        figure: '$0.5B',
    },
    NUMBER_LIQUID_ERC20_TOKENS: {
        title: 'Liquid Tokens',
        figure: '17',
    },
};

interface StatisticsProps {}

interface StatisticsState {
    stats: StatisticByKey;
}

export class Statistics extends React.Component<StatisticsProps, StatisticsState> {
    public constructor(props: StatisticsProps) {
        super(props);
        this.state = {
            stats: {
                ETHER_MARKET_CAP: {
                    title: 'Ether',
                    figure: '$7.7B',
                },
                ERC20_TOKEN_MARKET_CAP: {
                    title: 'Tokens',
                    figure: '$0.8B',
                },
                NUMBER_LIQUID_ERC20_TOKENS: {
                    title: 'Liquid Tokens',
                    figure: '17',
                },
            },
        };
    }
    public componentWillMount() {
        this.fetchAndSetERC20MarketInfo();
    }
    public render() {
        const colSize = utils.getColSize(_.size(defaultStats));
        return (
            <div>
                {this.renderStats()}
            </div>
        );
    }
    private renderStats() {
        return _.map(_.values(this.state.stats), stat => {
            return (
                <div
                    key={stat.title}
                    className="sm-col sm-col-${colSize} pr3 sm-pl3 pb3"
                    style={{color: colors.grey700}}
                >
                    <Paper
                        className="p2"
                        zDepth={1}
                        style={{backgroundColor: '#f2f2f2'}}
                    >
                        <div className="center" style={{fontSize: 58, fontWeight: 100}}>{stat.figure}</div>
                        <div
                            className="center pt1"
                            style={{textTransform: 'uppercase', fontSize: 25}}
                        >
                            {stat.title}
                        </div>
                    </Paper>
                </div>
            );
        });
    }
    private async fetchAndSetERC20MarketInfo() {
        const endpoint = `${constants.BACKEND_BASE_URL}/erc20_market_info`;
        const response = await fetch(endpoint);
        if (response.status !== 200) {
            return; // fail silently
        }
        const responseBody = await response.text();
        const erc20MarketInfo = JSON.parse(responseBody);
        const numLiquidERC20Tokens = erc20MarketInfo.numLiquidERC20Tokens.toString();
        const erc20MarketCapUsd = erc20MarketInfo.marketCapERC20TokensUsd;
        const etherMarketCapUsd = erc20MarketInfo.etherMarketCapUsd;

        this.setState({
            stats: {
                ETHER_MARKET_CAP: {
                    title: 'Ether',
                    figure: this.formatToBillions(etherMarketCapUsd),
                },
                ERC20_TOKEN_MARKET_CAP: {
                    title: 'Tokens',
                    figure: this.formatToBillions(erc20MarketCapUsd),
                },
                NUMBER_LIQUID_ERC20_TOKENS: {
                    title: 'Liquid Tokens',
                    figure: numLiquidERC20Tokens,
                },
            },
        });
    }
    private formatToBillions(dollarAmount: number): string {
        const billionAmount = dollarAmount / ONE_BILLION;
        return `$${billionAmount.toFixed(1)}B`;
    }
}

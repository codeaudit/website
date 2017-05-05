import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {colors} from 'material-ui/styles';
import {constants} from 'ts/utils/constants';
import {StatisticByKey, Statistic, ERC20MarketInfo} from 'ts/types';

const defaultStats: StatisticByKey = {
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
};

interface StatisticsProps {}

interface StatisticsState {
    erc20MarketInfo: ERC20MarketInfo;
}

export class Statistics extends React.Component<StatisticsProps, StatisticsState> {
    public constructor(props: StatisticsProps) {
        super(props);
        this.state = {
            erc20MarketInfo: undefined,
        };
    }
    public render() {
        const colSize = utils.getColSize(_.size(defaultStats));
        const stats = defaultStats;
        if (!_.isUndefined(this.state.erc20MarketInfo)) {
            stats.NUMBER_LIQUID_ERC20_TOKENS.figure = this.state.erc20MarketInfo.numLiquidERC20Tokens.toString();

            const erc20MarketCapUsd = this.state.erc20MarketInfo.marketCapERC20TokensUsd;
            stats.ERC20_TOKEN_MARKET_CAP.figure = this.formatToBillions(erc20MarketCapUsd);
        }
        return (
            <div>
                {this.renderStats(stats)}
            </div>
        );
    }
    private renderStats(stats: StatisticByKey) {
        return _.map(_.values(defaultStats), (stat) => {
            return (
                <div
                    key={stat.title}
                    className="sm-col sm-col-${colSize} pr4 pb3"
                    style={{color: colors.grey700, textShadow: '0 0 4px #fff'}}
                >
                    <div className="center" style={{fontSize: 58, fontWeight: 100}}>{stat.figure}</div>
                    <div
                        className="center pt1"
                        style={{textTransform: 'uppercase', fontSize: 25}}
                    >
                        {stat.title}
                    </div>
                </div>
            );
        });
    }
    private async fetchStatsAsync() {
        const endpoint = `${constants.BACKEND_BASE_URL}/erc20_market_info`;
        const response = await fetch(endpoint);
        const responseBody = await response.text();
        const erc20MarketInfo = JSON.parse(responseBody);
        this.setState({
            erc20MarketInfo,
        });
    }
    private formatToBillions(dollarAmount: number): string {
        return dollarAmount.toString();
    }
}

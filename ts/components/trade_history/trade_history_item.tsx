import * as _ from 'lodash';
import * as React from 'react';
import * as BigNumber from 'bignumber.js';
import * as ReactTooltip from 'react-tooltip';
import * as moment from 'moment';
import {colors} from 'material-ui/styles';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {Direction, Side, AssetToken, TokenByAddress, Fill, Token} from 'ts/types';
import {Party} from 'ts/components/ui/party';
import {zeroEx} from 'ts/utils/zero_ex';

const PRECISION = 5;
const IDENTICON_DIAMETER = 40;

interface TradeHistoryItemProps {
    fill: Fill;
    tokenByAddress: TokenByAddress;
    userAddress: string;
}

interface TradeHistoryItemState {}

export class TradeHistoryItem extends React.Component<TradeHistoryItemProps, TradeHistoryItemState> {
    public render() {
        const fill = this.props.fill;
        const tokens = _.values(this.props.tokenByAddress);
        const tokenT = _.find(tokens, (token) => {
            return token.address === fill.tokenM;
        });
        const tokenM = _.find(tokens, (token) => {
            return token.address === fill.tokenT;
        });
        // For now we don't show history items for orders using custom ERC20
        // tokens the client does not know how to display.
        // TODO: Try to retrieve the name/symbol of an unknown token in order to display it
        if (_.isUndefined(tokenT) || _.isUndefined(tokenM)) {
            return null;
        }

        const amountColStyle: React.CSSProperties = {
            fontWeight: 100,
            display: 'inline-block',
        };
        const amountColClassNames = 'col col-12 lg-col-4 md-col-4 lg-py2 md-py2 sm-py1 lg-pr2 md-pr2 \
                                     lg-right-align md-right-align sm-center';
        return (
            <div className="clearfix">
                <div className="col col-12 lg-col-1 md-col-1 pt2 lg-pl3 md-pl3">
                    {this.renderDate()}
                </div>
                <div
                    className="col col-12 lg-col-6 md-col-6 lg-pl3 md-pl3"
                    style={{fontSize: 12, fontWeight: 100}}
                >
                    <div className="flex sm-mx-auto xs-mx-auto" style={{paddingTop: 4, width: 168}}>
                        <Party
                            label="Maker"
                            address={fill.maker}
                            identiconDiameter={IDENTICON_DIAMETER}
                        />
                        <i style={{fontSize: 30}} className="zmdi zmdi-swap py3" />
                        <Party
                            label="Taker"
                            address={fill.taker}
                            identiconDiameter={IDENTICON_DIAMETER}
                        />
                    </div>
                </div>
                <div
                    className={amountColClassNames}
                    style={amountColStyle}
                >
                    {this.renderAmounts(tokenM, tokenT)}
                </div>
                <div className="col col-12 lg-col-1 md-col-1 lg-pr3 md-pr3 lg-py3 md-py3 sm-pb1 sm-center">
                    <div className="pt1 lg-right md-right sm-mx-auto" style={{width: 13}}>
                        <a
                            href={`${constants.ETHER_SCAN_ENDPOINT}/tx/${fill.transactionHash}`}
                            target="_blank"
                        >
                            <i className="zmdi zmdi-open-in-new" />
                        </a>
                    </div>
                </div>
            </div>
        );
    }
    private renderAmounts(tokenM: Token, tokenT: Token) {
        const fill = this.props.fill;
        let exchangeRate = fill.valueM.div(fill.valueT);
        const fillValueM = exchangeRate.times(fill.filledValueT);

        let receiveAmount;
        let receiveToken;
        let givenAmount;
        let givenToken;
        if (this.props.userAddress === fill.maker && this.props.userAddress === fill.taker) {
            receiveAmount = new BigNumber(0);
            givenAmount = new BigNumber(0);
            receiveToken = tokenM;
            givenToken = tokenT;
        } else if (this.props.userAddress === fill.maker) {
            receiveAmount = fill.filledValueT;
            givenAmount = fillValueM;
            receiveToken = tokenT;
            givenToken = tokenM;
            exchangeRate = new BigNumber(1).div(exchangeRate);
        } else if (this.props.userAddress === fill.taker) {
            receiveAmount = fillValueM;
            givenAmount = fill.filledValueT;
            receiveToken = tokenM;
            givenToken = tokenT;
        }

        return (
            <div>
                <div
                    style={{color: colors.green400, fontSize: 16}}
                >
                    <span>+{' '}</span>
                    {this.renderAmount(receiveAmount, receiveToken.symbol, receiveToken.decimals)}
                </div>
                <div
                    className="pb1 inline-block"
                    style={{color: colors.red200, fontSize: 16}}
                >
                    <span>-{' '}</span>
                    {this.renderAmount(givenAmount, givenToken.symbol, givenToken.decimals)}
                </div>
                <div style={{color: colors.grey400, fontSize: 14}}>
                    {exchangeRate.toFixed(PRECISION)} {receiveToken.symbol}/{givenToken.symbol}
                </div>
            </div>
        );
    }
    private renderDate() {
        const blockMoment = moment.unix(this.props.fill.blockTimestamp);
        if (!blockMoment.isValid()) {
            return null;
        }

        const dayOfMonth = blockMoment.format('D');
        const monthAbreviation = blockMoment.format('MMM');
        const formattedBlockDate = blockMoment.format('H:mmA - MMMM D, YYYY');
        const dateTooltipId = `${this.props.fill.transactionHash}-date`;

        return (
            <div
                data-tip={true}
                data-for={dateTooltipId}
            >
                <div className="center pt1" style={{fontSize: 13}}>{monthAbreviation}</div>
                <div className="center" style={{fontSize: 24, fontWeight: 100}}>{dayOfMonth}</div>
                <ReactTooltip id={dateTooltipId}>{formattedBlockDate}</ReactTooltip>
            </div>
        );
    }
    private renderAmount(amount: BigNumber, symbol: string, decimals: number) {
        const unitAmount = zeroEx.toUnitAmount(amount, decimals);
        return (
            <span>
                {unitAmount.toFixed(PRECISION)} {symbol}
            </span>
        );
    }
}

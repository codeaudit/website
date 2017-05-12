import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {Direction, SideToAssetToken, Side, AssetToken, Token} from 'ts/types';
import {Party} from 'ts/components/ui/party';
import {zeroEx} from 'ts/utils/zero_ex';

const PRECISION = 5;
const IDENTICON_DIAMETER = 100;

interface VisualOrderProps {
    orderTakerAddress: string;
    orderMakerAddress: string;
    makerAssetToken: AssetToken;
    takerAssetToken: AssetToken;
    makerToken: Token;
    takerToken: Token;
}

interface VisualOrderState {}

export class VisualOrder extends React.Component<VisualOrderProps, VisualOrderState> {
    public render() {
        return (
            <div>
                <div className="clearfix">
                    <div className="col col-5 center">
                        <Party
                            label="Maker"
                            address={this.props.orderMakerAddress}
                            identiconDiameter={IDENTICON_DIAMETER}
                        />
                    </div>
                    <div className="col col-2 center pt1">
                        <div className="pb1">
                            {this.renderAmount(this.props.makerAssetToken, this.props.makerToken)}
                        </div>
                        <div className="lg-p2 md-p2 sm-p1">
                            <i style={{fontSize: 45}} className="zmdi zmdi-swap" />
                        </div>
                        <div className="pt1">
                            {this.renderAmount(this.props.takerAssetToken, this.props.takerToken)}
                        </div>
                    </div>
                    <div className="col col-5 center">
                        <Party
                            label="Taker"
                            address={this.props.orderTakerAddress}
                            identiconDiameter={IDENTICON_DIAMETER}
                        />
                    </div>
                </div>
            </div>
        );
    }
    private renderAmount(assetToken: AssetToken, token: Token) {
        const unitAmount = zeroEx.toUnitAmount(assetToken.amount, token.decimals);
        return (
            <div style={{fontSize: 13}}>
                {unitAmount.toNumber().toFixed(PRECISION)} {token.symbol}
            </div>
        );
    }
}

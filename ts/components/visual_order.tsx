import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {Direction, SideToAssetToken, Side, AssetToken, TokenBySymbol} from 'ts/types';
import {Party} from 'ts/components/ui/party';
import {Ox} from 'ts/utils/Ox';

const PRECISION = 5;
const IDENTICON_DIAMETER = 100;

interface VisualOrderProps {
    orderTakerAddress: string;
    orderMakerAddress: string;
    sideToAssetToken: SideToAssetToken;
    tokenBySymbol: TokenBySymbol;
}

interface VisualOrderState {}

export class VisualOrder extends React.Component<VisualOrderProps, VisualOrderState> {
    public render() {
        const depositAssetToken = this.props.sideToAssetToken[Side.deposit];
        const receiveAssetToken = this.props.sideToAssetToken[Side.receive];
        const depositToken = this.props.tokenBySymbol[depositAssetToken.symbol];
        const receiveToken = this.props.tokenBySymbol[receiveAssetToken.symbol];
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
                    <div className="col col-2 center" style={{paddingTop: 25}}>
                        <div style={{paddingBottom: 6}}>
                            {this.renderAmount(depositAssetToken, depositToken.decimals)}
                        </div>
                        <div className="relative mx-auto" style={{width: 69, height: 54}}>
                            <div className="absolute" style={{top: -18, left: 1}}>
                                <i style={{fontSize: 90}} className="zmdi zmdi-swap" />
                            </div>
                        </div>
                        <div style={{paddingTop: 8}}>
                            {this.renderAmount(receiveAssetToken, receiveToken.decimals)}
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
    private renderAmount(assetToken: AssetToken, decimals: number) {
        const unitAmount = Ox.toUnitAmount(assetToken.amount, decimals);
        return (
            <div style={{fontSize: 13}}>
                {unitAmount.toNumber().toFixed(PRECISION)} {assetToken.symbol}
            </div>
        );
    }
}

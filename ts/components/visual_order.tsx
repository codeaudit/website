import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {Ox} from 'ts/utils/Ox';
import {Step} from 'ts/components/ui/step';
import {Direction, SideToAssetToken, Side, AssetToken} from 'ts/types';
import jazzicon = require('jazzicon');
import ReactTooltip = require('react-tooltip');

const PRECISION = 5;

const styles = {
    address: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '90px',
    },
};

interface VisualOrderProps {
    orderExpiryTimestamp: number;
    orderTakerAddress: string;
    orderMakerAddress: string;
    sideToAssetToken: SideToAssetToken;
}

interface VisualOrderState {}

export class VisualOrder extends React.Component<VisualOrderProps, VisualOrderState> {
    public render() {
        const depositAssetToken = this.props.sideToAssetToken[Side.deposit];
        const receiveAssetToken = this.props.sideToAssetToken[Side.receive];
        const expiryDate = utils.convertToReadableDateTimeFromUnixTimestamp(this.props.orderExpiryTimestamp);
        return (
            <div className="px4">
                <div className="clearfix pt3 px4">
                    <div className="col col-5 center">
                        {this.renderParty('Maker', this.props.orderMakerAddress)}
                    </div>
                    <div className="col col-2 center">
                        {this.renderAmount(depositAssetToken)}
                        <div>
                            <i style={{fontSize: 60}} className="zmdi zmdi-redo" />
                        </div>
                        <div>
                            <i style={{fontSize: 60, transform: 'rotate(180deg)'}} className="zmdi zmdi-redo" />
                        </div>
                        {this.renderAmount(receiveAssetToken)}
                    </div>
                    <div className="col col-5 center">
                        {this.renderParty('Taker', this.props.orderTakerAddress)}
                    </div>
                </div>
                <div className="center pt3 pb2">
                    Expires: {expiryDate} UTC
                </div>
            </div>
        );
    }
    private renderAmount(assetToken: AssetToken) {
        return (
            <div style={{fontSize: 13}}>
                {assetToken.amount.toFixed(PRECISION)} {assetToken.symbol}
            </div>
        );
    }
    private renderParty(party: string, address: string) {
        const tooltipId = `${party}Tooltip`;
        return (
            <div>
                <div className="pb1">{party}</div>
                {this.renderIdenticon(address)}
                <div
                    className="mx-auto pt1"
                    style={styles.address}
                    data-tip={true}
                    data-for={tooltipId}
                >
                    {!_.isEmpty(address) ? address : 'Anybody'}
                </div>
                {!_.isEmpty(address) && <ReactTooltip id={tooltipId}>{address}</ReactTooltip>}
            </div>
        );
    }
    private renderIdenticon(address: string) {
        if (_.isUndefined(address)) {
            address = constants.NULL_ADDRESS;
        }
        const diameter = 100;
        const numericalAddress = this.convertAddressToNumber(address);
        const jazzIcon = jazzicon(diameter, numericalAddress);
        const innerHtml: string = jazzIcon.innerHTML;
        return (
            <div
                className="circle mx-auto relative"
                style={{width: diameter, height: diameter, overflow: 'hidden'}}
            >
                <div
                    dangerouslySetInnerHTML={{__html: innerHtml}}
                />
            </div>
        );
    }
    private convertAddressToNumber(address: string): number {
        const addressWithoutPrefix = address.slice(2, 10);
        const numericanAddress = parseInt(addressWithoutPrefix, 16);
        return numericanAddress;
    }
}

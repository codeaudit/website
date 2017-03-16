import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {RaisedButton, TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {BackButton} from 'ts/components/ui/back_button';
import {Direction, SideToAssetToken, Side, AssetToken} from 'ts/types';
import jazzicon = require('jazzicon');

const MAKER_ADDRESS = '0x75bE4F78AA3699B3A348c84bDB2a96c3Dbb5E2EF';

const styles = {
    address: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '90px',
    },
};

interface SignTransactionProps {
    orderExpiryTimestamp: number;
    orderTakerAddress: string;
    sideToAssetToken: SideToAssetToken;
    updateGenerateOrderStep(direction: Direction): void;
}

interface SignTransactionState {}

export class SignTransaction extends React.Component<SignTransactionProps, SignTransactionState> {
    public render() {
        const depositAssetToken = this.props.sideToAssetToken[Side.deposit];
        const receiveAssetToken = this.props.sideToAssetToken[Side.receive];
        const expiryDate = utils.convertToReadableDateTimeFromUnixTimestamp(this.props.orderExpiryTimestamp);
        return (
            <div className="relative">
                <div
                    className="absolute"
                    style={{left: 15}}
                >
                    <BackButton onClick={this.onBackButtonClick.bind(this)} />
                </div>
                <h3 className="px4">
                    Confirm and sign your order
                </h3>
                <div className="pt2 pb2 px4 flex">
                    <div className="col col-5 center">
                        {this.renderParty('Maker (you)', MAKER_ADDRESS)}
                    </div>
                    <div className="col col-2 center">
                        {this.renderAmount(depositAssetToken)}
                        <div>
                            <i
                                style={{fontSize: 60, transform: 'rotate(180deg)'}}
                                className="material-icons"
                            >
                                keyboard_return
                            </i>
                        </div>
                        <div>
                            <i style={{fontSize: 60}} className="material-icons">keyboard_return</i>
                        </div>
                        {this.renderAmount(receiveAssetToken)}
                    </div>
                    <div className="col col-5 center">
                        {this.renderParty('Taker', this.props.orderTakerAddress)}
                    </div>
                </div>
                <div className="center pt1 pb2">
                    Expires at: {expiryDate} UTC
                </div>
                <div className="flex">
                    <RaisedButton
                        label="Sign order"
                        style={{margin: 12, width: '100%'}}
                        onClick={this.props.updateGenerateOrderStep.bind(this, Direction.forward)}
                    />
                </div>
            </div>
        );
    }
    private renderAmount(assetToken: AssetToken) {
        return (
            <div style={{fontSize: 13}}>
                {assetToken.amount} {assetToken.symbol}
            </div>
        );
    }
    private renderParty(party: string, address: string) {
        return (
            <div>
                <div className="pb1">{party}</div>
                {this.renderIdenticon(address)}
                <div
                    className="mx-auto pt1"
                    style={styles.address}
                >
                    {!_.isEmpty(address) ? address : 'Anybody'}
                </div>
            </div>
        );
    }
    private renderIdenticon(address: string) {
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
    private onBackButtonClick() {
        this.props.updateGenerateOrderStep(Direction.backward);
    }
}

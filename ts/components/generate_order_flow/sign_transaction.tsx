import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {Ox} from 'ts/utils/Ox';
import {Blockchain} from 'ts/blockchain';
import {Step} from 'ts/components/ui/step';
import {Direction, SideToAssetToken, Side, AssetToken, HashData} from 'ts/types';
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

interface SignTransactionProps {
    blockchain: Blockchain;
    hashData: HashData;
    orderExpiryTimestamp: number;
    orderTakerAddress: string;
    orderMakerAddress: string;
    sideToAssetToken: SideToAssetToken;
    updateGenerateOrderStep(direction: Direction): void;
}

interface SignTransactionState {
    isSigning: boolean;
    signingErrMsg: string;
}

export class SignTransaction extends React.Component<SignTransactionProps, SignTransactionState> {
    constructor(props: SignTransactionProps) {
        super(props);
        this.state = {
            isSigning: false,
            signingErrMsg: '',
        };
    }
    public render() {
        const depositAssetToken = this.props.sideToAssetToken[Side.deposit];
        const receiveAssetToken = this.props.sideToAssetToken[Side.receive];
        const expiryDate = utils.convertToReadableDateTimeFromUnixTimestamp(this.props.orderExpiryTimestamp);
        return (
            <Step
                title="Confirm and sign your order"
                actionButtonText="Sign order"
                hasActionButton={true}
                hasBackButton={true}
                onNavigateClick={this.onNavigationClickAsync.bind(this)}
            >
                <div className="clearfix pt3">
                    <div className="col col-5 center">
                        {this.renderParty('Maker (you)', this.props.orderMakerAddress)}
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
                <div className="center pt3 pb2">
                    Expires: {expiryDate} UTC
                </div>
                <div>{this.state.isSigning && 'Signing...'}</div>
            </Step>
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
    private async onNavigationClickAsync(direction: Direction) {
        if (direction === Direction.forward) {
            this.setState({
                isSigning: true,
            });
            const exchangeContractAddr = this.props.blockchain.getExchangeContractAddress();
            const hashData = this.props.hashData;
            const orderHash = Ox.getOrderHash(exchangeContractAddr, hashData.orderMakerAddress,
                            hashData.orderTakerAddress, hashData.depositTokenContractAddr,
                            hashData.receiveTokenContractAddr, hashData.depositAmount,
                            hashData.receiveAmount, hashData.orderExpiryTimestamp);

            const msgHashHex = Ox.getMessageHash(orderHash, hashData.feeRecipientAddress, hashData.makerFee,
                                                 hashData.takerFee);
            let signingErrMsg = '';
            try {
                await this.props.blockchain.sendSignRequestFireAndForgetAsync(msgHashHex);
            } catch (err) {
                // TODO: translate this to a user friendly error message and display it in the UI
                signingErrMsg = '' + err;
            }
            this.setState({
                isSigning: false,
                signingErrMsg,
            });
            if (signingErrMsg === '') {
                this.props.updateGenerateOrderStep(direction);
            }
        } else {
            this.props.updateGenerateOrderStep(direction);
        }
    }
    private convertAddressToNumber(address: string): number {
        const addressWithoutPrefix = address.slice(2, 10);
        const numericanAddress = parseInt(addressWithoutPrefix, 16);
        return numericanAddress;
    }
}

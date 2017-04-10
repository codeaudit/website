import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {constants} from 'ts/utils/constants';
import {Ox} from 'ts/utils/Ox';
import {Blockchain} from 'ts/blockchain';
import {Step} from 'ts/components/ui/step';
import {Direction, SideToAssetToken, HashData} from 'ts/types';
import {VisualOrder} from 'ts/components/visual_order';
import {errorReporter} from 'ts/utils/error_reporter';

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
        const expiryDate = utils.convertToReadableDateTimeFromUnixTimestamp(this.props.orderExpiryTimestamp);
        return (
            <Step
                title="Confirm and sign your order"
                actionButtonText="Sign order"
                hasActionButton={true}
                hasBackButton={true}
                onNavigateClick={this.onNavigationClickAsync.bind(this)}
            >
                <div className="px4">
                    <VisualOrder
                        orderTakerAddress={this.props.orderTakerAddress}
                        orderMakerAddress={this.props.orderMakerAddress}
                        sideToAssetToken={this.props.sideToAssetToken}
                    />
                    <div className="center pt3 pb2">
                        Expires: {expiryDate} UTC
                    </div>
                </div>
                <div>{this.state.isSigning && 'Signing...'}</div>
            </Step>
        );
    }
    private async onNavigationClickAsync(direction: Direction) {
        if (direction === Direction.forward) {
            this.setState({
                isSigning: true,
            });
            const exchangeContractAddr = this.props.blockchain.getExchangeContractAddressIfExists();
            if (_.isUndefined(exchangeContractAddr)) {
                this.setState({
                    isSigning: false,
                    signingErrMsg: 'Exchange contract is not deployed on this network',
                });
                return;
            }
            const hashData = this.props.hashData;
            const orderHash = Ox.getOrderHash(exchangeContractAddr, hashData.orderMakerAddress,
                            hashData.orderTakerAddress, hashData.depositTokenContractAddr,
                            hashData.receiveTokenContractAddr, hashData.feeRecipientAddress,
                            hashData.depositAmount, hashData.receiveAmount, hashData.makerFee,
                            hashData.takerFee, hashData.orderExpiryTimestamp);

            let signingErrMsg = '';
            try {
                await this.props.blockchain.sendSignRequestAsync(orderHash);
            } catch (err) {
                // TODO: translate this to a user friendly error message and display it in the UI
                signingErrMsg = '' + err;
                await errorReporter.reportAsync(err);
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
}

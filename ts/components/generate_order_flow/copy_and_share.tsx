import * as _ from 'lodash';
import * as React from 'react';
import {Step} from 'ts/components/ui/step';
import {OrderJSON} from 'ts/components/order_json';
import {Direction, SideToAssetToken, SignatureData} from 'ts/types';

interface CopyAndShareProps {
    orderExpiryTimestamp: number;
    orderSignatureData: SignatureData;
    orderTakerAddress: string;
    orderMakerAddress: string;
    sideToAssetToken: SideToAssetToken;
    updateGenerateOrderStep(direction: Direction): void;
}

interface CopyAndShareState {}

export class CopyAndShare extends React.Component<CopyAndShareProps, CopyAndShareState> {
    public render() {
        return (
            <Step
                title="Order successfully created and signed!"
                hasActionButton={false}
                hasBackButton={true}
                onNavigateClick={this.props.updateGenerateOrderStep}
            >
                <OrderJSON
                    orderExpiryTimestamp={this.props.orderExpiryTimestamp}
                    orderSignatureData={this.props.orderSignatureData}
                    orderTakerAddress={this.props.orderTakerAddress}
                    orderMakerAddress={this.props.orderMakerAddress}
                    sideToAssetToken={this.props.sideToAssetToken}
                />
            </Step>
        );
    }
}

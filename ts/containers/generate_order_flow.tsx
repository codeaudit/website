import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Store as ReduxStore, Dispatch } from 'redux';
import {ChooseAsset} from 'ts/components/generate_order_flow/choose_asset';
import {GrantAllowance} from 'ts/components/generate_order_flow/grant_allowance';
import {RemainingConfigs} from 'ts/components/generate_order_flow/remaining_configs';
import {SignTransaction} from 'ts/components/generate_order_flow/sign_transaction';
import {CopyAndShare} from 'ts/components/generate_order_flow/copy_and_share';
import {State} from 'ts/redux/reducer';
import {Blockchain} from 'ts/blockchain';
import {
    GenerateOrderSteps,
    Direction,
    TokenBySymbol,
    Side,
    AssetToken,
    SideToAssetToken,
    SignatureData,
} from 'ts/types';
import {
    swapAssetTokenSymbols,
    updateGenerateOrderStep,
    updateChosenAssetToken,
    updateOrderExpiry,
    updateOrderAddress,
} from 'ts/redux/actions';

interface GenerateOrderFlowProps {
    blockchain: Blockchain;
}

interface ConnectedState {
    generateOrderStep: GenerateOrderSteps;
    orderExpiryTimestamp: number;
    orderSignatureData: SignatureData;
    orderTakerAddress: string;
    sideToAssetToken: SideToAssetToken;
}

interface ConnectedDispatch {
    swapAssetTokenSymbols: () => void;
    updateGenerateOrderStep: (direction: Direction) => void;
    updateChosenAssetToken: (side: Side, token: AssetToken) => void;
    updateOrderExpiry: (unixTimestampSec: number) => void;
    updateOrderAddress: (side: Side, address: string) => void;
}

const mapStateToProps = (state: State, ownProps: GenerateOrderFlowProps): ConnectedState => ({
    generateOrderStep: state.generateOrderStep,
    orderExpiryTimestamp: state.orderExpiryTimestamp,
    orderSignatureData: state.orderSignatureData,
    orderTakerAddress: state.orderTakerAddress,
    sideToAssetToken: state.sideToAssetToken,
});

const mapDispatchToProps = (dispatch: Dispatch<State>): ConnectedDispatch => ({
    swapAssetTokenSymbols: () => {
        dispatch(swapAssetTokenSymbols());
    },
    updateChosenAssetToken: (side: Side, token: AssetToken) => {
        dispatch(updateChosenAssetToken(side, token));
    },
    updateGenerateOrderStep: (direction: Direction) => {
        dispatch(updateGenerateOrderStep(direction));
    },
    updateOrderAddress: (side: Side, address: string) => {
        dispatch(updateOrderAddress(side, address));
    },
    updateOrderExpiry: (unixTimestampSec: number) => {
        dispatch(updateOrderExpiry(unixTimestampSec));
    },
});

class GenerateOrderFlowComponent extends React.Component<GenerateOrderFlowProps & ConnectedState &
    ConnectedDispatch, any> {
    public render() {
        const generateOrderStep = this.props.generateOrderStep;
        switch (generateOrderStep) {
            case GenerateOrderSteps.ChooseAssets:
                return (
                    <ChooseAsset
                        sideToAssetToken={this.props.sideToAssetToken}
                        updateGenerateOrderStep={this.props.updateGenerateOrderStep}
                        updateChosenAssetToken={this.props.updateChosenAssetToken}
                        swapAssetTokenSymbols={this.props.swapAssetTokenSymbols}
                    />
                );
            case GenerateOrderSteps.GrantAllowance:
                return (
                    <GrantAllowance
                        sideToAssetToken={this.props.sideToAssetToken}
                        updateGenerateOrderStep={this.props.updateGenerateOrderStep}
                        updateChosenAssetToken={this.props.updateChosenAssetToken}
                    />
                );

            case GenerateOrderSteps.RemainingConfigs:
                return (
                    <RemainingConfigs
                        blockchain={this.props.blockchain}
                        orderExpiryTimestamp={this.props.orderExpiryTimestamp}
                        orderTakerAddress={this.props.orderTakerAddress}
                        updateOrderExpiry={this.props.updateOrderExpiry}
                        updateGenerateOrderStep={this.props.updateGenerateOrderStep}
                        updateOrderAddress={this.props.updateOrderAddress}
                    />
                );

            case GenerateOrderSteps.SignTransaction:
                return (
                    <SignTransaction
                        blockchain={this.props.blockchain}
                        orderExpiryTimestamp={this.props.orderExpiryTimestamp}
                        orderTakerAddress={this.props.orderTakerAddress}
                        sideToAssetToken={this.props.sideToAssetToken}
                        updateGenerateOrderStep={this.props.updateGenerateOrderStep}
                    />
                );

            case GenerateOrderSteps.CopyAndShare:
                return (
                    <CopyAndShare
                        orderExpiryTimestamp={this.props.orderExpiryTimestamp}
                        orderSignatureData={this.props.orderSignatureData}
                        orderTakerAddress={this.props.orderTakerAddress}
                        sideToAssetToken={this.props.sideToAssetToken}
                        updateGenerateOrderStep={this.props.updateGenerateOrderStep}
                    />
                );

            default:
                // tslint:disable
                console.log('Unexpected `generateOrderStep` found: ', generateOrderStep);
                // tslint:enable
                return (
                    <div>An error occured. Please refresh.</div>
                );
        }
    }
}

export const GenerateOrderFlow: React.ComponentClass<GenerateOrderFlowProps> =
  connect(mapStateToProps, mapDispatchToProps)(GenerateOrderFlowComponent);

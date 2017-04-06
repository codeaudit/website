import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'react-redux';
import {Store as ReduxStore, Dispatch} from 'redux';
import {Dispatcher} from 'ts/redux/dispatcher';
import {ChooseAsset} from 'ts/components/generate_order_flow/choose_asset';
import {GrantAllowance} from 'ts/components/generate_order_flow/grant_allowance';
import {RemainingConfigs} from 'ts/components/generate_order_flow/remaining_configs';
import {SignTransaction} from 'ts/components/generate_order_flow/sign_transaction';
import {CopyAndShare} from 'ts/components/generate_order_flow/copy_and_share';
import {State} from 'ts/redux/reducer';
import {Blockchain} from 'ts/blockchain';
import {
    GenerateOrderSteps,
    SideToAssetToken,
    SignatureData,
    HashData,
    TokenBySymbol,
    TabValue,
} from 'ts/types';

interface GenerateOrderFlowProps {
    blockchain: Blockchain;
    hashData: HashData;
    triggerTabChange: (tabValue: TabValue) => void;
    dispatcher: Dispatcher;
}

interface ConnectedState {
    generateOrderStep: GenerateOrderSteps;
    orderExpiryTimestamp: number;
    orderSignatureData: SignatureData;
    orderTakerAddress: string;
    orderMakerAddress: string;
    sideToAssetToken: SideToAssetToken;
    tokenBySymbol: TokenBySymbol;
}

const mapStateToProps = (state: State, ownProps: GenerateOrderFlowProps): ConnectedState => ({
    generateOrderStep: state.generateOrderStep,
    orderExpiryTimestamp: state.orderExpiryTimestamp,
    orderMakerAddress: state.orderMakerAddress,
    orderSignatureData: state.orderSignatureData,
    orderTakerAddress: state.orderTakerAddress,
    sideToAssetToken: state.sideToAssetToken,
    tokenBySymbol: state.tokenBySymbol,
});

class GenerateOrderFlowComponent extends React.Component<GenerateOrderFlowProps & ConnectedState, any> {
    public render() {
        const dispatcher = this.props.dispatcher;
        const generateOrderStep = this.props.generateOrderStep;
        switch (generateOrderStep) {
            case GenerateOrderSteps.ChooseAssets:
                return (
                    <ChooseAsset
                        sideToAssetToken={this.props.sideToAssetToken}
                        dispatcher={dispatcher}
                        tokenBySymbol={this.props.tokenBySymbol}
                        triggerTabChange={this.props.triggerTabChange}
                    />
                );
            case GenerateOrderSteps.GrantAllowance:
                return (
                    <GrantAllowance
                        sideToAssetToken={this.props.sideToAssetToken}
                        dispatcher={dispatcher}
                    />
                );

            case GenerateOrderSteps.RemainingConfigs:
                return (
                    <RemainingConfigs
                        blockchain={this.props.blockchain}
                        orderExpiryTimestamp={this.props.orderExpiryTimestamp}
                        orderTakerAddress={this.props.orderTakerAddress}
                        dispatcher={dispatcher}
                    />
                );

            case GenerateOrderSteps.SignTransaction:
                return (
                    <SignTransaction
                        blockchain={this.props.blockchain}
                        hashData={this.props.hashData}
                        orderExpiryTimestamp={this.props.orderExpiryTimestamp}
                        orderTakerAddress={this.props.orderTakerAddress}
                        orderMakerAddress={this.props.orderMakerAddress}
                        sideToAssetToken={this.props.sideToAssetToken}
                        updateGenerateOrderStep={dispatcher.updateGenerateOrderStep.bind(dispatcher)}
                    />
                );

            case GenerateOrderSteps.CopyAndShare:
                return (
                    <CopyAndShare
                        orderExpiryTimestamp={this.props.orderExpiryTimestamp}
                        orderSignatureData={this.props.orderSignatureData}
                        orderTakerAddress={this.props.orderTakerAddress}
                        orderMakerAddress={this.props.orderMakerAddress}
                        sideToAssetToken={this.props.sideToAssetToken}
                        updateGenerateOrderStep={dispatcher.updateGenerateOrderStep.bind(dispatcher)}
                    />
                );

            default:
                throw utils.spawnSwitchErr('generateOrderStep', generateOrderStep);
        }
    }
}

export const GenerateOrderFlow: React.ComponentClass<GenerateOrderFlowProps> =
  connect(mapStateToProps)(GenerateOrderFlowComponent);

import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Store as ReduxStore, Dispatch } from 'redux';
import {ChooseAsset} from 'ts/components/generate_order/choose_asset';
import {GrantAllowance} from 'ts/components/generate_order/grant_allowance';
import {RemainingConfigs} from 'ts/components/generate_order/remaining_configs';
import {SignTransaction} from 'ts/components/generate_order/sign_transaction';
import {State} from 'ts/redux/reducer';
import {GenerateOrderSteps, Direction, TokenBySymbol, Side, AssetToken, SideToAssetToken} from 'ts/types';
import {
    swapAssetTokenSymbols,
    updateGenerateOrderStep,
    updateChosenAssetToken,
    updateOrderExpiry,
    updateOrderTakerAddress,
} from 'ts/redux/actions';

interface GenerateOrderProps {}

interface ConnectedState {
    generateOrderStep: GenerateOrderSteps;
    orderExpiryTimestamp: number;
    orderTakerAddress: string;
    tokenBySymbol: TokenBySymbol;
    sideToAssetToken: SideToAssetToken;
}

interface ConnectedDispatch {
    swapAssetTokenSymbols: () => void;
    updateGenerateOrderStep: (direction: Direction) => void;
    updateChosenAssetToken: (side: Side, token: AssetToken) => void;
    updateOrderExpiry: (unixTimestampSec: number) => void;
    updateOrderTakerAddress: (taker: string) => void;
}

const mapStateToProps = (state: State, ownProps: GenerateOrderProps): ConnectedState => ({
    generateOrderStep: state.generateOrderStep,
    orderExpiryTimestamp: state.orderExpiryTimestamp,
    orderTakerAddress: state.orderTakerAddress,
    sideToAssetToken: state.sideToAssetToken,
    tokenBySymbol: state.tokenBySymbol,
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
    updateOrderExpiry: (unixTimestampSec: number) => {
        dispatch(updateOrderExpiry(unixTimestampSec));
    },
    updateOrderTakerAddress: (taker: string) => {
        dispatch(updateOrderTakerAddress(taker));
    },
});

class GenerateOrderComponent extends React.Component<GenerateOrderProps & ConnectedState & ConnectedDispatch, any> {
    public render() {
        const generateOrderStep = this.props.generateOrderStep;
        switch (generateOrderStep) {
            case GenerateOrderSteps.ChooseAssets:
                return (
                    <ChooseAsset
                        sideToAssetToken={this.props.sideToAssetToken}
                        tokenBySymbol={this.props.tokenBySymbol}
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
                        orderExpiryTimestamp={this.props.orderExpiryTimestamp}
                        orderTakerAddress={this.props.orderTakerAddress}
                        updateOrderExpiry={this.props.updateOrderExpiry}
                        updateGenerateOrderStep={this.props.updateGenerateOrderStep}
                        updateOrderTakerAddress={this.props.updateOrderTakerAddress}
                    />
                );

            case GenerateOrderSteps.SignTransaction:
                return (
                    <SignTransaction
                        orderExpiryTimestamp={this.props.orderExpiryTimestamp}
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

export const GenerateOrder: React.ComponentClass<GenerateOrderProps> =
  connect(mapStateToProps, mapDispatchToProps)(GenerateOrderComponent);

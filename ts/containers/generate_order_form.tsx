import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Store as ReduxStore, Dispatch } from 'redux';
import {State} from 'ts/redux/reducer';
import {Blockchain} from 'ts/blockchain';
import {GenerateForm} from 'ts/components/generate_order_form/generate_form';
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

interface GenerateOrderFormProps {
    blockchain: Blockchain;
}

interface ConnectedState {
    blockchainIsLoaded: boolean;
    generateOrderStep: GenerateOrderSteps;
    orderExpiryTimestamp: number;
    orderSignatureData: SignatureData;
    orderMakerAddress: string;
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

const mapStateToProps = (state: State, ownProps: GenerateOrderFormProps): ConnectedState => ({
    blockchainIsLoaded: state.blockchainIsLoaded,
    generateOrderStep: state.generateOrderStep,
    orderExpiryTimestamp: state.orderExpiryTimestamp,
    orderMakerAddress: state.orderMakerAddress,
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

class GenerateOrderFormComponent extends React.Component<GenerateOrderFormProps & ConnectedState &
    ConnectedDispatch, any> {
    public render() {
        return (
            <GenerateForm
                blockchain={this.props.blockchain}
                blockchainIsLoaded={this.props.blockchainIsLoaded}
                sideToAssetToken={this.props.sideToAssetToken}
                orderExpiryTimestamp={this.props.orderExpiryTimestamp}
                orderMakerAddress={this.props.orderMakerAddress}
                orderTakerAddress={this.props.orderTakerAddress}
                updateOrderExpiry={this.props.updateOrderExpiry}
                updateOrderAddress={this.props.updateOrderAddress}
                updateChosenAssetToken={this.props.updateChosenAssetToken}
            />
        );
    }
}

export const GenerateOrderForm: React.ComponentClass<GenerateOrderFormProps> =
  connect(mapStateToProps, mapDispatchToProps)(GenerateOrderFormComponent);

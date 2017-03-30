import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'react-redux';
import {Store as ReduxStore, Dispatch} from 'redux';
import {Dispatcher} from 'ts/redux/dispatcher';
import {State} from 'ts/redux/reducer';
import {Blockchain} from 'ts/blockchain';
import {GenerateForm} from 'ts/components/generate_order_form/generate_form';
import {
    SideToAssetToken,
    SignatureData,
    HashData,
    TokenBySymbol,
    TabValue,
} from 'ts/types';

interface GenerateOrderFormProps {
    blockchain: Blockchain;
    hashData: HashData;
    triggerTabChange: (tabValue: TabValue) => void;
    dispatcher: Dispatcher;
}

interface ConnectedState {
    blockchainIsLoaded: boolean;
    orderExpiryTimestamp: number;
    orderSignatureData: SignatureData;
    orderMakerAddress: string;
    orderTakerAddress: string;
    sideToAssetToken: SideToAssetToken;
    tokenBySymbol: TokenBySymbol;
}

const mapStateToProps = (state: State, ownProps: GenerateOrderFormProps): ConnectedState => ({
    blockchainIsLoaded: state.blockchainIsLoaded,
    orderExpiryTimestamp: state.orderExpiryTimestamp,
    orderMakerAddress: state.orderMakerAddress,
    orderSignatureData: state.orderSignatureData,
    orderTakerAddress: state.orderTakerAddress,
    sideToAssetToken: state.sideToAssetToken,
    tokenBySymbol: state.tokenBySymbol,
});

class GenerateOrderFormComponent extends React.Component<GenerateOrderFormProps & ConnectedState, any> {
    public render() {
        return (
            <GenerateForm
                blockchain={this.props.blockchain}
                blockchainIsLoaded={this.props.blockchainIsLoaded}
                sideToAssetToken={this.props.sideToAssetToken}
                orderSignatureData={this.props.orderSignatureData}
                orderExpiryTimestamp={this.props.orderExpiryTimestamp}
                orderMakerAddress={this.props.orderMakerAddress}
                orderTakerAddress={this.props.orderTakerAddress}
                dispatcher={this.props.dispatcher}
                hashData={this.props.hashData}
                tokenBySymbol={this.props.tokenBySymbol}
                triggerTabChange={this.props.triggerTabChange}
            />
        );
    }
}

export const GenerateOrderForm: React.ComponentClass<GenerateOrderFormProps> =
  connect(mapStateToProps)(GenerateOrderFormComponent);

import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'react-redux';
import {Store as ReduxStore, Dispatch} from 'redux';
import {Dispatcher} from 'ts/redux/dispatcher';
import {State} from 'ts/redux/reducer';
import {Blockchain} from 'ts/blockchain';
import {GenerateOrderForm as GenerateOrderFormComponent} from 'ts/components/generate_order/generate_order_form';
import {
    SideToAssetToken,
    SignatureData,
    HashData,
    TokenByAddress,
    MenuItemValue,
    BlockchainErrs,
} from 'ts/types';

interface GenerateOrderFormProps {
    blockchain: Blockchain;
    hashData: HashData;
    triggerMenuClick: (menuItemValue: MenuItemValue) => void;
    dispatcher: Dispatcher;
}

interface ConnectedState {
    blockchainErr: BlockchainErrs;
    blockchainIsLoaded: boolean;
    orderExpiryTimestamp: number;
    orderSignatureData: SignatureData;
    userAddress: string;
    orderTakerAddress: string;
    sideToAssetToken: SideToAssetToken;
    tokenByAddress: TokenByAddress;
}

const mapStateToProps = (state: State, ownProps: GenerateOrderFormProps): ConnectedState => ({
    blockchainErr: state.blockchainErr,
    blockchainIsLoaded: state.blockchainIsLoaded,
    orderExpiryTimestamp: state.orderExpiryTimestamp,
    orderSignatureData: state.orderSignatureData,
    orderTakerAddress: state.orderTakerAddress,
    sideToAssetToken: state.sideToAssetToken,
    tokenByAddress: state.tokenByAddress,
    userAddress: state.userAddress,
});

export const GenerateOrderForm: React.ComponentClass<GenerateOrderFormProps> =
  connect(mapStateToProps)(GenerateOrderFormComponent);

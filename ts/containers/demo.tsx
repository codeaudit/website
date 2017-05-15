import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'react-redux';
import {Store as ReduxStore, Dispatch} from 'redux';
import {State} from 'ts/redux/reducer';
import {constants} from 'ts/utils/constants';
import {Dispatcher} from 'ts/redux/dispatcher';
import {Side, HashData, TokenByAddress, BlockchainErrs, Fill, Order, ScreenWidths} from 'ts/types';
import {
    Demo as DemoComponent,
    DemoAllProps as DemoComponentAllProps,
    DemoPassedProps as DemoComponentPassedProps,
} from 'ts/components/demo';
import BigNumber = require('bignumber.js');

interface MapStateToProps {
    blockchainErr: BlockchainErrs;
    blockchainIsLoaded: boolean;
    hashData: HashData;
    networkId: number;
    orderFillAmount: number;
    tokenByAddress: TokenByAddress;
    userEtherBalance: number;
    screenWidth: ScreenWidths;
    shouldBlockchainErrDialogBeOpen: boolean;
    userAddress: string;
    userSuppliedOrderCache: Order;
}

interface ConnectedState {}

interface ConnectedDispatch {
    dispatcher: Dispatcher;
}

const mapStateToProps = (state: State, ownProps: DemoComponentAllProps): ConnectedState => {
    const receiveAssetToken = state.sideToAssetToken[Side.receive];
    const depositAssetToken = state.sideToAssetToken[Side.deposit];
    const receiveAddress = !_.isUndefined(receiveAssetToken.address) ?
                          receiveAssetToken.address : constants.NULL_ADDRESS;
    const depositAddress = !_.isUndefined(depositAssetToken.address) ?
                          depositAssetToken.address : constants.NULL_ADDRESS;
    const receiveAmount = !_.isUndefined(receiveAssetToken.amount) ?
                          receiveAssetToken.amount : new BigNumber(0);
    const depositAmount = !_.isUndefined(depositAssetToken.amount) ?
                          depositAssetToken.amount : new BigNumber(0);
    const hashData = {
        depositAmount,
        depositTokenContractAddr: depositAddress,
        feeRecipientAddress: constants.FEE_RECIPIENT_ADDRESS,
        makerFee: constants.MAKER_FEE,
        orderExpiryTimestamp: state.orderExpiryTimestamp,
        orderMakerAddress: state.userAddress,
        orderTakerAddress: state.orderTakerAddress !== '' ? state.orderTakerAddress : constants.NULL_ADDRESS,
        receiveAmount,
        receiveTokenContractAddr: receiveAddress,
        takerFee: constants.TAKER_FEE,
        orderSalt: state.orderSalt,
    };
    return {
        blockchainErr: state.blockchainErr,
        blockchainIsLoaded: state.blockchainIsLoaded,
        networkId: state.networkId,
        orderFillAmount: state.orderFillAmount,
        hashData,
        screenWidth: state.screenWidth,
        shouldBlockchainErrDialogBeOpen: state.shouldBlockchainErrDialogBeOpen,
        tokenByAddress: state.tokenByAddress,
        userAddress: state.userAddress,
        userEtherBalance: state.userEtherBalance,
        userSuppliedOrderCache: state.userSuppliedOrderCache,
        flashMessage: state.flashMessage,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<State>): ConnectedDispatch => ({
    dispatcher: new Dispatcher(dispatch),
});

export const Demo: React.ComponentClass<DemoComponentPassedProps> =
  connect(mapStateToProps, mapDispatchToProps)(DemoComponent);

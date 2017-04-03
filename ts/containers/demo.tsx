import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'react-redux';
import {Store as ReduxStore, Dispatch} from 'redux';
import {State} from 'ts/redux/reducer';
import {constants} from 'ts/utils/constants';
import {Dispatcher} from 'ts/redux/dispatcher';
import {Side, HashData, TokenBySymbol, BlockchainErrs} from 'ts/types';
import {
    Demo as DemoComponent,
    DemoAllProps as DemoComponentAllProps,
    DemoPassedProps as DemoComponentPassedProps,
} from 'ts/components/demo';

interface MapStateToProps {
    blockchainErr: BlockchainErrs;
    blockchainIsLoaded: boolean;
    hashData: HashData;
    networkId: number;
    orderFillAmount: number;
    tokenBySymbol: TokenBySymbol;
    userEtherBalance: number;
    orderMakerAddress: string;
    shouldNotDeployedDialogBeOpen: boolean;
}

interface ConnectedState {}

interface ConnectedDispatch {
    dispatcher: Dispatcher;
}

const mapStateToProps = (state: State, ownProps: DemoComponentAllProps): ConnectedState => {
    const receiveSymbol = state.sideToAssetToken[Side.receive].symbol;
    const depositSymbol = state.sideToAssetToken[Side.deposit].symbol;
    const hashData = {
        depositAmount: state.sideToAssetToken[Side.deposit].amount,
        depositTokenContractAddr: state.tokenBySymbol[depositSymbol].address,
        feeRecipientAddress: constants.FEE_RECIPIENT_ADDRESS,
        makerFee: constants.MAKER_FEE,
        orderExpiryTimestamp: state.orderExpiryTimestamp,
        orderMakerAddress: state.orderMakerAddress,
        orderTakerAddress: state.orderTakerAddress !== '' ? state.orderTakerAddress : constants.NULL_ADDRESS,
        receiveAmount: state.sideToAssetToken[Side.receive].amount,
        receiveTokenContractAddr: state.tokenBySymbol[receiveSymbol].address,
        takerFee: constants.TAKER_FEE,
    };
    return {
        blockchainErr: state.blockchainErr,
        blockchainIsLoaded: state.blockchainIsLoaded,
        networkId: state.networkId,
        orderFillAmount: state.orderFillAmount,
        orderMakerAddress: state.orderMakerAddress,
        hashData,
        shouldNotDeployedDialogBeOpen: state.shouldNotDeployedDialogBeOpen,
        tokenBySymbol: state.tokenBySymbol,
        userEtherBalance: state.userEtherBalance,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<State>): ConnectedDispatch => ({
    dispatcher: new Dispatcher(dispatch),
});

export const Demo: React.ComponentClass<DemoComponentPassedProps> =
  connect(mapStateToProps, mapDispatchToProps)(DemoComponent);

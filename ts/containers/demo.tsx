import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'react-redux';
import {Store as ReduxStore, Dispatch} from 'redux';
import {State} from 'ts/redux/reducer';
import {constants} from 'ts/utils/constants';
import {Side, HashData} from 'ts/types';
import {
    Demo as DemoComponent,
    DemoAllProps as DemoComponentAllProps,
    DemoPassedProps as DemoComponentPassedProps,
} from 'ts/components/demo';

interface MapStateToProps {
    hashData: HashData;
    networkId: number;
}

interface ConnectedState {}

interface ConnectedDispatch {
    dispatch: Dispatch<State>;
}

const mapStateToProps = (state: State, ownProps: DemoComponentAllProps): ConnectedState => {
    const hashData = {
        depositAmount: state.sideToAssetToken[Side.deposit].amount,
        depositTokenContractAddr: constants.NULL_ADDRESS,
        feeRecipientAddress: constants.NULL_ADDRESS,
        makerFee: 0,
        orderExpiryTimestamp: state.orderExpiryTimestamp,
        orderMakerAddress: state.orderMakerAddress,
        orderTakerAddress: state.orderTakerAddress !== '' ? state.orderTakerAddress : constants.NULL_ADDRESS,
        receiveAmount: state.sideToAssetToken[Side.receive].amount,
        receiveTokenContractAddr: constants.NULL_ADDRESS,
        takerFee: 0,
    };
    return {
        networkId: state.networkId,
        hashData,
    };
};

const mapDispatchToProps = (dispatch: Dispatch<State>): ConnectedDispatch => {
    return {
        dispatch,
    };
};

export const Demo: React.ComponentClass<DemoComponentPassedProps> =
  connect(mapStateToProps, mapDispatchToProps)(DemoComponent);

import * as _ from 'lodash';
import * as React from 'react';
import {connect} from 'react-redux';
import {Store as ReduxStore, Dispatch} from 'redux';
import {State} from 'ts/redux/reducer';
import {Blockchain} from 'ts/blockchain';
import {
    DemoForm as DemoComponent,
    DemoFormAllProps as DemoComponentAllProps,
    DemoFormPassedProps as DemoComponentPassedProps,
} from 'ts/components/demo_form';

interface MapStateToProps {
    networkId: number;
}

interface ConnectedState {}

interface ConnectedDispatch {
    dispatch: Dispatch<State>;
}

const mapStateToProps = (state: State, ownProps: DemoComponentAllProps): ConnectedState => ({
    networkId: state.networkId,
});

const mapDispatchToProps = (dispatch: Dispatch<State>): ConnectedDispatch => {
    return {
        dispatch,
    };
};

export const Demo: React.ComponentClass<DemoComponentPassedProps> =
  connect(mapStateToProps, mapDispatchToProps)(DemoComponent);

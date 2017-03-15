import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Store as ReduxStore, Dispatch } from 'redux';
import {ChooseAsset} from 'ts/components/generate_order/choose_asset';
import {GrantAllowance} from 'ts/components/generate_order/grant_allowance';
import {State} from 'ts/redux/reducer';
import {generateOrderSteps} from 'ts/enums';
import {updateGenerateOrderStep} from 'ts/redux/actions';

interface GenerateOrderProps {}

interface ConnectedState {
  generateOrderStep: generateOrderSteps;
}

interface ConnectedDispatch {
  updateGenerateOrderStep: (step: generateOrderSteps) => void;
}

const mapStateToProps = (state: State, ownProps: GenerateOrderProps): ConnectedState => ({
    generateOrderStep: state.generateOrderStep,
});

const mapDispatchToProps = (dispatch: Dispatch<State>): ConnectedDispatch => ({
  updateGenerateOrderStep: (step: generateOrderSteps) => {
      dispatch(updateGenerateOrderStep(step));
  },
});

class GenerateOrderComponent extends React.Component<GenerateOrderProps & ConnectedState & ConnectedDispatch, any> {
    public render() {
        const generateOrderStep = this.props.generateOrderStep;
        switch (generateOrderStep) {
            case generateOrderSteps.chooseAssets:
                return (
                    <ChooseAsset onContinueClick={this.props.updateGenerateOrderStep} />
                );
            case generateOrderSteps.grantAllowance:
                return (
                    <GrantAllowance />
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

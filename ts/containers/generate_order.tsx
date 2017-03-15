import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Store as ReduxStore, Dispatch } from 'redux';
import {ChooseAsset} from 'ts/components/generate_order/choose_asset';
import {GrantAllowance} from 'ts/components/generate_order/grant_allowance';
import {State} from 'ts/redux/reducer';
import {generateOrderSteps, TokenBySymbol, Side, AssetToken, SideToAssetToken} from 'ts/types';
import {
    updateGenerateOrderStep,
    updateChosenAssetToken,
    swapAssetTokenSymbols,
} from 'ts/redux/actions';

interface GenerateOrderProps {}

interface ConnectedState {
  generateOrderStep: generateOrderSteps;
  tokenBySymbol: TokenBySymbol;
  sideToAssetToken: SideToAssetToken;
}

interface ConnectedDispatch {
  updateGenerateOrderStep: (step: generateOrderSteps) => void;
  updateChosenAssetToken: (side: Side, token: AssetToken) => void;
  swapAssetTokenSymbols: () => void;
}

const mapStateToProps = (state: State, ownProps: GenerateOrderProps): ConnectedState => ({
    generateOrderStep: state.generateOrderStep,
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
                    <ChooseAsset
                        sideToAssetToken={this.props.sideToAssetToken}
                        tokenBySymbol={this.props.tokenBySymbol}
                        updateGenerateOrderStep={this.props.updateGenerateOrderStep}
                        updateChosenAssetToken={this.props.updateChosenAssetToken}
                        swapAssetTokenSymbols={this.props.swapAssetTokenSymbols}
                    />
                );
            case generateOrderSteps.grantAllowance:
                return (
                    <GrantAllowance
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

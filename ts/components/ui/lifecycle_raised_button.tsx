import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {Token} from 'ts/types';
import {Blockchain} from 'ts/blockchain';
import {EnableWalletDialog} from 'ts/components/enable_wallet_dialog';
import {
    RaisedButton,
} from 'material-ui';

const COMPLETE_STATE_SHOW_LENGTH_MS = 2000;

enum ButtonState {
  READY,
  LOADING,
  COMPLETE,
};

interface LifeCycleRaisedButtonProps {
    labelReady: string;
    labelLoading: string;
    labelComplete: string;
    onClickAsyncFn: () => void;
}

interface LifeCycleRaisedButtonState {
    buttonState: ButtonState;
}

export class LifeCycleRaisedButton extends
    React.Component<LifeCycleRaisedButtonProps, LifeCycleRaisedButtonState> {
    private buttonTimeoutId: number;
    constructor(props: LifeCycleRaisedButtonProps) {
        super(props);
        this.state = {
            buttonState: ButtonState.READY,
        };
    }
    public componentWillUnmount() {
        clearTimeout(this.buttonTimeoutId);
    }
    public render() {
        let label;
        switch (this.state.buttonState) {
            case ButtonState.READY:
                label = this.props.labelReady;
                break;
            case ButtonState.LOADING:
                label = this.props.labelLoading;
                break;
            case ButtonState.COMPLETE:
                label = this.props.labelComplete;
                break;
            default:
                throw new Error(`Unexpected ButtonState encountered: ${this.state.buttonState}`);
        }
        return (
            <RaisedButton
                label={label}
                style={{margin: 12, width: '100%'}}
                onClick={this.onClickAsync.bind(this)}
                disabled={this.state.buttonState !== ButtonState.READY}
            />
        );
    }
    public async onClickAsync() {
        this.setState({
            buttonState: ButtonState.LOADING,
        });
        await this.props.onClickAsyncFn();
        this.setState({
            buttonState: ButtonState.COMPLETE,
        });
        this.buttonTimeoutId = window.setTimeout(() => {
            this.setState({
                buttonState: ButtonState.READY,
            });
        }, COMPLETE_STATE_SHOW_LENGTH_MS);
    }
}

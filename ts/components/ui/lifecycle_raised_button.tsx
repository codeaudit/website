import * as _ from 'lodash';
import * as React from 'react';
import {utils} from 'ts/utils/utils';
import {Token} from 'ts/types';
import {Blockchain} from 'ts/blockchain';
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
    isHidden?: boolean;
    labelReady: string;
    labelLoading: string;
    labelComplete: string;
    onClickAsyncFn: () => boolean;
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
        if (this.props.isHidden === true) {
            return <span />;
        }

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
                throw utils.spawnSwitchErr('ButtonState', this.state.buttonState);
        }
        return (
            <RaisedButton
                label={label}
                style={{margin: 12, width: '100%'}}
                onTouchTap={this.onClickAsync.bind(this)}
                disabled={this.state.buttonState !== ButtonState.READY}
            />
        );
    }
    public async onClickAsync() {
        this.setState({
            buttonState: ButtonState.LOADING,
        });
        const didSucceed = await this.props.onClickAsyncFn();
        if (didSucceed) {
            this.setState({
                buttonState: ButtonState.COMPLETE,
            });
            this.buttonTimeoutId = window.setTimeout(() => {
                this.setState({
                    buttonState: ButtonState.READY,
                });
            }, COMPLETE_STATE_SHOW_LENGTH_MS);
        } else {
            this.setState({
                buttonState: ButtonState.READY,
            });
        }
    }
}

import * as _ from 'lodash';
import * as React from 'react';
import Snackbar from 'material-ui/Snackbar';
import {Dispatcher} from 'ts/redux/dispatcher';

const SHOW_DURATION_MS = 4000;

interface FlashMessageProps {
    dispatcher: Dispatcher;
    flashMessage?: string;
}

interface FlashMessageState {}

export class FlashMessage extends React.Component<FlashMessageProps, FlashMessageState> {
    public render() {
        if (!_.isUndefined(this.props.flashMessage)) {
            return (
                <Snackbar
                    open={true}
                    message={this.props.flashMessage}
                    autoHideDuration={SHOW_DURATION_MS}
                    onRequestClose={this.onClose.bind(this)}
                />
            );
        } else {
            return null;
        }
    }
    private onClose() {
        this.props.dispatcher.hideFlashMessage();
    }
}

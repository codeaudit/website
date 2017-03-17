import * as _ from 'lodash';
import * as React from 'react';
import {RaisedButton} from 'material-ui';
import {utils} from 'ts/utils/utils';
import {BackButton} from 'ts/components/ui/back_button';
import {Direction} from 'ts/types';

interface StepProps {
    actionButtonText?: string;
    hasActionButton: boolean;
    hasBackButton: boolean;
    title: React.ReactNode;
    onNavigateClick?(direction: Direction): void;
}

interface StepState {}

export class Step extends React.Component<StepProps, StepState> {
    public render() {
        return (
            <div className="relative" style={{height: 419}}>
                {this.props.hasBackButton && this.renderBackButton()}
                <h3 className="px4 center">
                    {this.props.title}
                </h3>
                <div className="pt2 pb2 px4 clearfix">
                    {this.props.children}
                </div>
                {this.props.hasActionButton && this.renderActionButton()}
            </div>
        );
    }
    private renderBackButton() {
        return (
            <div
                className="absolute"
                style={{left: 15, top: -1}}
            >
                <BackButton onClick={this.onNavigateClick.bind(this, Direction.backward)} />
            </div>
        );
    }
    private renderActionButton() {
        return (
            <div className="absolute" style={{bottom: 0, right: 25, width: 575}}>
                <RaisedButton
                    label={this.props.actionButtonText}
                    style={{margin: 12, width: '100%'}}
                    onClick={this.onNavigateClick.bind(this, Direction.forward)}
                />
            </div>
        );
    }
    private onNavigateClick(direction: Direction) {
        this.props.onNavigateClick(direction);
    }
}
